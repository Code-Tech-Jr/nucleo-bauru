// Caixa que recebe os contatos do site
export const EMAIL_NUCLEO = 'presidencia@nucleobauru.com.br'

export interface DadosContato {
  nome: string
  email: string
  assunto: string
  mensagem: string
}

// Opções do <select> do form: mexer aqui reflete direto na tela
export const ASSUNTOS = [
  'Quero fazer parte de uma EJ',
  'Quero contratar uma EJ',
  'Parceria com o Núcleo',
  'Imprensa',
  'Outro assunto',
] as const

function montarTitulo({ assunto, nome }: DadosContato) {
  return `[Site] ${assunto} — ${nome}`
}

function montarCorpo({ nome, email, assunto, mensagem }: DadosContato) {
  return [
    mensagem,
    '',
    '—',
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    `Assunto: ${assunto}`,
    'Enviado pelo formulário do site do Núcleo Bauru.',
  ].join('\n')
}

// encodeURIComponent no lugar de URLSearchParams de propósito: URLSearchParams
// codifica espaço como "+", e vários clientes de e-mail mostram o "+" literal
// no corpo do mailto em vez de espaço (RFC 6068 pede %20).
const cod = encodeURIComponent

// Abre o compose do Gmail no navegador já preenchido — a pessoa só confere e envia.
export function linkGmail(dados: DadosContato) {
  const query = [
    'view=cm',
    'fs=1',
    `to=${cod(EMAIL_NUCLEO)}`,
    `su=${cod(montarTitulo(dados))}`,
    `body=${cod(montarCorpo(dados))}`,
  ].join('&')

  return `https://mail.google.com/mail/?${query}`
}

// Fallback pra quem não usa Gmail: abre o app de e-mail padrão do sistema.
export function linkMailto(dados: DadosContato) {
  const query = `subject=${cod(montarTitulo(dados))}&body=${cod(montarCorpo(dados))}`

  return `mailto:${EMAIL_NUCLEO}?${query}`
}
