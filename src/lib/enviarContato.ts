'use server'

import { Resend } from 'resend'
import {
  EMAIL_NUCLEO,
  montarTexto,
  montarTitulo,
  validarContato,
  type DadosContato,
  type EstadoContato,
} from '@/lib/emailContato'
import { montarHtml } from '@/lib/emailContatoHtml'

// Remetente precisa ser de um domínio verificado no Resend. Enquanto o domínio
// do Núcleo não estiver verificado, dá pra usar o onboarding@resend.dev (só
// entrega pro e-mail dono da conta Resend, serve pra testar).
const REMETENTE = process.env.CONTATO_EMAIL_FROM ?? 'onboarding@resend.dev'
const DESTINO = process.env.CONTATO_EMAIL_TO ?? EMAIL_NUCLEO

const ERRO_GENERICO = 'Não conseguimos enviar sua mensagem agora.'

export async function enviarContato(
  _anterior: EstadoContato,
  formData: FormData
): Promise<EstadoContato> {
  // Campo escondido no CSS: humano nunca preenche, bot que preenche formulário
  // inteiro sim. Fingimos sucesso pra ele não tentar de novo.
  if (formData.get('site')) return { status: 'ok' }

  const dados: DadosContato = {
    nome: String(formData.get('nome') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    assunto: String(formData.get('assunto') ?? '').trim(),
    mensagem: String(formData.get('mensagem') ?? '').trim(),
  }

  const erro = validarContato(dados)
  if (erro) return { status: 'erro', mensagem: erro }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contato] RESEND_API_KEY não configurada')
    return { status: 'erro', mensagem: ERRO_GENERICO }
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: REMETENTE,
      to: DESTINO,
      // responder no cliente de e-mail já vai direto pra pessoa que escreveu
      replyTo: dados.email,
      subject: montarTitulo(dados),
      html: montarHtml(dados),
      // acompanha o HTML: é o que aparece em quem lê e-mail em texto puro e
      // ajuda a não cair em spam
      text: montarTexto(dados),
    })

    if (error) {
      // detalhe do erro fica só no log do servidor: a mensagem da API pode
      // vazar configuração (domínio, chave) pra tela de quem preencheu
      console.error('[contato] Resend recusou o envio:', error)
      return { status: 'erro', mensagem: ERRO_GENERICO }
    }
  } catch (e) {
    console.error('[contato] falha ao chamar o Resend:', e)
    return { status: 'erro', mensagem: ERRO_GENERICO }
  }

  return { status: 'ok' }
}
