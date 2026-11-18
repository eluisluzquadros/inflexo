import type { Metadata } from 'next';
import { EMPRESA } from '../../lib/empresa';
import { Identificacao, NavLegal } from '../legal';

export const metadata: Metadata = { title: 'Trocas, devoluções e arrependimento', description: 'Como desistir de uma compra, devolver uma peça ou acionar a garantia na INFLEXO.' };

export default function Trocas() {
  return (
    <div className="pagina"><article className="metodo legal">
      <h1>Trocas, devoluções e arrependimento</h1>
      <p className="legal-data">Atualizado em {EMPRESA.atualizadoEm}.</p>
      <Identificacao />

      <h2>Direito de arrependimento: 7 dias</h2>
      <p>Pelo artigo 49 do Código de Defesa do Consumidor, você pode desistir de qualquer compra feita no site em até 7 dias, contados do recebimento da peça física ou da compra do arquivo digital. Basta escrever para <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> com o número do pedido. Não é preciso explicar o motivo.</p>
      <ul>
        <li><strong>Arquivo digital:</strong> devolvemos o valor pago e o link de download deixa de funcionar.</li>
        <li><strong>Peça física:</strong> enviamos as instruções de devolução; o custo do envio de volta é nosso. O valor é devolvido assim que a peça é postada de volta.</li>
      </ul>
      <p>A devolução do dinheiro é feita pelo mesmo meio do pagamento. No cartão, o estorno aparece na fatura de acordo com o prazo da operadora.</p>

      <h2>Defeito ou avaria no transporte</h2>
      <p>Se a peça chegar danificada, com defeito de impressão ou diferente do pedido, escreva em até 90 dias do recebimento, com fotos da peça e da embalagem. Produzimos e enviamos outra sem custo ou, se preferir, devolvemos o valor. O arquivo digital com problema de abertura ou de qualidade é corrigido ou reembolsado.</p>

      <h2>Troca por outro modelo ou tamanho</h2>
      <p>Como cada peça é produzida sob demanda, a troca por gosto (outro estilo, tema ou tamanho) segue o direito de arrependimento: devolvemos o valor e você faz um novo pedido.</p>
      <NavLegal />
    </article></div>
  );
}
