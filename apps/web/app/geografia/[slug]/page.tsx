import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HORAS_ANTES, LIMIAR_CONTADOR, tamanhoDaFila } from '../../../lib/fila';
import { pecaGeografia, pecasGeografia, regiao as carregarRegiao } from '../../../lib/vitrine';
import '../../pdp.css';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | undefined>> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = pecaGeografia((await params).slug);
  return { title: p ? `${p.nome} · A Geografia da Virada` : 'A Geografia da Virada' };
}

const pct = (n: number) => `${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

export default async function PaginaGeografia({ params, searchParams }: Props) {
  const { slug } = await params;
  const q = await searchParams;
  const p = pecaGeografia(slug);
  if (!p) notFound();
  const total = tamanhoDaFila();
  const regiao = p.tipo === 'regiao' ? carregarRegiao(slug) : null;
  const outras = pecasGeografia().filter((o) => o.slug !== slug && (p.tipo === 'continente' ? o.tipo === 'regiao' : o.tipo === p.tipo)).slice(0, 4);

  return (
    <div className="pagina">
      <nav className="trilha" aria-label="Você está em"><Link href="/loja">Loja</Link> <span aria-hidden="true">/</span> <Link href={`/loja?colecao=${p.tipo === 'continente' ? 'america' : p.tipo === 'capital' || p.slug === 'nordeste' ? 'nordeste' : 'regioes'}`}>{p.tipo === 'continente' ? 'América do Sul' : p.tipo === 'capital' || p.slug === 'nordeste' ? 'Nordeste' : 'Regiões'}</Link> <span aria-hidden="true">/</span> <span aria-current="page">{p.nome}</span></nav>
      <section className="produto">
        <div className="galeria">
          <img className="arte sombra" src={`/loja/${p.slug}.jpg`} alt={`Prévia do pôster ${p.nome}, A Geografia da Virada`} width={900} height={1273} />
          {p.fotos?.map((f) => (
            <figure key={f.src} className="foto"><img src={f.src} alt={`${p.nome}: ${f.legenda}`} width={1024} height={1024} loading="lazy" /><figcaption>{f.legenda}. Cena gerada por IA com a arte real aplicada.</figcaption></figure>
          ))}
        </div>
        <div>
          <h1>{p.nome}</h1>
          <p className="descricao">
            {p.tipo === 'continente'
              ? 'A América Invertida: o continente de cabeça para baixo, com o sul no alto, em traço de tinta, e a curva nacional da noite atravessando o mapa. É a homenagem à ideia de olhar o nosso lugar pelo avesso.'
              : p.tipo === 'regiao'
              ? `O contorno de ${p.nome} em traço de tinta (malha do IBGE), com a curva nacional da noite atravessando a região e o resultado da região escrito na peça. O resultado de cada estado está na tabela abaixo.`
              : `As ruas de ${p.nome} em cinza (OpenStreetMap, janela de 10 km), com a curva nacional da noite atravessando a cidade e o resultado do município escrito na peça.`}
          </p>
          <p className="preco">Preço em definição</p>

          <dl className="ficha">
            <div><dt>{p.tipo === 'continente' ? 'Curva vermelha no Brasil' : p.tipo === 'regiao' ? 'Curva vermelha na região' : 'Curva vermelha no município'}</dt><dd>{pct(p.pct)}</dd></div>
            <div><dt>Boletins de urna somados</dt><dd>{p.boletins.toLocaleString('pt-BR')}</dd></div>
            <div><dt>Conferência com o TSE</dt><dd>0 voto de diferença</dd></div>
            <div><dt>Suporte</dt><dd>Pôster ou quadro, A3 ou A2</dd></div>
            <div><dt>Temas</dt><dd>Papel ou Tinta</dd></div>
          </dl>

          {regiao && (
            <table className="livro-claro">
              <caption className="sr-only">Curva vermelha por estado, {p.nome}</caption>
              <thead><tr><th scope="col">Estado</th><th scope="col">Curva vermelha</th></tr></thead>
              <tbody>{Object.entries(regiao.ufs).sort((a, b) => b[1].pct_eleito - a[1].pct_eleito).map(([uf, u]) => <tr key={uf}><td>{u.nome}</td><td>{pct(u.pct_eleito)}</td></tr>)}</tbody>
            </table>
          )}

          <p className="aviso">A prévia tem marca d’água; o arquivo final só é gerado depois do pagamento. A curva desenhada é a nacional; o número local vem escrito na peça.</p>

          {q.fila && Number(q.fila) > 0 ? (
            <p className="ok">Você é o nº {Number(q.fila).toLocaleString('pt-BR')} da fila. A fila compra {HORAS_ANTES} horas antes da abertura; avisamos por e-mail.</p>
          ) : (
            <form className="lista" method="post" action="/api/lista">
              <input type="hidden" name="produto" value={`geografia:${p.slug}`} />
              <input type="hidden" name="escolha" value={p.slug} />
              <label htmlFor="email">Entre na fila. Quem está nela compra {HORAS_ANTES} horas antes da abertura.
                <input id="email" name="email" type="email" required autoComplete="email" placeholder="seu@email.com" />
              </label>
              <label className="consentimento" htmlFor="consentimento">
                <input id="consentimento" name="consentimento" type="checkbox" required value="sim" />
                Aceito receber da INFLEXO o aviso de abertura e o acesso antecipado. Uso só para isso e apago a pedido.
              </label>
              <button className="botao" type="submit">Entrar na fila</button>
              {total >= LIMIAR_CONTADOR && <p className="contador">{total.toLocaleString('pt-BR')} pessoas já estão na fila.</p>}
            </form>
          )}
          <p className="descricao"><Link href="/metodo">Como a curva foi reconstruída</Link></p>
        </div>
      </section>

      <section className="relacionados" aria-labelledby="rel-titulo">
        <h2 id="rel-titulo">{p.tipo === 'regiao' || p.tipo === 'continente' ? 'As regiões do Brasil' : 'Mais do Nordeste'}</h2>
        <ul>
          {outras.map((o) => (
            <li key={o.slug}>
              <Link href={`/geografia/${o.slug}`}>
                <img src={`/loja/${o.slug}.jpg`} alt="" width={900} height={1273} loading="lazy" />
                <span>{o.nome}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
