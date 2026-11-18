import type { Metadata } from 'next';
import { EMPRESA } from '../../lib/empresa';
import { Identificacao, NavLegal } from '../legal';

export const metadata: Metadata = { title: 'Política de privacidade', description: 'Quais dados a INFLEXO coleta, para quê, com quem compartilha e como exercer seus direitos (LGPD).' };

const DADOS = [
  ['Lista de novidades', 'E-mail e o registro do seu consentimento', 'Avisar de novidades, abertura de venda e acesso antecipado', 'Consentimento'],
  ['Compra', 'Nome, e-mail, telefone e, nas peças físicas, endereço de entrega', 'Processar o pagamento, entregar o pedido, enviar o arquivo e o rastreio, atender você', 'Execução do contrato'],
  ['Pagamento', 'Dados do cartão ou do Pix', 'Cobrança, tratada só pela Stripe; não recebemos nem guardamos o número do cartão', 'Execução do contrato'],
  ['Nota fiscal e obrigações legais', 'Dados da compra exigidos pela legislação fiscal', 'Emitir nota e guardar registros pelo prazo legal', 'Obrigação legal'],
];

const OPERADORES = [
  ['Stripe', 'pagamento'],
  ['Supabase', 'banco de dados e armazenamento dos arquivos dos pedidos'],
  ['Resend', 'envio de e-mails'],
  ['Render', 'hospedagem do site'],
  ['Cloudflare', 'domínio e proteção do site'],
  ['Parceiros de produção e transportadoras', 'nome e endereço, só nas peças físicas, para produzir e entregar'],
];

export default function Privacidade() {
  return (
    <div className="pagina"><article className="metodo legal">
      <h1>Política de privacidade</h1>
      <p className="legal-data">Atualizado em {EMPRESA.atualizadoEm}.</p>
      <Identificacao />
      <p>Esta política explica como tratamos dados pessoais, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018). A controladora dos dados é a {EMPRESA.razaoSocial}.</p>

      <h2>Quais dados e para quê</h2>
      <div className="legal-tabela">
        <table>
          <thead><tr><th>Quando</th><th>Dados</th><th>Para quê</th><th>Base legal</th></tr></thead>
          <tbody>{DADOS.map((d) => <tr key={d[0]}>{d.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <p>Não vendemos dados, não usamos para publicidade de terceiros e não criamos perfis. O site não usa cookies de rastreamento nem ferramentas de publicidade.</p>

      <h2>Com quem compartilhamos</h2>
      <p>Só com empresas que operam o serviço para nós, na medida do necessário:</p>
      <ul>{OPERADORES.map(([n, f]) => <li key={n}><strong>{n}:</strong> {f}.</li>)}</ul>
      <p>Alguns desses serviços guardam dados fora do Brasil, com as garantias previstas na LGPD para transferência internacional.</p>

      <h2>Por quanto tempo</h2>
      <p>Os dados da lista ficam até você pedir para sair. Os dados de compra ficam pelo prazo exigido pela legislação fiscal e de defesa do consumidor; depois são apagados.</p>

      <h2>Seus direitos</h2>
      <p>Você pode pedir a qualquer momento: confirmação de que tratamos seus dados, acesso, correção, exclusão, portabilidade, informação sobre compartilhamento e revogação do consentimento. Escreva para <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>; respondemos em até 15 dias. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</p>

      <h2>Segurança</h2>
      <p>Os arquivos dos pedidos ficam em armazenamento privado e só são baixados por link temporário. O acesso aos dados é restrito a quem opera a loja.</p>
      <NavLegal />
    </article></div>
  );
}
