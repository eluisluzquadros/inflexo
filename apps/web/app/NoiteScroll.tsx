'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Marca } from './Marca';

type Noite = {
  pts: [number, number][]; urnas: [number, number][];
  inicio: number; fim: number; pausaFim: number; viradas: number[]; meia: number; boletins: number;
};

const W = 1000, H = 400;
const relogio = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60);
  return { hm: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, ss: String(x).padStart(2, '0') };
};
const hhmm = (s: number) => relogio(s).hm.replace(':', 'h');
const pct = (n: number, casas = 2) => `${n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`;
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

/** Converte a rolagem em horário: segura em 17h07, atravessa a pausa depressa, a apuração devagar, depois a marca. */
function tempoDe(q: number, n: Noite) {
  if (q < 0.05) return { t: n.inicio, m: 0 };
  if (q < 0.24) return { t: n.inicio + ((q - 0.05) / 0.19) * (n.pausaFim - n.inicio), m: 0 };
  if (q < 0.8) return { t: n.pausaFim + ((q - 0.24) / 0.56) * (n.fim - n.pausaFim), m: 0 };
  return { t: n.fim, m: Math.min(1, (q - 0.8) / 0.16) };
}

function valorEm(arr: [number, number][], t: number) {
  let lo = 0, hi = arr.length - 1;
  if (t <= arr[0][0]) return arr[0][1];
  if (t >= arr[hi][0]) return arr[hi][1];
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (arr[mid][0] <= t) lo = mid; else hi = mid; }
  return arr[lo][1];
}

