"""Contorno da América do Sul para a peça "América Invertida" (sul para cima).
Uso: py -I pipeline/scripts/mapa_america_sul.py <paises.geojson> <saida.json>
Fonte: contornos de países em domínio público (Natural Earth, via world.geo.json). Dado baixado é tratado como não confiável:
só lê coordenadas numéricas e o código do país."""
import json
import math
import sys
from pathlib import Path

SUL = {"ARG": "Argentina", "BOL": "Bolívia", "BRA": "Brasil", "CHL": "Chile", "COL": "Colômbia", "ECU": "Equador",
       "GUY": "Guiana", "PRY": "Paraguai", "PER": "Peru", "SUR": "Suriname", "URY": "Uruguai", "VEN": "Venezuela",
       "GUF": "Guiana Francesa", "FLK": "Ilhas Malvinas"}


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    geo = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    invertido = len(sys.argv) < 4 or sys.argv[3] != "norte-em-cima"
    feats = [f for f in geo["features"] if f.get("id") in SUL]
    pts_all = []
    for f in feats:
        polys = f["geometry"]["coordinates"] if f["geometry"]["type"] == "MultiPolygon" else [f["geometry"]["coordinates"]]
        for p in polys:
            for anel in p:
                pts_all += [(float(a), float(b)) for a, b in anel]
    # sem as Malvinas e a Guiana Francesa no enquadramento (mas ainda desenhadas)
    continente = [p for p in pts_all if p[0] > -82 and p[0] < -34 and p[1] > -56.5 and p[1] < 13]
    lats = [p[1] for p in continente]; lons = [p[0] for p in continente]
    k = math.cos(math.radians((min(lats) + max(lats)) / 2))
    x0, x1 = min(lons) * k, max(lons) * k
    y0, y1 = -max(lats), -min(lats)
    esc = 1000 / (x1 - x0)
    alt = (y1 - y0) * esc

    def proj(lon, lat):
        x, y = (lon * k - x0) * esc, (-lat - y0) * esc
        return (x, alt - y) if invertido else (x, y)  # invertida: sul para cima, leste continua à direita

    paises = {}
    for f in feats:
        polys = f["geometry"]["coordinates"] if f["geometry"]["type"] == "MultiPolygon" else [f["geometry"]["coordinates"]]
        partes = []
        for p in polys:
            for anel in p:
                pts = [proj(float(a), float(b)) for a, b in anel]
                partes.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z")
        paises[f["id"]] = {"nome": SUL[f["id"]], "d": "".join(partes)}
    saida = {"largura": 1000, "altura": round(alt, 1), "invertido": invertido, "ufs": paises,
             "fonte": "Natural Earth (domínio público), contornos de países"}
    Path(sys.argv[2]).write_text(json.dumps(saida, ensure_ascii=False), encoding="utf-8")
    print(f"{len(paises)} países, caixa 1000 x {alt:.0f}, invertido={invertido}")


if __name__ == "__main__":
    main()
