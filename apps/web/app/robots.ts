import type { MetadataRoute } from 'next';
import { EMPRESA } from '../lib/empresa';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/pedido/'] }],
    sitemap: `${EMPRESA.site}/sitemap.xml`,
  };
}
