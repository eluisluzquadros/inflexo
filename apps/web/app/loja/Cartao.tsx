import Link from 'next/link';
import type { ItemVitrine } from '../../lib/vitrine';

const COR_TEMA: Record<string, { cor: string; nome: string }> = {
  papel: { cor: '#F1F1EE', nome: 'Papel' },
  tinta: { cor: '#14161B', nome: 'Tinta' },
  marfim: { cor: '#F3EEE2', nome: 'Marfim' },
  branco: { cor: '#FFFFFF', nome: 'Algodão branco' },
};

function Arte({ item }: { item: ItemVitrine }) {
  const a = item.arte;
  if ('svg' in a) return <span className="prod-arte" dangerouslySetInnerHTML={{ __html: a.svg }} />;
  if ('src' in a) return <img className="prod-arte" src={a.src} alt="" width={a.largura} height={a.altura} loading="lazy" />;
  if (a.cartao === 'momentos') {
    return (
      <span className="prod-arte prod-cartao prod-cartao-momento">
        <span className="pc-hora">19h42</span>
        <span className="pc-frase">O dia em que pegamos a chave.</span>
        <svg viewBox="0 0 200 40" className="pc-curva" aria-hidden="true"><path d="M0 30 C 40 30, 60 28, 90 20 S 150 6, 200 8" /><circle cx="118" cy="13" r="3.4" /></svg>
        <span className="pc-data">14.03.2025 · exemplo</span>
      </span>
    );
  }
  return (
    <span className="prod-arte prod-cartao prod-cartao-frase">
      <span className="pc-citacao">Não sei, só sei que foi assim.</span>
      <span className="pc-credito">João Grilo, <i>O Auto da Compadecida</i></span>
    </span>
  );
}

/** Cartão de produto da vitrine. A imagem principal é a prévia; a foto (cena com a arte real) entra no hover. */
export function Cartao({ item, prioridade = false }: { item: ItemVitrine; prioridade?: boolean }) {
  const corpo = (
    <>
      <span className={`prod-palco${item.arte && 'cartao' in item.arte ? ' prod-palco-cartao' : ''}${item.capa ? ' prod-palco-capa' : ''}`}>
        {item.capa ? (
          <>
            <img className="prod-capa" src={item.capa} alt={`${item.nome}, ${item.linha}`} width={1024} height={1024} loading={prioridade ? 'eager' : 'lazy'} />
            <span className="prod-revela" aria-hidden="true"><Arte item={item} /></span>
          </>
        ) : (
          <>
            <Arte item={item} />
            {item.foto && <img className="prod-foto" src={item.foto} alt="" width={896} height={1120} loading={prioridade ? 'eager' : 'lazy'} />}
          </>
        )}
        <span className="prod-selos">
          {item.emPreparo && <span className="selo selo-preparo">Em preparação</span>}
          {item.selo && <span className="selo">{item.selo}</span>}
        </span>
        {item.href && <span className="prod-acao" aria-hidden="true">Ver a peça</span>}
      </span>
      <span className="prod-info">
        <span className="prod-nome">{item.nome}</span>
        <span className="prod-preco">{item.preco === null ? 'Preço em definição' : item.preco}</span>
        <span className="prod-linha">{item.linha}</span>
        <span className="prod-formatos">{item.formatos}</span>
        <span className="prod-temas" aria-label={`Temas: ${item.temas.map((t) => COR_TEMA[t].nome).join(', ')}`}>
          {item.temas.map((t) => <i key={t} className="tema-ponto" style={{ background: COR_TEMA[t].cor }} title={COR_TEMA[t].nome} />)}
        </span>
      </span>
    </>
  );
  return (
    <li className="prod">
      {item.href ? <Link href={item.href} className="prod-link">{corpo}</Link> : <div className="prod-link prod-sem-link">{corpo}</div>}
    </li>
  );
}
