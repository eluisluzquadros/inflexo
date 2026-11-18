"""Inflexão Nº 02 · CO₂ no ar (EXP-327, H3).

A curva de Keeling ainda acelera: não há inflexão matemática para mostrar. A virada é um cruzamento de limite,
calculado e não escolhido: o primeiro ano em que o CO₂ do ar passa do MAIOR valor dos 800 mil anos anteriores
à era industrial, medido no gelo da Antártida.

Fontes (NOAA/NCEI e NOAA GML, públicas):
  - registro composto de 800 mil anos (Bereiter et al. 2015): antarctica2015co2composite.txt
  - Law Dome, 2.000 anos (MacFarling Meure et al. 2006): law2006.txt, spline e amostras brutas
  - Mauna Loa, média anual desde 1959: co2_annmean_mlo.csv

O máximo natural usa só idades de gás anteriores a 1750 (idade > 200 anos antes de 1950), para não contar o
próprio aumento industrial. A robustez é conferida com o corte em 1.000 anos.

Uso: py -I pipeline/scripts/co2_ar.py
Saída: pipeline/output/co2_ar.json
"""
import csv
import hashlib
import json
import pathlib
import re
import urllib.request

RAIZ = pathlib.Path(__file__).resolve().parents[2]
BRUTO = RAIZ / "pipeline" / "data" / "raw"
SAIDA = RAIZ / "pipeline" / "output" / "co2_ar.json"
FONTES = {
    "composto_800k": "https://www.ncei.noaa.gov/pub/data/paleo/icecore/antarctica/antarctica2015co2composite.txt",
    "law_dome": "https://www.ncei.noaa.gov/pub/data/paleo/icecore/antarctica/law/law2006.txt",
    "mauna_loa": "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv",
}
ARQUIVO = {"composto_800k": "co2_composite_800k.txt", "law_dome": "law2006.txt", "mauna_loa": "co2_annmean_mlo.csv"}


def baixar():
    sha = {}
    for k, url in FONTES.items():
        p = BRUTO / ARQUIVO[k]
        if not p.exists():
            BRUTO.mkdir(parents=True, exist_ok=True)
            req = urllib.request.Request(url, headers={"User-Agent": "inflexo-pipeline/1.0"})
            with urllib.request.urlopen(req, timeout=300) as r:
                p.write_bytes(r.read())
        sha[k] = hashlib.sha256(p.read_bytes()).hexdigest()
    return sha


def composto():
    linhas = (BRUTO / ARQUIVO["composto_800k"]).read_text(encoding="utf-8-sig").splitlines()
    i = next(n for n, l in enumerate(linhas) if l.startswith("age_gas_calBP"))
    out = []
    for l in linhas[i + 1:]:
        p = l.split()
        if len(p) >= 2:
            out.append((float(p[0]), float(p[1])))  # (anos antes de 1950, ppm)
    return out


def law_dome():
    linhas = (BRUTO / ARQUIVO["law_dome"]).read_text(encoding="latin-1").splitlines()
    i = next(n for n, l in enumerate(linhas) if l.startswith("YearAD CH4spl"))
    spline = []
    for l in linhas[i + 1:]:
        p = l.split()
        if len(p) < 6:
            break
        spline.append((float(p[4]), float(p[5])))
    j = next(n for n, l in enumerate(linhas) if l.startswith("3. CO2 by Age"))
    k = next(n for n in range(j, len(linhas)) if linhas[n].startswith("SampleType"))
    amostras = []
    for l in linhas[k + 1:]:
        m = re.match(r"^\s*(\S.*?)\s+(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)", l)
        if not m:
            if amostras:
                break
            continue
        amostras.append((m.group(1), float(m.group(2)), float(m.group(3))))  # (tipo, ano do gás, ppm)
    return spline, amostras


def mauna_loa():
    linhas = [l for l in (BRUTO / ARQUIVO["mauna_loa"]).read_text(encoding="utf-8").splitlines() if l and not l.startswith("#")]
    return [(int(r["year"]), float(r["mean"])) for r in csv.DictReader(linhas)]


def primeiro_acima(serie, limite):
    """Primeiro ano a partir do qual a série fica acima do limite para sempre."""
    ultimo_abaixo = max((a for a, v in serie if v <= limite), default=None)
    depois = [a for a, v in serie if v > limite and (ultimo_abaixo is None or a > ultimo_abaixo)]
    return min(depois) if depois else None


def main():
    sha = baixar()
    C = composto()
    spline, amostras = law_dome()
    ML = mauna_loa()
    pre = [(a, v) for a, v in C if a > 200]          # antes de 1750
    pre1000 = [(a, v) for a, v in C if a > 1000]     # antes de 950, para conferir
    idade_max, maximo = max(pre, key=lambda x: x[1])
    maximo_1000 = max(v for _, v in pre1000)
    ano_spline = primeiro_acima(spline, maximo)
    gelo = [(a, v) for t, a, v in amostras if t.upper().startswith(("DSS", "DE08"))]
    ano_amostras = primeiro_acima(sorted(gelo), maximo)
    out = {
        "fontes": FONTES,
        "sha256": sha,
        "maximo_natural": {"ppm": maximo, "idade_anos_antes_de_1950": idade_max,
                           "corte": "idades de gás anteriores a 1750", "conferencia_corte_950": maximo_1000},
        "cruzamento": {"ano_spline": ano_spline, "ano_amostras_gelo": ano_amostras,
                       "definicao": "primeiro ano a partir do qual o CO₂ fica acima do máximo natural de 800 mil anos"},
        "minimo_natural": min(v for _, v in pre),
        "mauna_loa_ultimo": {"ano": ML[-1][0], "ppm": ML[-1][1]},
        "composto": [{"idade": a, "ppm": v} for a, v in C if a > 200],
        "law_dome_spline": [{"ano": a, "ppm": v} for a, v in spline],
        "mauna_loa": [{"ano": a, "ppm": v} for a, v in ML],
    }
    SAIDA.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print("máximo natural", maximo, "ppm, há", round(idade_max + (2026 - 1950)), "anos | conferência com corte em 950:", maximo_1000)
    print("cruzamento: spline", ano_spline, "| amostras de gelo", ano_amostras, f"({len(gelo)} amostras)")
    print("mínimo natural", out["minimo_natural"], "| Mauna Loa", ML[-1])


if __name__ == "__main__":
    main()
