"""Baixa ruas e linha de costa do OpenStreetMap (Overpass) para uma janela quadrada em volta do centro de cada capital.
Uso: py -I pipeline/scripts/baixar_ruas.py <dir_saida>   (dados © colaboradores do OpenStreetMap, ODbL)"""
import json, math, sys, time, urllib.parse, urllib.request
from pathlib import Path

CENTROS = {
    "salvador": (-12.9714, -38.5014), "recife": (-8.0560, -34.8900), "fortaleza": (-3.7400, -38.5150),
    "sao_luis": (-2.5297, -44.2828), "teresina": (-5.0892, -42.8016), "natal": (-5.7945, -35.2110),
    "joao_pessoa": (-7.1195, -34.8550), "maceio": (-9.6500, -35.7250), "aracaju": (-10.9400, -37.0600),
}
MEIO_KM = 5.0
saida = Path(sys.argv[1]); saida.mkdir(parents=True, exist_ok=True)
for nome, (lat, lon) in CENTROS.items():
    arq = saida / f"{nome}.json"
    if arq.exists() and arq.stat().st_size > 10000:
        print(nome, "já existe"); continue
    dlat = MEIO_KM / 111.0; dlon = MEIO_KM / (111.0 * math.cos(math.radians(lat)))
    bb = f"{lat - dlat:.4f},{lon - dlon:.4f},{lat + dlat:.4f},{lon + dlon:.4f}"
    q = (f'[out:json][timeout:180];(way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified|living_street|pedestrian)$"]({bb});'
         f'way["natural"="coastline"]({bb});way["natural"="water"]({bb});way["waterway"="river"]({bb}););out geom;')
    dados = None
    for tentativa in range(6):
        ep = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter", "https://overpass.private.coffee/api/interpreter"][tentativa % 3]
        req = urllib.request.Request(ep, data=urllib.parse.urlencode({"data": q}).encode(),
                                     headers={"User-Agent": "INFLEXO-mapas/0.1", "Accept": "application/json"})
        try:
            dados = urllib.request.urlopen(req, timeout=240).read()
            json.loads(dados); break
        except Exception as e:
            print(nome, "tentativa", tentativa + 1, ep, e); dados = None; time.sleep(15)
    if dados is None:
        print(nome, "FALHOU"); continue
    d = json.loads(dados); d["inflexo_janela"] = {"centro": [lat, lon], "meio_km": MEIO_KM, "bbox": bb}
    arq.write_text(json.dumps(d), encoding="utf-8")
    print(nome, len(d["elements"]), "vias", f"{len(dados) / 1e6:.1f} MB")
    time.sleep(8)
