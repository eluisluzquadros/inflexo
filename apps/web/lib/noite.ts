import 'server-only';
import { curva } from './loja';
// módulo JS puro do motor (allowJs)
import { janelaDaForma } from '../../../packages/render/src/graficoNacional.mjs';

export type Noite = {
  pts: [number, number][];      // [segundos desde 0h, % dos válidos do eleito], na janela da forma
  urnas: [number, number][];    // [segundos, % das urnas apuradas], para interpolar
  inicio: number; fim: number; pausaFim: number;
  viradas: number[];            // segundos das trocas de liderança dentro da janela
  meia: number;                 // meia-altura do gráfico em pontos percentuais
  boletins: number;
};

const seg = (hms: string) => hms.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);

/** Dados da noite para a página: a mesma janela da peça, reduzida para o navegador. */
export function noite(): Noite {
  const c = curva() as any;
  const s: [number, number][] = c.serie_relogio;
  const J = janelaDaForma(s);
  const dentro = s.filter((p) => p[0] >= J.inicio && p[0] <= J.fim);
  // no máximo um ponto a cada 10 s; preserva o primeiro e o último
  const pts: [number, number][] = [];
  let ultimo = -Infinity;
  for (const p of dentro) {
    if (p[0] - ultimo >= 10 || p === dentro.at(-1)) { pts.push([p[0], Math.round(p[1] * 1000) / 1000]); ultimo = p[0]; }
  }
  const urnas: [number, number][] = c.amostra.map((p: any) => [seg(p.t), p.pct_secoes]);
  const viradas = c.viradas.map((v: any) => seg(v.t)).filter((t: number) => t > J.inicio && t <= J.fim);
  const desvio = Math.max(...pts.map((p) => Math.abs(p[1] - 50)));
  return {
    pts, urnas, inicio: J.inicio, fim: J.fim, pausaFim: J.inicio + J.pausaS, viradas,
    meia: Math.ceil((desvio + 0.5) * 2) / 2,
    boletins: c.verificacao.reconstruido.boletins,
  };
}
