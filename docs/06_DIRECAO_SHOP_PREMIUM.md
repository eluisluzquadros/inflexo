# Direção de loja premium — 01/11/2026

Pedido: reformular a landing page como loja premium de arte e decoração, tomando as referências de interiores fornecidas pelo usuário como direção visual. Produto e ambiente vêm antes da narrativa da apuração.

Implementação: página clara em marfim, oliva discreto, tipos da marca, quatro categorias funcionais e seleção de peças perto do início. A narrativa interativa foi preservada em `/colecao/a-geografia-da-virada`.

## Ambiente da abertura

- Ferramenta: ImageGen integrada, geração nova sem imagens de entrada.
- Original: `C:/Users/eluzq/.codex/generated_images/01a19488-fa11-7a92-94f3-52a423a9eb4a/exec-735a755b-b59b-4386-b8a4-2ee1557c16e0.png`.
- Asset usado pelo projeto: `apps/web/public/hero/ambiente-premium.webp`.
- Conversão: `node out/preparar-hero-premium.mjs`.
- A imagem contém só o ambiente. O quadro é composto pelo site em HTML/CSS usando o SVG real de `previa()`. Não há arte de produto inventada na geração.

### Prompt final

```text
Use case: photorealistic-natural. Asset type: wide hero background photograph for a premium Brazilian art and home decor shop, no website UI or typography in this image. Create a beautiful warm light-filled contemporary living room, editorial interior photography, landscape 3:2. Straight-on camera perpendicular to the back wall, no perspective tilt. Entire upper 70 percent is pale warm ivory limewashed plaster wall. LEFT HALF extremely calm EMPTY light plaster wall, slightly illuminated, reserved for website headline overlay; no window frame or decorations on left half. RIGHT HALF: a low sculptural soft olive green linen sofa occupying the bottom-right 35 percent, curved generous cushions, a small travertine side table with a matte clay vase at far right, natural branch or olive plant at extreme right edge only. Gentle soft morning sunlight enters from an off-camera window to left, diagonal soft shadows fall on wall and sofa. The wall above sofa in the RIGHT HALF MUST BE COMPLETELY BLANK and unobstructed: an actual art print will be overlaid there later by website code around x=72% y=34%; no painting, no poster, no frame, no wall ornament, no mirror. Frame the wall spaciously so a large portrait print has room in the upper-right quadrant above sofa. Low-key sophisticated styling, natural oak floor and jute/wool rug along bottom, texture of linen, plaster and travertine. Restrained palette of warm ivory, sage olive, honey oak and pale stone. Exquisite premium interiors catalogue photography with authentic tactile materials, physically realistic light. No people, no text, no logos, no candles, no bottles, no drinking glasses, no alcohol, no bright colors, no artificial glow, no oversaturated orange or beige filter.
```
