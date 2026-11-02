import type { Metadata } from 'next';
import Link from 'next/link';
import { vitrine, COLECOES, SUPORTES, type Colecao, type Suporte } from '../../lib/vitrine';
import { HORAS_ANTES } from '../../lib/fila';
import { Cartao } from './Cartao';
import './loja.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Loja', description: 'Quadros, pôsteres, arquivos digitais e camiseta da INFLEXO. A venda abre em breve; a fila compra primeiro.' };

type Props = { searchParams: Promise<Record<string, string | undefined>> };

function link(colecao?: string, suporte?: string) {
  const q = new URLSearchParams();
  if (colecao) q.set('colecao', colecao);
  if (suporte) q.set('suporte', suporte);
  const s = q.toString();
  return s ? `/loja?${s}` : '/loja';
}

const GARANTIAS: [string, string][] = [
  ['A prévia é a peça', 'O mesmo motor desenha a prévia e o arquivo de impressão.'],
  ['Conferido com o TSE', 'Cada número da peça bate com o resultado oficial, voto a voto.'],
  ['A fila compra primeiro', `Quem está na fila compra ${HORAS_ANTES} horas antes da abertura.`],
  ['Preço de verdade', 'O preço sai da cotação real dos fornecedores. Até lá, nada de número inventado.'],
];

export default async function Loja({ searchParams }: Props) {
  const q = await searchParams;
  const colecao = COLECOES.some((c) => c.id === q.colecao) ? (q.colecao as Colecao) : undefined;
  const suporte = SUPORTES.some((s) => s.id === q.suporte) ? (q.suporte as Suporte) : undefined;
  const todos = vitrine();
  const itens = todos.filter((i) => (!colecao || i.colecao === colecao) && (!suporte || i.suportes.includes(suporte)));
  const comDestaque = !colecao && !suporte;

  return (
    <div className="loja">
      <header className="loja-topo">
        <div>
          <h1>Loja</h1>
          <p>Quadros, pôsteres, arquivos e camiseta desenhados com dado público. A venda abre em breve; entre na fila e compre {HORAS_ANTES} horas antes.</p>
        </div>
        <a className="botao" href="/#fecho">Entrar na fila</a>
      </header>

      <nav className="filtros" aria-label="Filtrar a loja">
        <div className="filtros-grupo" role="group" aria-label="Coleção">
          <Link className="filtro" aria-current={!colecao ? 'true' : undefined} href={link(undefined, suporte)}>Tudo</Link>
          {COLECOES.map((c) => (
            <Link key={c.id} className="filtro" aria-current={colecao === c.id ? 'true' : undefined} href={link(c.id, suporte)}>
              {c.nome} <span className="filtro-n">{todos.filter((i) => i.colecao === c.id && (!suporte || i.suportes.includes(suporte))).length}</span>
            </Link>
          ))}
        </div>
        <div className="filtros-grupo filtros-suporte" role="group" aria-label="Suporte">
          {SUPORTES.map((s) => (
            <Link key={s.id} className="filtro filtro-leve" aria-current={suporte === s.id ? 'true' : undefined} href={link(colecao, suporte === s.id ? undefined : s.id)}>{s.nome}</Link>
          ))}
        </div>
        <p className="filtros-total" aria-live="polite">{itens.length} {itens.length === 1 ? 'peça' : 'peças'}</p>
      </nav>

      {itens.length === 0 ? (
        <p className="loja-vazia">Nenhuma peça com esse filtro. <Link href="/loja">Ver tudo</Link></p>
      ) : (
        <ul className="grade">
          {itens.map((item, i) => (
            <FragmentoComDestaque key={item.slug} mostrar={comDestaque && i === 6}>
              <Cartao item={item} prioridade={i < 4} />
            </FragmentoComDestaque>
          ))}
        </ul>
      )}

      <ul className="garantias">
        {GARANTIAS.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
      </ul>
    </div>
  );
}

/** Antes do 7º item, sem filtro, entra o bloco editorial da Geografia da Virada no Nordeste. */
function FragmentoComDestaque({ mostrar, children }: { mostrar: boolean; children: React.ReactNode }) {
  if (!mostrar) return <>{children}</>;
  return (
    <>
      <li className="destaque">
        <Link href="/loja?colecao=nordeste" className="destaque-link">
          <img src="/colecoes/capitais-nordeste.jpg" alt="Três quadros na parede: Salvador, Recife e Fortaleza" width={1024} height={688} loading="lazy" />
          <span className="destaque-texto">
            <span className="destaque-titulo">O Nordeste, rua por rua.</span>
            <span>A região e as nove capitais, cada uma com o próprio mapa e o resultado conferido com o TSE.</span>
            <span className="destaque-cta">Ver as 10 peças</span>
          </span>
        </Link>
      </li>
      {children}
    </>
  );
}
