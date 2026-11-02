"""Compõe a arte real (render do motor) sobre a área do papel numa cena de mockup gerada por IA.
Detecta o papel dentro do passe-partout, apaga o que a IA desenhou ali e aplica a arte em modo
multiplicar, preservando a luz da cena. Uso: py -I compor_mockup.py <cena.png> <arte.png> <saida.png> x0 y0 x1 y1
(x0..y1 = caixa aproximada do papel, em pixels da cena; o script refina pela borda).
"""
import sys
from PIL import Image, ImageChops, ImageFilter, ImageStat

cena_p, arte_p, saida_p = sys.argv[1:4]
x0, y0, x1, y1 = map(int, sys.argv[4:8])
cena = Image.open(cena_p).convert("RGB")
arte = Image.open(arte_p).convert("RGB")
# encaixa a arte inteira na caixa (contain), mantendo a proporção, centrada nos dois eixos
k = min((x1 - x0) / arte.width, (y1 - y0) / arte.height)
w, h = round(arte.width * k), round(arte.height * k)
left = x0 + ((x1 - x0) - w) // 2
top = y0 + ((y1 - y0) - h) // 2
# luz da cena: versão muito borrada da área do papel (só a iluminação, sem as linhas da IA)
area = cena.crop((x0, y0, x1, y1))
luz = area.resize((8, 10), Image.BILINEAR).resize(area.size, Image.BILINEAR).filter(ImageFilter.GaussianBlur(12))
cena.paste(luz, (x0, y0))
# a arte multiplicada pela luz normalizada (fundo da arte vira a luz da cena)
fundo = ImageStat.Stat(arte.crop((5, 5, 60, 60))).mean
arte_r = arte.resize((w, h), Image.LANCZOS)
luz_r = cena.crop((left, top, left + w, top + h))
tinta = ImageChops.invert(ImageChops.subtract(Image.new("RGB", arte_r.size, tuple(int(c) for c in fundo)), arte_r))
cena.paste(ImageChops.multiply(luz_r, tinta), (left, top))
cena.save(saida_p)
print("ok", (left, top, left + w, top + h), "fundo da arte", [round(c) for c in fundo])
