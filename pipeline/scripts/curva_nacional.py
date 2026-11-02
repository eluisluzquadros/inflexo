"""Reconstrói a curva nacional da apuração do 2º turno de 2026 (Presidente).

Lê os boletins de urna (bweb) do TSE direto dos zips, ordena cada boletim pelo horário em que
chegou ao TSE (DT_BU_RECEBIDO), acumula os votos e confere o total com a divulgação oficial.
Só escreve a saída se o total reconstruído bater com o oficial, voto a voto.

Uso:
    py -I pipeline/scripts/curva_nacional.py <dir_zips_bweb> <json_oficial_br> <dir_saida> [<dir_interim>]

Só usa a biblioteca padrão.
"""

from __future__ import annotations

import csv
import gzip
import hashlib
import io
import json
import sys
import zipfile
from collections import Counter
from datetime import datetime
from pathlib import Path

CARGO_PRESIDENTE = "1"
INICIO_DIVULGACAO = datetime(2026, 10, 25, 17, 0, 0)  # TSE libera a divulgação às 17h de Brasília
URL_BASE_BWEB = "https://cdn.tse.jus.br/estatistica/sead/eleicoes/eleicoes2026/buweb/"
URL_OFICIAL = "https://resultados.tse.jus.br/oficial/ele2026/6258/dados/br/br-c0001-e006258-u.json"
NULOS_TEXTO = {"", "#NULO", "#NULO#", "#NE", "#NE#"}


def ler_oficial(caminho: Path) -> dict:
    d = json.loads(caminho.read_text(encoding="utf-8"))
    cands = {}
    for cargo in d["carg"]:
        if cargo["cd"] != CARGO_PRESIDENTE:
            continue
        for agr in cargo["agr"]:
            for par in agr["par"]:
                for c in par["cand"]:
                    cands[c["n"]] = {"votos": int(c["vap"]), "pct": c["pvapn"], "eleito": c["e"] == "s"}
    return {
        "candidatos": cands,
        "validos": int(d["v"]["vv"]),
        "brancos": int(d["v"]["vb"]),
        "nulos": int(d["v"]["tvn"]),
        "total_votos": int(d["v"]["tv"]),
        "secoes_total": int(d["s"]["ts"]),
        "secoes_instaladas": int(d["s"]["si"]),
        "divulgacao_final": f'{d["dt"]} {d["ht"]}',
    }


def contar_agregadas(texto: str) -> int:
    texto = (texto or "").strip()
    if texto.upper() in NULOS_TEXTO:
        return 0
    return len([p for p in texto.replace(";", ",").replace("/", ",").split(",") if p.strip()])


