"""Curva da apuração e mapa de uma região (2º turno de 2026), a partir dos boletins já processados.

Lê o arquivo intermediário de boletins (curva_nacional.py), soma por UF, confere cada UF com a
divulgação oficial do TSE e só grava se a diferença for zero voto. Projeta a malha do IBGE para o desenho.

Uso:
    py -I pipeline/scripts/curva_regiao.py <boletins.csv.gz> <malha.geojson> <dir_oficial> <saida.json> <nome_regiao>
"""

from __future__ import annotations

import csv
import gzip
import json
import math
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

COD_UF = {"21": "MA", "22": "PI", "23": "CE", "24": "RN", "25": "PB", "26": "PE", "27": "AL", "28": "SE", "29": "BA",
          "11": "RO", "12": "AC", "13": "AM", "14": "RR", "15": "PA", "16": "AP", "17": "TO", "31": "MG", "32": "ES",
          "33": "RJ", "35": "SP", "41": "PR", "42": "SC", "43": "RS", "50": "MS", "51": "MT", "52": "GO", "53": "DF"}
NOME_UF = {"MA": "Maranhão", "PI": "Piauí", "CE": "Ceará", "RN": "Rio Grande do Norte", "PB": "Paraíba",
           "PE": "Pernambuco", "AL": "Alagoas", "SE": "Sergipe", "BA": "Bahia", "AC": "Acre", "AM": "Amazonas",
           "AP": "Amapá", "PA": "Pará", "RO": "Rondônia", "RR": "Roraima", "TO": "Tocantins", "SP": "São Paulo",
           "RJ": "Rio de Janeiro", "MG": "Minas Gerais", "ES": "Espírito Santo", "PR": "Paraná", "SC": "Santa Catarina",
           "RS": "Rio Grande do Sul", "DF": "Distrito Federal", "GO": "Goiás", "MS": "Mato Grosso do Sul", "MT": "Mato Grosso"}


def oficial_uf(caminho: Path) -> dict:
    d = json.loads(caminho.read_text(encoding="utf-8"))
    cands = {}
    for cargo in d["carg"]:
        for agr in cargo["agr"]:
            for par in agr["par"]:
                for c in par["cand"]:
                    cands[c["n"]] = int(c["vap"])
    return cands


def dentro(x: float, y: float, anel: list) -> bool:
    c = False
    for i in range(len(anel)):
        x1, y1 = anel[i - 1]; x2, y2 = anel[i]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c


