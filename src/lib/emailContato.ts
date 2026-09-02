import { EMAIL } from '@/lib/site'

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

type CampoContato = 'nome' | 'email' | 'assunto' | 'mensagem'

// Retorno da server action pro useActionState do form. O campo culpado viaja
// junto pro form marcar aria-invalid nele (WCAG 3.3.1): erro que não vem de
// validação (rate limit, Resend, consentimento) não tem campo pra apontar.
export type EstadoContato =
  | { status: 'inicial' }
  | { status: 'ok' }
  | { status: 'erro'; mensagem: string; campo?: CampoContato }

export const ESTADO_INICIAL: EstadoContato = { status: 'inicial' }

const LIMITES = { nome: 100, email: 254, mensagem: 5000 } as const

// mesma ordem dos campos na tela
const CAMPOS = ['nome', 'email', 'assunto', 'mensagem'] as const

// Validação simples só pra barrar lixo: o navegador já valida com required/type,
// mas a action é um endpoint POST público e pode receber qualquer coisa.
export function validarContato(
  dados: DadosContato
): { mensagem: string; campo?: CampoContato } | null {
  if (!dados.nome || !dados.email || !dados.assunto || !dados.mensagem) {
    // Aponta o primeiro vazio na ordem da tela: é o campo que a pessoa ia
    // preencher primeiro de qualquer jeito, e dá pra onde mandar o foco.
    return { mensagem: 'Preencha todos os campos.', campo: CAMPOS.find((c) => !dados[c]) }
  }
  // O nome vai pro assunto do e-mail: quebra de linha aqui é injeção de cabeçalho.
  if (/[\r\n]/.test(dados.nome)) {
    return { mensagem: 'Digite um nome válido.', campo: 'nome' }
  }
  // Barra ? & " ' < > além do básico: o e-mail vira href="mailto:..." no aviso
  // que a presidência recebe, e sem isso dá pra emendar ?subject=/?body= no link.
  if (!/^[^\s@"'<>?&]+@[^\s@"'<>?&]+\.[a-zA-Z]{2,}$/.test(dados.email)) {
    return { mensagem: 'Digite um e-mail válido.', campo: 'email' }
  }
  if (!ASSUNTOS.includes(dados.assunto as (typeof ASSUNTOS)[number])) {
    return { mensagem: 'Escolha um assunto da lista.', campo: 'assunto' }
  }
  const longo = (['nome', 'email', 'mensagem'] as const).find(
    (c) => dados[c].length > LIMITES[c]
  )
  if (longo) {
    return { mensagem: 'Mensagem longa demais — tente resumir.', campo: longo }
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

const cod = encodeURIComponent

const TETO_MAILTO = 1000

// Plano B quando o envio pelo Resend falha: abre o app de e-mail padrão do
// sistema já preenchido, pra pessoa não perder o que escreveu. Só o mailto é
// truncado — o que o Resend envia leva a mensagem inteira.
export function linkMailto(dados: DadosContato) {
  const mensagem =
    dados.mensagem.length > TETO_MAILTO
      ? `${dados.mensagem.slice(0, TETO_MAILTO)}\n\n[MENSAGEM CORTADA AQUI — o link de e-mail não comporta o texto inteiro. Copie o restante do formulário antes de enviar.]`
      : dados.mensagem

  const texto = montarTexto({ ...dados, mensagem })
  const query = `subject=${cod(montarTitulo(dados))}&body=${cod(texto)}`

  return `mailto:${EMAIL}?${query}`
}