def ler_boletins(dir_zips: Path) -> tuple[dict, dict, list]:
    boletins: dict[tuple, dict] = {}
    tipos_urna: Counter = Counter()
    exemplos_agregadas: list[str] = []
    arquivos = []
    for zpath in sorted(dir_zips.glob("bweb_2t_*.zip")):
        sha = hashlib.sha512(zpath.read_bytes()).hexdigest()
        arquivos.append({"arquivo": zpath.name, "url": URL_BASE_BWEB + zpath.name, "sha512": sha})
        with zipfile.ZipFile(zpath) as z:
            nome_csv = next(n for n in z.namelist() if n.lower().endswith(".csv"))
            with z.open(nome_csv) as fh:
                leitor = csv.reader(io.TextIOWrapper(fh, encoding="latin-1", newline=""), delimiter=";")
                h = {c: i for i, c in enumerate(next(leitor))}
                i_cargo, i_uf, i_mun, i_zona, i_sec = (h[c] for c in ("CD_CARGO_PERGUNTA", "SG_UF", "CD_MUNICIPIO", "NR_ZONA", "NR_SECAO"))
                i_rec, i_vot, i_qt, i_tipo = h["DT_BU_RECEBIDO"], h["NR_VOTAVEL"], h["QT_VOTOS"], h["DS_TIPO_URNA"]
                i_agr, i_comp = h["DS_SECOES_AGREGADAS"], h["QT_COMPARECIMENTO"]
                for row in leitor:
                    if row[i_cargo] != CARGO_PRESIDENTE:
                        continue
                    chave = (row[i_uf], row[i_mun], row[i_zona], row[i_sec])
                    b = boletins.get(chave)
                    if b is None:
                        agr = row[i_agr]
                        n_agr = contar_agregadas(agr)
                        if n_agr and len(exemplos_agregadas) < 5:
                            exemplos_agregadas.append(agr)
                        b = boletins[chave] = {
                            "recebido": row[i_rec],
                            "votos": Counter(),
                            "secoes": 1,  # o TSE conta 1 seção por boletim; agregadas já estão dentro dele
                            "agregadas": n_agr,
                            "comparecimento": int(row[i_comp]),
                        }
                        tipos_urna[row[i_tipo]] += 1
                    elif b["recebido"] != row[i_rec]:
                        raise ValueError(f"Boletim {chave} com dois horários de recebimento: {b['recebido']} e {row[i_rec]}")
                    b["votos"][row[i_vot]] += int(row[i_qt])
        print(f"  {zpath.name}: {len(boletins)} boletins acumulados", flush=True)
    return boletins, {"tipos_urna": dict(tipos_urna), "exemplos_secoes_agregadas": exemplos_agregadas}, arquivos


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    dir_zips, json_oficial, dir_saida = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    dir_interim = Path(sys.argv[4]) if len(sys.argv) > 4 else None
    oficial = ler_oficial(json_oficial)
    nums = sorted(oficial["candidatos"], key=lambda n: -oficial["candidatos"][n]["votos"])
    venc, outro = nums[0], nums[1]

    print("Lendo boletins de urna...", flush=True)
    boletins, diag, arquivos = ler_boletins(dir_zips)

    # ---- conferência com o total oficial (critério do EXP-316 H1: diferença zero) ----
    soma = Counter()
    for b in boletins.values():
        soma.update(b["votos"])
    reconstruido = {
        "candidatos": {n: soma.get(n, 0) for n in nums},
        "brancos": soma.get("95", 0),
        "nulos": soma.get("96", 0),
        "total_votos": sum(soma.values()),
        "secoes": sum(b["secoes"] for b in boletins.values()),
        "secoes_agregadas_dentro_dos_boletins": sum(b["agregadas"] for b in boletins.values()),
        "boletins": len(boletins),
        "outros_votaveis": {k: v for k, v in soma.items() if k not in set(nums) | {"95", "96"}},
    }
    diferencas = {
        **{f"votos_{n}": reconstruido["candidatos"][n] - oficial["candidatos"][n]["votos"] for n in nums},
        "brancos": reconstruido["brancos"] - oficial["brancos"],
        "nulos": reconstruido["nulos"] - oficial["nulos"],
        "total_votos": reconstruido["total_votos"] - oficial["total_votos"],
        "secoes_vs_instaladas": reconstruido["secoes"] - oficial["secoes_instaladas"],
    }
    votos_ok = all(diferencas[k] == 0 for k in diferencas if k != "secoes_vs_instaladas")
    print("Diferenças (reconstruído − oficial):", diferencas)
    if not votos_ok:
        print("ERRO: o total reconstruído não bate com o oficial. Nada foi escrito.")
        sys.exit(1)

    # ---- curva: ordem de chegada ao TSE; antes das 17h conta como 17h ----
    eventos = []
    antes = 0
    for b in boletins.values():
        t = datetime.strptime(b["recebido"], "%Y-%m-%d %H:%M:%S")
        if t < INICIO_DIVULGACAO:
            antes += 1
            t = INICIO_DIVULGACAO
        eventos.append((t, b["votos"].get(venc, 0), b["votos"].get(outro, 0), b["secoes"]))
    eventos.sort(key=lambda e: e[0])

    total_secoes = len(boletins)  # 100 % = todos os boletins recebidos (499.205; o TSE tem 499.207 instaladas)
    serie = []
    acc_v, acc_o, acc_s = 0, 0, 0
    i = 0
    while i < len(eventos):
        t = eventos[i][0]
        while i < len(eventos) and eventos[i][0] == t:
            acc_v += eventos[i][1]
            acc_o += eventos[i][2]
            acc_s += eventos[i][3]
            i += 1
        validos = acc_v + acc_o
        serie.append({
            "t": t.strftime("%H:%M:%S"),
            "secoes": acc_s,
            "pct_secoes": round(100 * acc_s / total_secoes, 4),
            "votos": {venc: acc_v, outro: acc_o},
            "pct_validos": {venc: round(100 * acc_v / validos, 4), outro: round(100 * acc_o / validos, 4)},
        })

    # trocas de liderança
    viradas = []
    lider_ant = None
    for p in serie:
        lider = venc if p["votos"][venc] > p["votos"][outro] else outro if p["votos"][outro] > p["votos"][venc] else None
        if lider and lider_ant and lider != lider_ant:
            viradas.append({**p, "novo_lider": lider})
        if lider:
            lider_ant = lider

    # amostra para desenho: um ponto a cada 0,1 % de seções + os pontos das viradas
    amostra, prox = [], 0.0
    marcos = {v["t"] for v in viradas}
    for p in serie:
        if p["pct_secoes"] >= prox or p["t"] in marcos:
            amostra.append(p)
            prox = (int(p["pct_secoes"] * 10) + 1) / 10
    if amostra[-1] is not serie[-1]:
        amostra.append(serie[-1])

    # série no relógio, resolução total: [segundos desde 0h, % dos válidos do eleito]
    def segundos(hms: str) -> int:
        h, mi, se = map(int, hms.split(":"))
        return h * 3600 + mi * 60 + se

    serie_relogio = [[segundos(p["t"]), p["pct_validos"][venc]] for p in serie]

    saida = {
        "momento": "eleicao-2026-2t-presidente-br",
        "data": "2026-10-25",
        "descricao": "Curva da apuração do 2º turno presidencial de 25/10/2026, reconstruída a partir dos boletins de urna do TSE ordenados pelo horário de recebimento.",
        "metodo": {
            "ordem": "DT_BU_RECEBIDO (horário de chegada do boletim ao TSE)",
            "inicio_divulgacao": INICIO_DIVULGACAO.strftime("%Y-%m-%d %H:%M:%S"),
            "boletins_antes_das_17h_contados_as_17h": antes,
            "eixo_x": "percentual das urnas apuradas: boletins recebidos até o instante sobre o total de boletins (1 boletim = 1 seção, como na contagem do TSE)",
            "fuso": "DT_BU_RECEBIDO está na hora de Brasília em todas as UFs (conferido contra o fim oficial por UF, que o TSE publica no fuso local)",
            "eixo_y": "percentual dos votos válidos de cada candidato",
            "limite": "A divulgação oficial é feita em lotes; a curva por horário de recebimento é uma reconstrução fiel na ordem, não uma cópia dos lotes exibidos na noite.",
        },
        "candidatos": {
            venc: {"votos": oficial["candidatos"][venc]["votos"], "pct": oficial["candidatos"][venc]["pct"], "eleito": True, "cor_dado": "carmim"},
            outro: {"votos": oficial["candidatos"][outro]["votos"], "pct": oficial["candidatos"][outro]["pct"], "eleito": False, "cor_dado": "cobalto"},
        },
        "verificacao": {"oficial": oficial, "reconstruido": reconstruido, "diferencas": diferencas, "votos_conferem": votos_ok, "diagnostico": diag},
        "fontes": {"boletins": arquivos, "oficial": URL_OFICIAL},
        "gerado_em": datetime.now().isoformat(timespec="seconds"),
        "viradas": viradas,
        "amostra": amostra,
        "serie_relogio": serie_relogio,
    }
    dir_saida.mkdir(parents=True, exist_ok=True)
    (dir_saida / "curva_presidente_2t_2026_br.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
    with gzip.open(dir_saida / "serie_completa_presidente_2t_2026_br.json.gz", "wt", encoding="utf-8") as f:
        json.dump(serie, f, ensure_ascii=False)

    if dir_interim:
        dir_interim.mkdir(parents=True, exist_ok=True)
        with gzip.open(dir_interim / "boletins_presidente_2t_2026.csv.gz", "wt", encoding="utf-8", newline="") as f:
            w = csv.writer(f)
            w.writerow(["uf", "cd_municipio", "zona", "secao", "recebido", "secoes", "comparecimento", f"votos_{venc}", f"votos_{outro}", "brancos", "nulos"])
            for (uf, mun, zona, sec), b in boletins.items():
                w.writerow([uf, mun, zona, sec, b["recebido"], b["secoes"], b["comparecimento"], b["votos"].get(venc, 0), b["votos"].get(outro, 0), b["votos"].get("95", 0), b["votos"].get("96", 0)])

    print(f"Boletins: {len(boletins)} | antes das 17h: {antes} | pontos na série: {len(serie)} | amostra: {len(amostra)}")
    print(f"Primeiro ponto: {serie[0]['t']} {serie[0]['pct_secoes']}% | último: {serie[-1]['t']} {serie[-1]['pct_secoes']}%")
    for v in viradas:
        print(f"Virada às {v['t']} com {v['pct_secoes']}% das seções: líder passa a ser {v['novo_lider']} ({v['pct_validos']})")
    print("Diagnóstico:", diag)


if __name__ == "__main__":
    main()
