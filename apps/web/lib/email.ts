import 'server-only';

// E-mail transacional pelo Resend. O remetente vem de EMAIL_REMETENTE; sem domínio verificado no Resend,
// só "onboarding@resend.dev" funciona e só entrega na caixa do dono da conta (e nos endereços de teste).
// A chave de idempotência faz o Resend descartar um reenvio do mesmo e-mail em 24 h; o pedido também
// guarda email_enviado_em, então a fila não manda duas vezes.

export type Email = { para: string; assunto: string; texto: string; html: string; idempotencia: string };

export async function enviarEmail(m: Email): Promise<string> {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) throw new Error('Resend não configurado (RESEND_API_KEY)');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json', 'Idempotency-Key': m.idempotencia },
    body: JSON.stringify({
      from: process.env.EMAIL_REMETENTE || 'INFLEXO <onboarding@resend.dev>',
      to: [m.para], subject: m.assunto, text: m.texto, html: m.html,
    }),
  });
  const corpo = await r.text();
  if (!r.ok) throw new Error(`Resend ${r.status}: ${corpo.slice(0, 200)}`);
  return (JSON.parse(corpo) as { id: string }).id;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** E-mail de entrega do arquivo digital. Voz do PRODUCT.md: sóbria, exata, sem exclamação. */
export function emailEntregaDigital(p: { codigo: string; peca: string; detalhe: string; link: string }): Omit<Email, 'para' | 'idempotencia'> {
  const assunto = `Seu arquivo INFLEXO está pronto · pedido ${p.codigo}`;
  const texto = [
    'Pagamento confirmado. Seu arquivo está pronto.',
    '',
    `${p.peca}`,
    `${p.detalhe}`,
    '',
    `Baixe pela página do pedido: ${p.link}`,
    '',
    'O link é pessoal. O download fica disponível enquanto o pedido estiver ativo.',
    'Fonte dos dados: TSE, dados abertos.',
    '',
    'INFLEXO',
  ].join('\n');
  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#F3EEE3;color:#141414;font-family:Georgia,serif">
<div style="max-width:520px;margin:0 auto;padding:40px 24px">
<p style="font-size:13px;letter-spacing:.2em;margin:0 0 32px">INFLEXO</p>
<p style="font-size:22px;margin:0 0 24px">Pagamento confirmado. Seu arquivo está pronto.</p>
<p style="font-size:16px;margin:0">${esc(p.peca)}</p>
<p style="font-size:14px;color:#7A756C;margin:4px 0 32px">${esc(p.detalhe)}</p>
<p style="margin:0 0 32px"><a href="${esc(p.link)}" style="display:inline-block;background:#141414;color:#F3EEE3;text-decoration:none;padding:12px 20px;font-size:15px">Baixar o arquivo</a></p>
<p style="font-size:13px;color:#7A756C;margin:0 0 8px">O link é pessoal. O download fica disponível enquanto o pedido estiver ativo.</p>
<p style="font-size:13px;color:#7A756C;margin:0">Fonte dos dados: TSE, dados abertos. Pedido ${esc(p.codigo)}.</p>
</div></body></html>`;
  return { assunto, texto, html };
}
