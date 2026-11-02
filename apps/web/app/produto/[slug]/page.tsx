import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../pdp.css';
import { TIRAGEM_FIOS, HORAS_ANTES, LIMIAR_CONTADOR, tamanhoDaFila } from '../../../lib/fila';
import { PRODUTOS, ESTILOS, TEMAS, FORMATOS, produto, escolher, temasDo, previa, type Escolha } from '../../../lib/loja';
import { fotosDe } from '../../../lib/galeria';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | undefined>> };

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return PRODUTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = produto((await params).slug);
  return { title: p ? p.nome : 'Produto', description: p?.resumo };
}

function url(slug: string, e: Escolha) {
  return `/produto/${slug}?estilo=${e.estilo}&tema=${e.tema}&formato=${e.formato}`;
}

const COR_TEMA: Record<string, string> = { papel: '#F3EEE3', tinta: '#15171B', marfim: '#F3EEE2', branco: '#FFFFFF' };

export default async function PaginaProduto({ params, searchParams }: Props) {
  const { slug } = await params;
  const q = await searchParams;
  const p = produto(slug);
  if (!p) notFound();
  const e = escolher(p, { estilo: q.estilo, tema: q.tema, formato: q.formato });
  const total = await tamanhoDaFila();
  const fotos = fotosDe(slug, e.estilo);
  const numerado = e.estilo === 'fios' && p.tipo === 'fisico';
  const outros = PRODUTOS.filter((o) => o.slug !== slug);

  return (
    <div className="pdp">
      <nav className="trilha" aria-label="Você está em"><Link href="/loja">Loja</Link> <span aria-hidden="true">/</span> <span aria-current="page">{p.nome}</span></nav>
      <section className="produto">
        <div className="galeria">
          <div className="arte sombra" dangerouslySetInnerHTML={{ __html: previa(e, numerado ? { tiragem: TIRAGEM_FIOS } : {}) }} />
          <p className="galeria-nota">Prévia com marca d’água: a peça vendida é esta, sem a marca.</p>
          {fotos.length > 0 && (
            <div className="galeria-fotos">
              {fotos.map((f) => (
                <figure key={f.src} className="foto">
                  <img src={f.src} alt={`${p.nome}, estilo ${ESTILOS[e.estilo].nome}: ${f.legenda}`} width={1024} height={1024} loading="lazy" />
                  <figcaption>{f.legenda}. Cena gerada por IA com a arte real.</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        <div className="painel">
          <p className="painel-linha">{p.tipo === 'digital' ? 'Arquivo digital' : 'Peça física'} · Geografia da Virada</p>
          <h1>{p.nome}</h1>
          <p className="preco">Preço na abertura da venda</p>
          <p className="descricao">{p.resumo}</p>

          <div className="opcoes">
            {p.estilos.length > 1 && (
              <fieldset>
                <legend>Estilo <b>{ESTILOS[e.estilo].nome}</b></legend>
                <div className="chips">
                  {p.estilos.map((s) => (
                    <Link key={s} className="chip" aria-current={s === e.estilo} href={url(slug, escolher(p, { ...e, estilo: s }))}>{ESTILOS[s].nome}</Link>
                  ))}
                </div>
                <p className="descricao">{ESTILOS[e.estilo].descricao}</p>
              </fieldset>
            )}
            {temasDo(e.estilo, p).length > 1 && (
              <fieldset>
                <legend>Tema <b>{TEMAS[e.tema]}</b></legend>
                <div className="chips">
                  {temasDo(e.estilo, p).map((t) => (
                    <Link key={t} className="chip chip-tema" aria-current={t === e.tema} href={url(slug, { ...e, tema: t })}><i style={{ background: COR_TEMA[t] }} aria-hidden="true" />{TEMAS[t]}</Link>
                  ))}
                </div>
              </fieldset>
            )}
            {p.formatos.length > 1 && (
              <fieldset>
                <legend>Tamanho <b>{FORMATOS[e.formato]}</b></legend>
                <div className="chips">
                  {p.formatos.map((f) => (
                    <Link key={f} className="chip" aria-current={f === e.formato} href={url(slug, { ...e, formato: f })}>{FORMATOS[f]}</Link>
                  ))}
                </div>
              </fieldset>
            )}
          </div>

          {numerado && <p className="tiragem">Primeira tiragem numerada: {TIRAGEM_FIOS} peças. Cada uma sai com o seu número impresso no rodapé.</p>}

          {q.fila && Number(q.fila) > 0 ? (
            <p className="ok">Você é o nº {Number(q.fila).toLocaleString('pt-BR')} da fila. A fila compra {HORAS_ANTES} horas antes da abertura; avisamos por e-mail.</p>
          ) : (
            <form className="lista" method="post" action="/api/lista">
              <input type="hidden" name="produto" value={slug} />
              <input type="hidden" name="escolha" value={`${e.estilo}/${e.tema}/${e.formato}`} />
              <label htmlFor="email">Entre na fila e compre {HORAS_ANTES} horas antes da abertura.
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

          <div className="detalhes">
            <details open><summary>Entrega</summary><p>{p.entrega} A prévia tem marca d’água; o arquivo final só é gerado depois do pagamento confirmado.</p></details>
            <details><summary>De onde vem o desenho</summary><p>Cada ponto da curva é a soma dos boletins de urna do TSE na ordem em que chegaram, com zero voto de diferença para o resultado oficial. <Link href="/metodo">Como a curva foi reconstruída</Link>.</p></details>
            <details><summary>O que é desenho</summary><p>Os três filamentos de tinta, o tremor das linhas e a textura do papel são estilo. A curva e os números são dado.</p></details>
          </div>
        </div>
      </section>

      <section className="relacionados" aria-labelledby="rel-titulo">
        <h2 id="rel-titulo">Veja também</h2>
        <ul>
          {outros.map((o) => (
            <li key={o.slug}><Link href={`/produto/${o.slug}`}><span>{o.nome}</span><small>{o.resumo}</small></Link></li>
          ))}
          <li><Link href="/loja?colecao=nordeste"><span>Nordeste e capitais</span><small>As ruas de cada capital, com a curva da noite.</small></Link></li>
        </ul>
      </section>
    </div>
  );
}
