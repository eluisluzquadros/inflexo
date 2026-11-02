import { NextResponse } from 'next/server';
import { produto } from '../../../lib/loja';
import { entrar } from '../../../lib/fila';
import { pecaGeografia } from '../../../lib/vitrine';

// Fila de espera. Guarda só e-mail, produto, escolha, consentimento e data. Nada da coleção vai para ferramentas de anúncio.
export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const slug = String(form.get('produto') ?? '');
  const escolha = String(form.get('escolha') ?? '').slice(0, 60);
  const consentimento = form.get('consentimento') === 'sim';
  const geo = slug.startsWith('geografia:') ? pecaGeografia(slug.slice(10)) : null;
  const p = slug === 'colecao' ? { slug } : geo ?? produto(slug);
  if (!p || !consentimento || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return NextResponse.json({ erro: 'Informe um e-mail válido e marque o consentimento.' }, { status: 400 });
  }
  let posicao: number;
  try {
    posicao = await entrar({ email, produto: slug, escolha, consentimento: 'aviso de abertura da venda e acesso antecipado' });
  } catch (erro) {
    console.error('fila: falha ao gravar', erro instanceof Error ? erro.message : erro);
    return NextResponse.json({ erro: 'Não conseguimos registrar agora. Tente de novo em instantes.' }, { status: 503 });
  }
  const destino = slug === 'colecao' ? `/?fila=${posicao}#fecho` : geo ? `/geografia/${geo.slug}?fila=${posicao}` : `/produto/${slug}?fila=${posicao}`;
  return NextResponse.redirect(new URL(destino, req.url), 303);
}
