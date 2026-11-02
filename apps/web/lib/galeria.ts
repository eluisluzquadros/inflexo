/** Fotos de cada produto (cenas geradas por IA com a arte real aplicada), por produto e estilo. Só entram fotos que mostram o estilo certo. */
export type Foto = { src: string; legenda: string };

const GALERIA: Record<string, Foto[]> = {
  'quadro:gravura': [
    { src: '/casa/gravura.jpg', legenda: 'Moldura de carvalho, em estúdio' },
    { src: '/casa/hero.jpg', legenda: 'Na parede da sala' },
  ],
  'quadro:fios': [
    { src: '/casa/fios.jpg', legenda: 'Moldura de carvalho, em estúdio' },
    { src: '/shop/hero.jpg', legenda: 'Sobre o aparador' },
    { src: '/mockups/quadro-fios.jpg', legenda: 'Com a caixa da INFLEXO' },
  ],
  'poster:gravura': [{ src: '/casa/poster-gravura.jpg', legenda: 'Com varão de madeira e tubo de envio' }],
  'arquivo-digital:gravura': [{ src: '/casa/digital.jpg', legenda: 'Em stories, no celular' }],
  'camiseta:gravura': [{ src: '/casa/camiseta.jpg', legenda: 'Algodão branco, dobrada' }],
};

export function fotosDe(slug: string, estilo: string): Foto[] {
  return GALERIA[`${slug}:${estilo}`] ?? [];
}
