'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Leitura = { id: string; nome: string; descricao: string; href: string; svg: string };

/** As três peças como papéis empilhados em perspectiva; a rolagem traz cada uma para a frente. */
export function LeiturasScroll({ leituras }: { leituras: Leitura[] }) {
  const trilho = useRef<HTMLElement>(null);
  const [k, setK] = useState(0);

  useEffect(() => {
    let quadro = 0;
    const ler = () => {
      quadro = 0;
      const el = trilho.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const q = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      setK(q * (leituras.length - 1));
    };
    const pedir = () => { if (!quadro) quadro = requestAnimationFrame(ler); };
    ler();
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
    return () => { window.removeEventListener('scroll', pedir); window.removeEventListener('resize', pedir); cancelAnimationFrame(quadro); };
  }, [leituras.length]);

  const ativo = Math.round(k);
  const ir = (i: number) => {
    const el = trilho.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (total * i) / (leituras.length - 1), behavior: 'smooth' });
  };

  return (
    <section ref={trilho} className="leituras" aria-labelledby="leituras-titulo">
      <div className="leituras-palco">
        <div className="leituras-texto">
          <h2 id="leituras-titulo">Três leituras da mesma noite.</h2>
          <div className="trilho" role="tablist" aria-label="Estilos">
            {leituras.map((l, i) => (
              <button key={l.id} role="tab" aria-selected={i === ativo} className="trilho-passo" onClick={() => ir(i)}>{l.nome}</button>
            ))}
          </div>
          <div className="leituras-descricoes">
            {leituras.map((l, i) => (
              <div key={l.id} className="leitura-descricao" data-ativo={i === ativo ? 'sim' : 'nao'} aria-hidden={i !== ativo}>
                <p>{l.descricao}</p>
                <Link href={l.href} tabIndex={i === ativo ? 0 : -1}>Ver no quadro</Link>
              </div>
            ))}
          </div>
        </div>
        <div className="pilha" aria-hidden="true">
          {leituras.map((l, i) => {
            const d = i - k;
            const frente = d < 0 ? Math.max(-1.2, d) : d;
            const estilo = frente >= 0
              ? { transform: `translate3d(${frente * 9}%, ${frente * -7}%, ${-frente * 140}px) rotateY(-14deg) rotateX(8deg) rotateZ(${-3 + frente * 2}deg)`, opacity: Math.max(0, 1 - frente * 0.28), zIndex: 10 - i }
              : { transform: `translate3d(${-frente * 12}%, ${frente * 75}%, 60px) rotateY(-14deg) rotateX(8deg) rotateZ(${-3 - frente * 10}deg)`, opacity: Math.max(0, 1 + frente * 1.6), zIndex: 20 };
            return <div key={l.id} className="folha" style={estilo} dangerouslySetInnerHTML={{ __html: l.svg }} />;
          })}
        </div>
      </div>
    </section>
  );
}
