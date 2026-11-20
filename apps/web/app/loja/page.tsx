import type { Metadata } from 'next';
import Link from 'next/link';
import { vitrine, COLECOES, SUPORTES, type Colecao, type Suporte } from '../../lib/vitrine';
import { HORAS_ANTES } from '../../lib/fila';
import { Cartao } from './Cartao';
import { COLECOES_MARCA, STATUS_LOJA } from '../../lib/lancamento';
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
  ['História e processo', 'As fontes e as escolhas de composição acompanham cada estudo.'],
  ['Acesso antecipado', `A lista recebe o acesso ${HORAS_ANTES} horas antes da abertura.`],
  ['Preços no lançamento', 'Materiais, valores e condições de entrega serão apresentados na abertura.'],
];

export default async function Loja({ searchParams }: Props) {
  const q = await searchParams;
  const colecao = COLECOES.some((c) => c.id === q.colecao) ? (q.colecao as Colecao) : undefined;
  const suporte = SUPORTES.some((s) => s.id === q.suporte) ? (q.suporte as Suporte) : undefined;
  const todos = vitrine();
  const itens = todos.filter((i) => (!colecao || i.colecao === colecao) && (!suporte || i.suportes.includes(suporte)));

  return (
    <div className="loja">
      <header className="loja-topo">
        <div>
          <p className="loja-status">{STATUS_LOJA} · Loja autoral</p>
          <h1>Loja</h1>
          <p>Um primeiro olhar sobre as peças da INFLEXO. Explore os estudos e receba o aviso quando a loja abrir.</p>
        </div>
        <a className="botao" href="/#fecho">Avise-me no lançamento</a>
      </header>

      <nav className="loja-colecoes" aria-label="Coleções da INFLEXO">
        {COLECOES_MARCA.map((c) => <Link key={c.id} href={`/#${c.id}`}><span>{STATUS_LOJA}</span><strong>{c.nome}</strong><small>{c.linha}</small><span className="loja-colecao-acao">Conhecer a coleção ↗</span></Link>)}
      </nav>
      <div className="loja-acervo"><h2>Acervo em estudo</h2><p>Peças e séries anteriores à abertura. Os filtros abaixo exploram este acervo; as próximas coleções estão acima.</p></div>
      <nav className="filtros" aria-label="Filtrar a loja">
        <div className="filtros-grupo" role="group" aria-label="Série do acervo">
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
          {itens.map((item, i) => <Cartao key={item.slug} item={item} prioridade={i < 4} />)}
        </ul>
      )}

      <ul className="garantias">
        {GARANTIAS.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
      </ul>
    </div>
  );
}
