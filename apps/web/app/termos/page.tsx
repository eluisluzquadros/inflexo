import type { Metadata } from 'next';
import Link from 'next/link';
import { EMPRESA } from '../../lib/empresa';
import { Identificacao, NavLegal } from '../legal';

export const metadata: Metadata = { title: 'Termos de uso e venda', description: 'Quem vende, como funcionam o pagamento, a entrega e o uso das peças da INFLEXO.' };

export default function Termos() {
  return (
    <div className="pagina"><article className="metodo legal">
      <h1>Termos de uso e venda</h1>
      <p className="legal-data">Atualizado em {EMPRESA.atualizadoEm}.</p>
      <Identificacao />

      <h2>1. O que vendemos</h2>
      <p>Peças de arte desenhadas a partir de dados públicos: arquivos digitais (imagem em PNG para celular, tela ou impressão), pôsteres, quadros e camisetas. A descrição de cada peça, com formato, material e medidas, está na página do produto. As fotos de ambiente são geradas por computador com a arte real aplicada; a arte que você recebe é a mesma da prévia, sem a marca d’água.</p>

      <h2>2. Preço e pagamento</h2>
      <p>O preço aparece na página do produto e é confirmado na tela de pagamento, em reais, com o frete das peças físicas somado antes de você pagar. O pagamento é processado pela Stripe; a {EMPRESA.marca} não recebe nem guarda os dados do seu cartão. A compra só é confirmada quando o pagamento é aprovado.</p>

      <h2>3. Entrega do arquivo digital</h2>
      <p>Depois da aprovação do pagamento, o arquivo é gerado e enviado para o e-mail informado na compra, com um link para a página do pedido. O download é feito por um link temporário, que pode ser gerado de novo na página do pedido sempre que precisar. Se o e-mail não chegar em até uma hora, escreva para <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>.</p>

      <h2>4. Peças físicas</h2>
      <p>Pôsteres, quadros e camisetas são produzidos sob demanda por parceiros no Brasil, depois do pagamento, e enviados ao endereço informado. O prazo de produção e de entrega aparece antes do pagamento e é contado a partir da aprovação. Você recebe o código de rastreio por e-mail assim que a peça for postada.</p>

      <h2>5. Uso da arte</h2>
      <p>A compra dá a você o direito de uso pessoal da peça: imprimir o arquivo para a sua casa, usar como fundo de tela, presentear. Não estão incluídos a revenda, a reprodução comercial nem o uso em produtos de terceiros. Os direitos sobre o desenho continuam da {EMPRESA.marca}. Os dados de origem são públicos e citados na própria peça e na página <Link href="/metodo">Método</Link>.</p>

      <h2>6. Arrependimento, trocas e defeitos</h2>
      <p>Você pode desistir da compra em até 7 dias, com devolução integral do valor, e tem garantia contra defeitos. As regras completas estão em <Link href="/trocas">Trocas, devoluções e arrependimento</Link>.</p>

      <h2>7. Lista de novidades</h2>
      <p>A inscrição na lista é gratuita, depende do seu consentimento e serve só para avisar de novidades, aberturas de venda e acesso antecipado. Você pode sair a qualquer momento pedindo por e-mail.</p>

      <h2>8. Dados pessoais</h2>
      <p>O tratamento dos seus dados segue a <Link href="/privacidade">Política de privacidade</Link>.</p>

      <h2>9. Atendimento</h2>
      <p>Dúvidas, pedidos e reclamações: <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>. Respondemos em até 2 dias úteis. Estes termos seguem o Código de Defesa do Consumidor e o Decreto 7.962/2013.</p>
      <NavLegal />
    </article></div>
  );
}
