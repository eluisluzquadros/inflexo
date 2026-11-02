import { NextResponse } from 'next/server';
import { buscarPedido } from '../../../../../lib/pedidos';
import { linkAssinado } from '../../../../../lib/arquivos';
import { nomeDoArquivo } from '../../../../../lib/tarefas';

// Download do arquivo digital. Só sai com o pedido em "pago": reembolso ou contestação cortam o acesso
// (EXP-317, H3). O link assinado vale 10 minutos; a página do pedido gera um novo a cada clique.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await buscarPedido(id).catch(() => null);
  if (!p) return NextResponse.json({ erro: 'Pedido não encontrado.' }, { status: 404 });
  if (p.status !== 'pago') return NextResponse.json({ erro: 'Este pedido não está ativo, então o arquivo não está disponível.' }, { status: 403 });
  if (!p.arquivo_path) return NextResponse.json({ erro: 'O arquivo ainda está sendo preparado. Tente de novo em instantes.' }, { status: 409 });
  try {
    const url = await linkAssinado(p.arquivo_path, nomeDoArquivo(p));
    return new NextResponse(null, { status: 303, headers: { Location: url, 'Cache-Control': 'no-store' } });
  } catch (erro) {
    console.error('download: falha', erro instanceof Error ? erro.message : erro);
    return NextResponse.json({ erro: 'Não conseguimos gerar o link agora. Tente de novo em instantes.' }, { status: 503 });
  }
}
