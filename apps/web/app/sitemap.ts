import type { MetadataRoute } from 'next';
import { EMPRESA } from '../lib/empresa';
import { PRODUTOS } from '../lib/loja';
import { pecasGeografia } from '../lib/vitrine';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = EMPRESA.site;
  const fixas = ['', '/loja', '/colecao/a-geografia-da-virada', '/metodo', '/termos', '/privacidade', '/trocas'];
  return [
    ...fixas.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.6 })),
    ...PRODUTOS.map((p) => ({ url: `${base}/produto/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...pecasGeografia().map((p) => ({ url: `${base}/geografia/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