export function NoiteScroll({ n }: { n: Noite }) {
  const trilho = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const grafico = useRef<SVGSVGElement>(null);
  const xMarca = useRef<SVGSVGElement>(null);
  const [q, setQ] = useState(0);
  const [estatico, setEstatico] = useState(false);
  const [ponto, setPonto] = useState<{ x: number; y: number } | null>(null);

  const X = (s: number) => ((s - n.inicio) / (n.fim - n.inicio)) * W;
  const Y = (v: number) => H / 2 - ((v - 50) / n.meia) * (H / 2) * 0.92;
  const viradaFinal = n.viradas.at(-1)!;
  const viradaPrimeira = n.viradas[0];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEstatico(mq.matches);
    const muda = () => setEstatico(mq.matches);
    mq.addEventListener('change', muda);
    let quadro = 0;
    const ler = () => {
      quadro = 0;
      const el = trilho.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setQ(Math.min(1, Math.max(0, -r.top / Math.max(1, total))));
    };
    const pedir = () => { if (!quadro) quadro = requestAnimationFrame(ler); };
    ler();
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
    return () => { window.removeEventListener('scroll', pedir); window.removeEventListener('resize', pedir); mq.removeEventListener('change', muda); cancelAnimationFrame(quadro); };
  }, []);

  const { t, m } = estatico ? { t: n.fim, m: 0 } : tempoDe(q, n);

  const caminho = useMemo(() => {
    const ate = n.pts.filter((p) => p[0] <= t);
    if (!ate.length) ate.push(n.pts[0]);
    const pontos: [number, number][] = [];
    ate.forEach((p, i) => {
      if (i > 0 && p[0] - ate[i - 1][0] > 30) pontos.push([p[0], ate[i - 1][1]]);
      pontos.push(p);
    });
    const ultimo = pontos.at(-1)!;
    if (t > ultimo[0]) pontos.push([t, ultimo[1]]);
    const d = (lado: 1 | -1) => pontos.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)} ${Y(lado === 1 ? p[1] : 100 - p[1]).toFixed(1)}`).join('');
    return { eleito: d(1), outro: d(-1), fim: pontos.at(-1)! };
  }, [t]); // eslint-disable-line react-hooks/exhaustive-deps

  // a noite inteira, apagada: o desenho que a rolagem vai preencher
  const fantasma = useMemo(() => {
    const pontos: [number, number][] = [];
    n.pts.forEach((p, i) => { if (i > 0 && p[0] - n.pts[i - 1][0] > 30) pontos.push([p[0], n.pts[i - 1][1]]); pontos.push(p); });
    const d = (lado: 1 | -1) => pontos.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)} ${Y(lado === 1 ? p[1] : 100 - p[1]).toFixed(1)}`).join('');
    return d(1) + d(-1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const v = valorEm(n.pts, t);
  const urnas = valorEm(n.urnas, t);
  const r = relogio(t);

  // posição do ponto dourado: da virada (no gráfico) até o X da marca
  useEffect(() => {
    if (estatico || !palco.current || !grafico.current) return;
    const pr = palco.current.getBoundingClientRect();
    const gr = grafico.current.getBoundingClientRect();
    const de = { x: gr.left - pr.left + (X(viradaFinal) / W) * gr.width, y: gr.top - pr.top + (Y(50) / H) * gr.height };
    let para = de;
    if (xMarca.current) {
      const xr = xMarca.current.getBoundingClientRect();
      para = { x: xr.left - pr.left + xr.width / 2, y: xr.top - pr.top + xr.height / 2 };
    }
    const k = ease(m);
    setPonto({ x: de.x + (para.x - de.x) * k, y: de.y + (para.y - de.y) * k });
  }, [m, q, estatico]); // eslint-disable-line react-hooks/exhaustive-deps

  const atos = [
    { inicio: n.inicio, rotulo: hhmm(n.inicio), ate: n.inicio + 20 * 60, titulo: `${hhmm(n.inicio)}. Os primeiros boletins chegaram.`, texto: `${pct(valorEm(n.urnas, n.inicio), 2)} das urnas. As duas linhas começam longe uma da outra.` },
    { inicio: n.inicio + 20 * 60, rotulo: 'Pausa', ate: n.pausaFim, titulo: `Nada chegou por ${Math.floor((n.pausaFim - n.inicio) / 3600)}h${String(Math.round(((n.pausaFim - n.inicio) % 3600) / 60)).padStart(2, '0')}.`, texto: `Nenhum boletim de urna entre ${hhmm(n.inicio)} e ${hhmm(n.pausaFim)}. As linhas ficaram paradas.` },
    { inicio: n.pausaFim, rotulo: hhmm(n.pausaFim), ate: viradaPrimeira, titulo: `${hhmm(n.pausaFim)}. As urnas chegam em massa.`, texto: 'As linhas despencam uma na direção da outra.' },
    { inicio: viradaPrimeira, rotulo: hhmm(viradaPrimeira), ate: viradaFinal, titulo: `${hhmm(viradaPrimeira)}. As linhas se cruzam.`, texto: `${pct(valorEm(n.urnas, viradaPrimeira), 1)} das urnas apuradas.` },
    { inicio: viradaFinal, rotulo: hhmm(viradaFinal), ate: Infinity, titulo: `${hhmm(viradaFinal)}. Cruzam de novo. Desta vez, para ficar.`, texto: `${pct(valorEm(n.urnas, viradaFinal), 1)} das urnas apuradas.` },
  ];
  const ativo = atos.findIndex((a) => t < a.ate);
  const horas = [18, 19, 20, 21].map((h) => h * 3600).filter((x) => x > n.inicio && x < n.fim);
  // rola até o instante pedido (inverso de tempoDe)
  const irPara = (alvo: number) => {
    const el = trilho.current;
    if (!el) return;
    const qAlvo = alvo <= n.inicio ? 0.05 : alvo <= n.pausaFim ? 0.05 + ((alvo - n.inicio) / (n.pausaFim - n.inicio)) * 0.19 : 0.24 + ((alvo - n.pausaFim) / (n.fim - n.pausaFim)) * 0.56;
    window.scrollTo({ top: el.offsetTop + (el.offsetHeight - window.innerHeight) * (qAlvo + 0.005), behavior: 'smooth' });
  };

  if (estatico) {
    return (
      <section className="noite noite-estatica" aria-labelledby="noite-titulo">
        <div className="palco-estatico">
          <h3 id="noite-titulo" className="noite-frase">25.10.2026. O dia em que as linhas se cruzaram.</h3>
          <div className="grafico-estatico">
            <svg className="palco-curva" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Curva da apuração de 17h07 a 21h07">
              <line x1="0" x2={W} y1={Y(50)} y2={Y(50)} className="curva-50" />
              <path d={caminho.outro} className="curva curva-outro" />
              <path d={caminho.eleito} className="curva curva-eleito" />
            </svg>
            <i className="ponto-estatico" style={{ left: `${(X(viradaFinal) / W) * 100}%`, top: `${(Y(50) / H) * 100}%` }} />
          </div>
          <ol className="atos-lista">{atos.map((a) => <li key={a.titulo}><strong>{a.titulo}</strong> {a.texto}</li>)}</ol>
          <div className="marca-estatica">
            <Marca className="marca-grande" />
            <p>A estética do movimento.</p>
          </div>
        </div>
      </section>
    );
  }

  const fimX = (X(caminho.fim[0]) / W) * 100;
  return (
    <section ref={trilho} className="noite" aria-labelledby="noite-titulo">
      <div ref={palco} className="palco" style={{ ['--m' as string]: m }}>
        <h3 id="noite-titulo" className="sr-only">25.10.2026. O dia em que as linhas se cruzaram.</h3>

        <div className="palco-relogio" aria-hidden="true">
          <span className="relogio-hm">{r.hm}</span><span className="relogio-ss">:{r.ss}</span>
          <span className="relogio-data">25.10.2026 · hora de Brasília</span>
        </div>

        <dl className="palco-leitura" aria-live="off">
          <div><dt>Urnas apuradas</dt><dd>{pct(urnas, 1)}</dd></div>
          <div><dt><i className="amostra amostra-eleito" />Curva vermelha</dt><dd>{pct(v)}</dd></div>
          <div><dt><i className="amostra amostra-outro" />Curva azul</dt><dd>{pct(100 - v)}</dd></div>
        </dl>

        <div className="palco-grafico">
          <svg ref={grafico} className="palco-curva" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            {horas.map((h) => <line key={h} x1={X(h)} x2={X(h)} y1="0" y2={H} className="hora-linha" />)}
            <line x1="0" x2={W} y1={Y(50)} y2={Y(50)} className="curva-50" />
            <path d={fantasma} className="curva curva-fantasma" />
            <path d={caminho.outro} className="curva curva-outro" />
            <path d={caminho.eleito} className="curva curva-eleito" />
          </svg>
          {horas.map((h) => <span key={h} className="hora-rotulo" style={{ left: `${(X(h) / W) * 100}%` }}>{Math.round(h / 3600)}h</span>)}
          <i className="cabeca cabeca-eleito" style={{ left: `${fimX}%`, top: `${(Y(caminho.fim[1]) / H) * 100}%` }} />
          <i className="cabeca cabeca-outro" style={{ left: `${fimX}%`, top: `${(Y(100 - caminho.fim[1]) / H) * 100}%` }} />
        </div>

        <div className="palco-atos">
          {atos.map((a, i) => (
            <p key={a.titulo} className="ato" data-ativo={i === ativo && m < 0.35 ? 'sim' : 'nao'}>
              <span className="ato-titulo">{a.titulo}</span>
              <span className="ato-texto">{a.texto}</span>
            </p>
          ))}
        </div>

        <div className="palco-marca" aria-hidden={m < 0.6}>
          <Marca semPonto xRef={xMarca} className="marca-grande" />
          <p>A estética do movimento.</p>
        </div>

        {t >= viradaFinal && ponto && <i className="ponto-voo" style={{ left: ponto.x, top: ponto.y }} />}
        <nav className="trilho trilho-noite" aria-label="Atos da noite">
          {atos.map((a, i) => (
            <button key={a.titulo} className="trilho-passo" aria-current={i === ativo && m < 0.35 ? 'step' : undefined} onClick={() => irPara(a.inicio)}>{a.rotulo}</button>
          ))}
        </nav>
        <p className="rolar" data-visivel={q < 0.03 ? 'sim' : 'nao'}>Role para avançar a noite</p>
      </div>
    </section>
  );
}