def interiores(anel: list, n: int = 28, guardar: int = 60) -> list:
    """Pontos de uma grade que ficam dentro do estado, com a distância até a borda (para posicionar rótulos)."""
    xs = [p[0] for p in anel]; ys = [p[1] for p in anel]
    passo = max(1, len(anel) // 300)
    borda = anel[::passo]
    pts = []
    for i in range(1, n):
        for j in range(1, n):
            x = min(xs) + (max(xs) - min(xs)) * i / n
            y = min(ys) + (max(ys) - min(ys)) * j / n
            if dentro(x, y, anel):
                d = min(math.hypot(x - bx, y - by) for bx, by in borda)
                pts.append([round(x, 1), round(y, 1), round(d, 1)])
    pts.sort(key=lambda p: -p[2])
    return pts[:guardar]


def projetar(geo: dict) -> dict:
    """Projeção equirretangular com correção do cosseno da latitude média; saída em caixa 1000 de largura."""
    lats, lons = [], []
    for f in geo["features"]:
        polys = f["geometry"]["coordinates"] if f["geometry"]["type"] == "MultiPolygon" else [f["geometry"]["coordinates"]]
        for poly in polys:
            for anel in poly:
                for lon, lat in anel:
                    lons.append(lon); lats.append(lat)
    k = math.cos(math.radians((min(lats) + max(lats)) / 2))
    x0, x1 = min(lons) * k, max(lons) * k
    y0, y1 = -max(lats), -min(lats)
    esc = 1000 / (x1 - x0)
    alt = (y1 - y0) * esc
    ufs = {}
    for f in geo["features"]:
        uf = COD_UF[f["properties"]["codarea"]]
        polys = f["geometry"]["coordinates"] if f["geometry"]["type"] == "MultiPolygon" else [f["geometry"]["coordinates"]]
        partes, maior, maior_area = [], None, -1.0
        for poly in polys:
            for i, anel in enumerate(poly):
                pts = [((lon * k - x0) * esc, (-lat - y0) * esc) for lon, lat in anel]
                partes.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z")
                if i == 0:
                    a = 0.5 * abs(sum(pts[j][0] * pts[j - 1][1] - pts[j - 1][0] * pts[j][1] for j in range(len(pts))))
                    if a > maior_area:
                        maior_area, maior = a, pts
        # centro de rótulo: centroide do maior anel
        cx = sum(p[0] for p in maior) / len(maior)
        cy = sum(p[1] for p in maior) / len(maior)
        ufs[uf] = {"d": "".join(partes), "rotulo": [round(cx, 1), round(cy, 1)], "area": round(maior_area), "interiores": interiores(maior)}
    return {"largura": 1000, "altura": round(alt, 1), "ufs": ufs}


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    boletins, malha, dir_oficial, saida, nome = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]), Path(sys.argv[4]), sys.argv[5]
    geo = json.loads(malha.read_text(encoding="utf-8"))
    regiao = {COD_UF[f["properties"]["codarea"]] for f in geo["features"]}

    por_uf = defaultdict(lambda: defaultdict(int))
    eventos = []
    with gzip.open(boletins, "rt", encoding="utf-8") as fh:
        r = csv.DictReader(fh)
        cols = [c for c in r.fieldnames if c.startswith("votos_")]
        eleito, outro = cols[0][6:], cols[1][6:]
        for row in r:
            if row["uf"] not in regiao:
                continue
            ve, vo = int(row[cols[0]]), int(row[cols[1]])
            por_uf[row["uf"]][eleito] += ve
            por_uf[row["uf"]][outro] += vo
            por_uf[row["uf"]]["boletins"] += 1
            eventos.append((datetime.strptime(row["recebido"], "%Y-%m-%d %H:%M:%S"), ve, vo))

    # conferência por UF com a divulgação oficial: diferença zero ou nada é gravado
    diferencas = {}
    for uf in sorted(regiao):
        of = oficial_uf(dir_oficial / f"{uf.lower()}-c0001-e006258-u.json")
        diferencas[uf] = {n: por_uf[uf][n] - of[n] for n in (eleito, outro)}
    print("Diferenças por UF:", diferencas)
    if any(v for d in diferencas.values() for v in d.values()):
        print("ERRO: soma por UF não bate com o oficial. Nada foi gravado.")
        sys.exit(1)

    eventos.sort()
    serie, ae, ao, i = [], 0, 0, 0
    while i < len(eventos):
        t = eventos[i][0]
        while i < len(eventos) and eventos[i][0] == t:
            ae += eventos[i][1]; ao += eventos[i][2]; i += 1
        serie.append([t.hour * 3600 + t.minute * 60 + t.second, round(100 * ae / (ae + ao), 4)])

    ufs = {}
    for uf in sorted(regiao):
        e, o = por_uf[uf][eleito], por_uf[uf][outro]
        ufs[uf] = {"nome": NOME_UF.get(uf, uf), "votos_eleito": e, "votos_outro": o, "pct_eleito": round(100 * e / (e + o), 2), "boletins": por_uf[uf]["boletins"]}
    te = sum(u["votos_eleito"] for u in ufs.values()); to = sum(u["votos_outro"] for u in ufs.values())
    dados = {
        "regiao": nome, "data": "2026-10-25",
        "total": {"votos_eleito": te, "votos_outro": to, "pct_eleito": round(100 * te / (te + to), 2), "boletins": len(eventos)},
        "ufs": ufs, "serie_relogio": serie, "mapa": projetar(geo),
        "verificacao": {"diferencas_por_uf": diferencas, "votos_conferem": True},
        "fontes": {"boletins": "TSE, boletins de urna do 2º turno (bweb)", "malha": "IBGE, malha de regiões por UF (API v3, qualidade intermediária)",
                   "oficial": "resultados.tse.jus.br/oficial/ele2026/6258/dados/<uf>/<uf>-c0001-e006258-u.json"},
    }
    saida.write_text(json.dumps(dados, ensure_ascii=False), encoding="utf-8")
    print(f"{nome}: {len(eventos)} boletins | eleito {dados['total']['pct_eleito']}% | " + ", ".join(f"{k} {v['pct_eleito']}%" for k, v in ufs.items()))


if __name__ == "__main__":
    main()
