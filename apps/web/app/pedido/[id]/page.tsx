import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../pdp.css';
import { buscarPedido } from '../../../lib/pedidos';
import { produto, ESTILOS, TEMAS, FORMATOS } from '../../../lib/loja';
import { reais } from '../../../lib/precos';
import { Atualizar } from './Atualizar';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Seu pedido', robots: { index: false } };

// O status vem do banco, que só o webhook verificado altera. Esta página nunca libera nada sozinha.
const TEXTO: Record<string, { titulo: string; corpo: string }> = {
  aguardando_pagamento: { titulo: 'Confirmando o pagamento…', corpo: 'Com cartão, leva alguns segundos. Com Pix, assim que o pagamento cair. Esta página se atualiza sozinha.' },
  pago: { titulo: 'Pagamento confirmado.', corpo: 'Obrigado. Seu pedido entrou na produção e você recebe as atualizações no e-mail usado no pagamento.' },
  falhou: { titulo: 'O pagamento não foi concluído.', corpo: 'Nada foi cobrado. Você pode tentar de novo pela página da peça.' },
  expirado: { titulo: 'O pagamento expirou.', corpo: 'O tempo para pagar acabou e nada foi cobrado. Você pode começar de novo pela página da peça.' },
  cancelado: { titulo: 'Pedido cancelado.', corpo: 'Se tiver alguma dúvida, responda o e-mail do pedido.' },
  reembolsado: { titulo: 'Pedido reembolsado.', corpo: 'O valor foi devolvido ao meio de pagamento usado. No cartão, o estorno aparece em até duas faturas; no Pix, em minutos.' },
  em_disputa: { titulo: 'Pagamento em contestação.', corpo: 'O banco abriu uma contestação deste pagamento. O pedido fica parado até a resposta. Se não reconhece a contestação, responda o e-mail do pedido.' },
  disputa_perdida: { titulo: 'Pagamento estornado pelo banco.', corpo: 'A contestação foi encerrada e o valor voltou para quem pagou. Se tiver alguma dúvida, responda o e-mail do pedido.' },
};
const DESCONHECIDO = { titulo: 'Pedido registrado.', corpo: 'Se tiver alguma dúvida, responda o e-mail do pedido.' };

export default async function PaginaPedido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pedido = await buscarPedido(id).catch(() => null);
  if (!pedido) notFound();
  const p = produto(pedido.produto);
  const t = TEXTO[pedido.status] ?? DESCONHECIDO;

  return (
    <div className="pdp">
      <section className="pedido">
        <p className="painel-linha">Pedido {pedido.id.slice(0, 8).toUpperCase()}</p>
        <h1>{t.titulo}</h1>
        <p className="descricao">{t.corpo}</p>
        <dl className="ficha">
          <div><dt>Peça</dt><dd>{p?.nome ?? pedido.produto} · {ESTILOS[pedido.estilo]?.nome ?? pedido.estilo}</dd></div>
          <div><dt>Tema e tamanho</dt><dd>{TEMAS[pedido.tema] ?? pedido.tema} · {FORMATOS[pedido.formato] ?? pedido.formato}</dd></div>
          <div><dt>Total</dt><dd>{reais(pedido.total_pago_centavos ?? pedido.valor_centavos + pedido.frete_centavos)}</dd></div>
        </dl>
        <p><Link className="botao" href="/loja">Voltar para a loja</Link></p>
      </section>
      {pedido.status === 'aguardando_pagamento' && <Atualizar />}
    </div>
  );
}
