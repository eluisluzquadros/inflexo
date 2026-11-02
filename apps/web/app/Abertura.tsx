'use client';

import Link from 'next/link';
import { useRef, useState, type KeyboardEvent } from 'react';

export type ObraAbertura = {
  id: string;
  nome: string;
  lugar: string;
  descricao: string;
  href: string;
  arte: { svg: string } | { src: string };
};

/** A primeira dobra já permite descobrir uma peça real, antes da narrativa da noite. */
export function Abertura({ obras, boletins, horasAntes }: { obras: ObraAbertura[]; boletins: number; horasAntes: number }) {
  const [ativo, setAtivo] = useState(0);
  const abas = useRef<(HTMLButtonElement | null)[]>([]);
  const obra = obras[ativo];

  function navegar(event: KeyboardEvent<HTMLButtonElement>, i: number) {
    let proximo: number;
    switch (event.key) {
      case 'ArrowRight': proximo = (i + 1) % obras.length; break;
      case 'ArrowLeft': proximo = (i - 1 + obras.length) % obras.length; break;
      case 'Home': proximo = 0; break;
      case 'End': proximo = obras.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setAtivo(proximo);
    abas.current[proximo]?.focus();
  }

  return (
    <section className="abertura" aria-labelledby="abertura-titulo">
      <div className="abertura-conteudo">
        <div className="abertura-texto">
          <p className="abertura-contexto">Arte de dados. Objetos de memória.</p>
          <h1 id="abertura-titulo">O instante em que a noite <em>virou.</em></h1>
          <p className="abertura-resumo">A apuração de 25.10.2026 transformada em quadros e pôsteres. A curva da noite inteira ou o mapa do seu lugar.</p>

          <div className="abertura-escolha">
            <p id="abertura-escolha-titulo">Uma noite. Diferentes formas de guardar.</p>
            <div className="abertura-abas" role="tablist" aria-labelledby="abertura-escolha-titulo">
              {obras.map((item, i) => (
                <button
                  key={item.id}
                  ref={(el) => { abas.current[i] = el; }}
                  type="button"
                  role="tab"
                  id={`abertura-aba-${item.id}`}
                  aria-controls="abertura-previa"
                  aria-selected={ativo === i}
                  tabIndex={ativo === i ? 0 : -1}
                  onClick={() => setAtivo(i)}
                  onKeyDown={(event) => navegar(event, i)}
                >
                  <span>{item.nome}</span>
                  <span className="abertura-aba-local">{item.lugar}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="abertura-acoes">
            <Link className="botao-noite" href={obra.href}>Conhecer {obra.nome}<span aria-hidden="true">↗</span></Link>
            <a className="link-noite" href="#fecho">Entrar na fila</a>
          </div>
          <p className="abertura-acesso">A venda abre em breve. A fila tem {horasAntes} horas de acesso antecipado.</p>
        </div>

        <div className="abertura-galeria" id="abertura-previa" role="tabpanel" aria-labelledby={`abertura-aba-${obra.id}`}>
          <span className="abertura-hora" aria-hidden="true">20h23</span>
          <div className="abertura-edicao"><span>25.10.2026</span><span>{String(ativo + 1).padStart(2, '0')} / {String(obras.length).padStart(2, '0')}</span></div>
          <figure className="abertura-obra">
            <Link className="abertura-folha" href={obra.href} aria-label={`Ver a peça ${obra.nome}, ${obra.lugar}`}>
              {'svg' in obra.arte
                ? <div key={obra.id} className="abertura-arte" aria-hidden="true" dangerouslySetInnerHTML={{ __html: obra.arte.svg }} />
                : <img key={obra.id} className="abertura-arte" src={obra.arte.src} alt="" width={900} height={1273} fetchPriority="high" />}
              <span className="abertura-ver" aria-hidden="true">Ver a peça ↗</span>
            </Link>
            <figcaption aria-live="polite" aria-atomic="true">
              <div className="abertura-ficha"><span>{obra.nome} <span className="abertura-ficha-local">/ {obra.lugar}</span></span><span>A3 · A2</span></div>
              <p>{obra.descricao}</p>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="abertura-base">
        <p><span className="abertura-dado">{boletins.toLocaleString('pt-BR')}</span> boletins de urna. <Link href="/metodo">O desenho vem do dado.</Link></p>
        <a href="#colecoes">Conheça as três coleções <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
