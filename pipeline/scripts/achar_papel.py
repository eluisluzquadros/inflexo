"""Acha a caixa do papel em branco numa cena de mockup, crescendo a partir de um ponto dentro dele.
Cresce enquanto a cor muda devagar (papel liso com luz suave) e para na borda do passe-partout ou da moldura.
Uso: py -I achar_papel.py <cena.png> cx cy [tolerancia=6] [margem=3]
Saída: x0 y0 x1 y1 (já recuada pela margem), pronta para compor_mockup.py.
"""
import sys
from collections import deque
from PIL import Image

cena, cx, cy = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
tol = int(sys.argv[4]) if len(sys.argv) > 4 else 6
margem = int(sys.argv[5]) if len(sys.argv) > 5 else 3
im = Image.open(cena).convert("L")
W, H = im.size
px = im.load()
base = px[cx, cy]
visto = bytearray(W * H)
fila = deque([(cx, cy)])
visto[cy * W + cx] = 1
x0 = x1 = cx
y0 = y1 = cy
n = 0
while fila:
    x, y = fila.popleft()
    n += 1
    v = px[x, y]
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < W and 0 <= ny < H and not visto[ny * W + nx]:
            u = px[nx, ny]
            # passo local pequeno e sem fugir demais da cor do ponto de partida
            if abs(u - v) <= tol and abs(u - base) <= 40:
                visto[ny * W + nx] = 1
                fila.append((nx, ny))
                x0, x1, y0, y1 = min(x0, nx), max(x1, nx), min(y0, ny), max(y1, ny)
area_caixa = (x1 - x0 + 1) * (y1 - y0 + 1)
print(x0 + margem, y0 + margem, x1 - margem, y1 - margem)
print(f"preenchimento {n / area_caixa:.2f} da caixa; proporção {(x1 - x0) / max(1, y1 - y0):.3f}", file=sys.stderr)
