"""Prova física de composição A3: textos e ponto vetoriais, mestre de tinta fixo."""
from pathlib import Path
import json
import shutil
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A3
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'docs/mockups/piloto-nos-no-tempo-v1'
PUBLIC = ROOT / 'apps/web/public/estudos/nos-no-tempo'
OUTPUT = ROOT / 'output/pdf/nos-no-tempo-prova-composicao-a3.pdf'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
data = json.loads((OUT / 'manifesto.json').read_text(encoding='utf-8'))
fonts = ROOT / 'packages/render/fontes'
pdfmetrics.registerFont(TTFont('Bodoni', str(fonts / 'BodoniModa-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Mono', str(fonts / 'IBMPlexMono-Regular.ttf')))
master = ImageReader(str(ROOT / 'docs/mockups/bambu-canonico-v1/00-desenho-mestre.png'))
W, H = A3
U = W / 594
c = canvas.Canvas(str(OUTPUT), pagesize=A3, pageCompression=1)
c.setTitle('Nós no tempo - prova de composição A3')
c.setAuthor('INFLEXO')
c.setSubject('Estudo de layout. Data de Aurora informada pelo usuário; demais histórias ilustrativas. Dourado simulado em cor. Não é fechamento de produção.')

def text(x, y, value, size, face='Bodoni', color='#283129', spacing=0):
    c.setFillColor(HexColor(color))
    t = c.beginText()
    t.setFont(face, size * U)
    t.setCharSpace(spacing * U)
    width = pdfmetrics.stringWidth(value, face, size * U) + max(0, len(value)-1) * spacing * U
    t.setTextOrigin(x * U - width / 2, H - y * U)
    t.textOut(value)
    c.drawText(t)

def signature():
    text(297, 793, 'INFLEXO', 11, spacing=3)
    c.saveState()
    c.translate(291 * U, H - 759 * U)
    c.scale(.12 * U, -.12 * U)
    c.setStrokeColor(HexColor('#283129'))
    p = c.beginPath(); p.moveTo(12, 7); p.curveTo(38, 24, 62, 76, 88, 93)
    c.setLineWidth(16); c.drawPath(p)
    p = c.beginPath(); p.moveTo(12, 93); p.curveTo(38, 76, 62, 24, 88, 7)
    c.setLineWidth(3.2); c.drawPath(p)
    c.setLineWidth(3); c.setStrokeColor(HexColor('#F7F3EA')); c.setFillColor(HexColor('#AC7C20'))
    c.circle(50, 50, 7.5, fill=1, stroke=1)
    c.restoreState()

for story in data['historias']:
    c.setFillColor(HexColor('#F7F3EA')); c.rect(0, 0, W, H, fill=1, stroke=0)
    text(297, 62, 'NÓS NO TEMPO / INFLEXÕES', 9, 'Mono', '#717467', 2.1)
    text(297, 145, story['titulo'], 61)
    text(297, 187, story['pessoa'], 11, 'Mono', '#717467', 2)
    scale = 400 / 263
    image_w = 276 * scale
    image_x = 42 + (510 - image_w) / 2
    image_y = 218
    c.drawImage(master, image_x * U, H - (image_y+400) * U,
                width=image_w * U, height=400 * U, preserveAspectRatio=True,
                anchor='c', mask='auto')
    point = data['ponto']
    px = image_x + (point['x'] - 42) * scale
    py = image_y + (point['y'] - 119) * scale
    c.setFillColor(HexColor(point['cor'])); c.setStrokeColor(HexColor('#F7F3EA'))
    c.setLineWidth(1.1 * scale * U)
    c.circle(px * U, H - py * U, point['raio'] * scale * U, fill=1, stroke=1)
    text(297, 674, story['data'], 20, 'Mono')
    text(297, 716, story['frase'], 16)
    signature()
    c.showPage()
c.save()

reader = PdfReader(str(OUTPUT))
assert len(reader.pages) == 3
for page, story in zip(reader.pages, data['historias']):
    assert abs(float(page.mediabox.width) - W) < .1
    assert abs(float(page.mediabox.height) - H) < .1
    content = page.extract_text()
    assert story['titulo'] in content and story['data'] in content
shutil.copyfile(OUTPUT, PUBLIC / 'prova-composicao-a3.pdf')
(OUT / 'LEIA-ME.txt').write_text('''NÓS NO TEMPO - COLEÇÃO PILOTO

9 estudos gráficos de aplicação: três histórias em quadro, camiseta e caderno.
A data de Aurora foi informada pelo usuário: 11/01/2023.
Os demais nomes e datas são exemplos ilustrativos.
A geometria, as folhas e a posição do nó dourado são iguais nas nove peças.
As imagens são representações gráficas de produtos, não fotografias de amostras.
Materiais, formato de impressão e acabamento ainda dependem do fornecedor.

PROVA DE COMPOSIÇÃO A3
Arquivo: output/pdf/nos-no-tempo-prova-composicao-a3.pdf
3 páginas A3 de 297 x 420 mm; uma história por página.
Imprimir apenas a página desejada a 100%, sem ajustar à folha.
Sem sangria de produção. Usar para avaliar proporção, traços, texto e presença do nó.
Dourado simulado em cor, sem promessa de tinta metálica ou hot stamping.
Resolução efetiva aproximada da imagem de tinta nesta composição: 184 dpi.
A prova não é um arquivo final aprovado para fabricação.

PERGUNTAS PARA AVALIAÇÃO SEM EXPLICAÇÃO PRÉVIA
1. O que este desenho sugere para você?
2. O que conecta as peças?
3. Qual você teria em casa ou usaria?

Não há venda aberta, preço, estoque ou depoimento simulado.
Preview: http://localhost:3123/estudos/nos-no-tempo/index.html
''', encoding='utf-8')
print(json.dumps({'pdf': str(OUTPUT), 'paginas': len(reader.pages), 'formato_mm': [297, 420]}, ensure_ascii=False))
