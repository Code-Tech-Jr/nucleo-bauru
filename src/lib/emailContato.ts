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

// Retorno da server action pro useActionState do form
export type EstadoContato =
  { status: 'inicial' } | { status: 'ok' } | { status: 'erro'; mensagem: string }

export const ESTADO_INICIAL: EstadoContato = { status: 'inicial' }

const LIMITES = { nome: 100, email: 254, mensagem: 5000 } as const

// Validação simples só pra barrar lixo: o navegador já valida com required/type,
// mas a action é um endpoint POST público e pode receber qualquer coisa.
export function validarContato(dados: DadosContato): string | null {
  if (!dados.nome || !dados.email || !dados.assunto || !dados.mensagem) {
    return 'Preencha todos os campos.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    return 'Digite um e-mail válido.'
  }
  if (!ASSUNTOS.includes(dados.assunto as (typeof ASSUNTOS)[number])) {
    return 'Escolha um assunto da lista.'
  }
  if (
    dados.nome.length > LIMITES.nome ||
    dados.email.length > LIMITES.email ||
    dados.mensagem.length > LIMITES.mensagem
  ) {
    return 'Mensagem longa demais — tente resumir.'
  }
  return null
}

export function montarTitulo({ assunto, nome }: DadosContato) {
  return `${assunto} — ${nome}`
}

// Versão em texto puro: é o que aparece em cliente de e-mail que não abre HTML
// e o que vai no mailto de fallback. Mesmas informações da versão HTML.
export function montarTexto({ nome, email, assunto, mensagem }: DadosContato) {
  return [
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    `Assunto: ${assunto}`,
    '',
    'Mensagem:',
    mensagem,
    '',
    'Enviado pelo formulário de contato do site do Núcleo Bauru.',
    `Para responder, escreva direto para ${email}.`,
  ].join('\n')
}

// encodeURIComponent no lugar de URLSearchParams de propósito: URLSearchParams
// codifica espaço como "+", e vários clientes de e-mail mostram o "+" literal
// no corpo do mailto em vez de espaço (RFC 6068 pede %20).
const cod = encodeURIComponent

// Plano B quando o envio pelo Resend falha: abre o app de e-mail padrão do
// sistema já preenchido, pra pessoa não perder o que escreveu.
export function linkMailto(dados: DadosContato) {
  const query = `subject=${cod(montarTitulo(dados))}&body=${cod(montarTexto(dados))}`

  return `mailto:${EMAIL_NUCLEO}?${query}`
}
