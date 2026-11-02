"""Converte as ruas do OpenStreetMap de cada capital em caminhos SVG projetados (quadrado de 1000 = janela baixada).
Uso: py -I pipeline/scripts/mapa_cidade.py <dir_osm> <capitais.json> <dir_saida>
Dados de mapa © colaboradores do OpenStreetMap (ODbL)."""
import json
import math
import sys
from pathlib import Path

ARQ_UF = {"salvador": "BA", "recife": "PE", "fortaleza": "CE", "sao_luis": "MA", "teresina": "PI",
          "natal": "RN", "joao_pessoa": "PB", "maceio": "AL", "aracaju": "SE"}
CLASSE = {"motorway": "maior", "trunk": "maior", "primary": "maior", "secondary": "maior",
          "tertiary": "media", "residential": "menor", "unclassified": "menor", "living_street": "menor", "pedestrian": "menor"}


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    dir_osm, capitais, saida = Path(sys.argv[1]), json.loads(Path(sys.argv[2]).read_text(encoding="utf-8")), Path(sys.argv[3])
    saida.mkdir(parents=True, exist_ok=True)
    for arq, uf in ARQ_UF.items():
        d = json.loads((dir_osm / f"{arq}.json").read_text(encoding="utf-8"))
        lat0, lon0 = d["inflexo_janela"]["centro"]
        meio = d["inflexo_janela"]["meio_km"]
        k = math.cos(math.radians(lat0))
        esc = 500 / meio  # 1000 unidades = 2 × meio_km

        def proj(p):
            x = 500 + (p["lon"] - lon0) * 111.0 * k * esc
            y = 500 - (p["lat"] - lat0) * 111.0 * esc
            return x, y

        grupos = {"maior": [], "media": [], "menor": [], "costa": [], "agua": [], "rio": []}
        for el in d["elements"]:
            if el.get("type") != "way" or "geometry" not in el:
                continue
            tags = el.get("tags", {})
            if tags.get("natural") == "coastline":
                g = "costa"
            elif tags.get("natural") == "water":
                g = "agua"
            elif tags.get("waterway") == "river":
                g = "rio"
            else:
                g = CLASSE.get(tags.get("highway"))
            if not g:
                continue
            pts = [proj(p) for p in el["geometry"]]
            if all(not (-60 < x < 1060 and -60 < y < 1060) for x, y in pts):
                continue
            s = "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts)
            grupos[g].append(s + ("Z" if g == "agua" else ""))
        lat_txt = f"{abs(int(lat0))}°{int(round(abs(lat0) % 1 * 60)):02d}′{'S' if lat0 < 0 else 'N'}"
        lon_txt = f"{abs(int(lon0))}°{int(round(abs(lon0) % 1 * 60)):02d}′{'O' if lon0 < 0 else 'L'}"
        cap = capitais[uf]
        out = {"cidade": cap["nome"], "uf": uf, "slug": arq, "centro": [lat0, lon0], "coordenadas": f"{lat_txt} · {lon_txt}",
               "janela_km": 2 * meio, "resultado": cap, "caminhos": {g: "".join(v) for g, v in grupos.items()},
               "fonte_mapa": "© colaboradores do OpenStreetMap (ODbL)"}
        (saida / f"{arq}.json").write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
        print(arq, {g: len(v) for g, v in grupos.items()}, f"{len(json.dumps(out)) / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
