"""Inflexão Nº 01 · População humana (EXP-327).

Baixa o arquivo oficial da ONU (World Population Prospects 2024, indicadores demográficos, variante média),
registra o SHA-256, extrai a série mundial e calcula, sem escolher à mão:
  - o ponto de inflexão da curva: o ano de maior aumento absoluto da população (máximo de dP/dt);
  - o pico da taxa de crescimento (%), que é outra medida e entra só como referência;
  - o pico da população projetada.
1950–2023 é estimativa; 2024–2100 é projeção (a peça desenha as duas de forma diferente).

Uso: py -I pipeline/scripts/populacao_mundo.py
Saída: pipeline/output/populacao_mundo_wpp2024.json
"""
import csv
import gzip
import hashlib
import json
import pathlib
import urllib.request

RAIZ = pathlib.Path(__file__).resolve().parents[2]
URL = ("https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/"
       "WPP2024_Demographic_Indicators_Medium.csv.gz")
BRUTO = RAIZ / "pipeline" / "data" / "raw" / "WPP2024_Demographic_Indicators_Medium.csv.gz"
SAIDA = RAIZ / "pipeline" / "output" / "populacao_mundo_wpp2024.json"
ULTIMO_ANO_ESTIMADO = 2023  # a WPP 2024 estima até 2023 e projeta a partir de 2024


def baixar():
    if not BRUTO.exists():
        BRUTO.parent.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(URL, headers={"User-Agent": "inflexo-pipeline/1.0"})
        with urllib.request.urlopen(req, timeout=300) as r:
            BRUTO.write_bytes(r.read())
    return hashlib.sha256(BRUTO.read_bytes()).hexdigest()


def main():
    sha = baixar()
    linhas = [r for r in csv.DictReader(gzip.open(BRUTO, "rt", encoding="utf-8"))
              if r["Location"] == "World" and r["Variant"] == "Medium"]
    serie = []
    for r in sorted(linhas, key=lambda r: int(r["Time"])):
        if not (r["TPopulation1July"] and r["PopChange"] and r["PopGrowthRate"]):
            continue
        ano = int(r["Time"])
        serie.append({
            "ano": ano,
            "populacao_mi": round(float(r["TPopulation1July"]) / 1000, 3),   # milhões, 1º de julho
            "aumento_mi": round(float(r["PopChange"]) / 1000, 3),             # milhões no ano
            "taxa_pct": float(r["PopGrowthRate"]),
            "projecao": ano > ULTIMO_ANO_ESTIMADO,
        })
    est = [p for p in serie if not p["projecao"]]
    inflexao = max(est, key=lambda p: p["aumento_mi"])
    segundo = max((p for p in est if abs(p["ano"] - inflexao["ano"]) > 10), key=lambda p: p["aumento_mi"])
    pico_taxa = max(est, key=lambda p: p["taxa_pct"])
    pico_pop = max(serie, key=lambda p: p["populacao_mi"])
    plato = [p["ano"] for p in est if p["aumento_mi"] >= 0.97 * inflexao["aumento_mi"]]
    out = {
        "fonte": "Nações Unidas, DESA, Divisão de População. World Population Prospects 2024, variante média.",
        "url": URL,
        "sha256": sha,
        "ultimo_ano_estimado": ULTIMO_ANO_ESTIMADO,
        "inflexao": {"ano": inflexao["ano"], "aumento_mi": inflexao["aumento_mi"],
                     "populacao_mi": inflexao["populacao_mi"],
                     "definicao": "ano de maior aumento absoluto da população (máximo de dP/dt), só estimativas",
                     "plato_97pct": plato,
                     "segundo_maior_fora_do_plato": {"ano": segundo["ano"], "aumento_mi": segundo["aumento_mi"]}},
        "pico_taxa": {"ano": pico_taxa["ano"], "taxa_pct": pico_taxa["taxa_pct"]},
        "pico_populacao_projetado": {"ano": pico_pop["ano"], "populacao_mi": pico_pop["populacao_mi"]},
        "serie": serie,
    }
    SAIDA.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print("sha256", sha)
    print("inflexão", out["inflexao"]["ano"], out["inflexao"]["aumento_mi"], "mi/ano; platô", plato,
          "| segundo maior", out["inflexao"]["segundo_maior_fora_do_plato"])
    print("pico da taxa", out["pico_taxa"], "| pico da população", out["pico_populacao_projetado"])


if __name__ == "__main__":
    main()
