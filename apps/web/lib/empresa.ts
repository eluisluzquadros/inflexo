// Identificação do vendedor (Decreto 7.962/2013, art. 2º): um lugar só, usado pelo rodapé e pelas páginas legais.
// ENDERECO fica null até o dono informar o endereço físico da empresa; enquanto for null as páginas mostram o aviso.
export const EMPRESA = {
  marca: 'INFLEXO',
  razaoSocial: 'Habitat Software Engineering LTDA',
  nomeFantasia: 'Habitat',
  cnpj: '07.525.183/0001-08',
  email: 'pedidos@inflexo.com.br',
  endereco: null as string | null,
  site: 'https://inflexo.com.br',
  atualizadoEm: '18/11/2026',
} as const;
