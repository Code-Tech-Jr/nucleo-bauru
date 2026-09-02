'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import {
  montarTexto,
  montarTitulo,
  validarContato,
  type DadosContato,
  type EstadoContato,
} from '@/lib/emailContato'
import { montarHtml } from '@/lib/emailContatoHtml'
import { EMAIL } from '@/lib/site'

// Remetente precisa ser de um domínio verificado no Resend. Enquanto o domínio
// do Núcleo não estiver verificado, dá pra usar o onboarding@resend.dev (só
// entrega pro e-mail dono da conta Resend, serve pra testar).
// TODO(resend): valores vêm do .env.local (local) e do painel da Vercel (produção).
// Sem CONTATO_EMAIL_FROM cai no onboarding@resend.dev, que só entrega pro dono da conta.
// || e não ??: a env pode vir definida e vazia (""), que passa pelo ?? e
// deixaria remetente/destino em branco — aí o Resend recusa o envio.
const REMETENTE = process.env.CONTATO_EMAIL_FROM || 'onboarding@resend.dev'
const DESTINO = process.env.CONTATO_EMAIL_TO || EMAIL

const ERRO_GENERICO = 'Não conseguimos enviar sua mensagem agora.'

// FormData também aceita File: sem checar o tipo, um arquivo postado no campo
// vira a string "[object File]" e passa por toda a validação.
const txt = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '')

const ultimoPorIp = new Map<string, number>()
let recentes: number[] = []

function bloqueado(ip: string) {
  const agora = Date.now()
  recentes = recentes.filter((t) => agora - t < 3_600_000)
  if (recentes.length >= 20) return true // teto global: 20 envios/h por instância
  const anterior = ultimoPorIp.get(ip)
  if (anterior && agora - anterior < 60_000) return true // 1 envio/min por IP
  if (ultimoPorIp.size > 1000) ultimoPorIp.clear()
  ultimoPorIp.set(ip, agora)
  recentes.push(agora)
  return false
}

export async function enviarContato(
  _anterior: EstadoContato,
  formData: FormData
): Promise<EstadoContato> {
  if (formData.get('confirme_url_hp')) {
    console.warn('[contato] honeypot acionado')
    return { status: 'ok' }
  }
  if (!formData.get('consentimento')) {
    return {
      status: 'erro',
      mensagem: 'É preciso concordar com o uso dos seus dados para enviar.',
    }
  }

  const dados: DadosContato = {
    nome: txt(formData.get('nome')),
    email: txt(formData.get('email')),
    assunto: txt(formData.get('assunto')),
    mensagem: txt(formData.get('mensagem')),
  }

  const erro = validarContato(dados)
  if (erro) return { status: 'erro', ...erro }

  const cabecalhos = await headers()
  const ip =
    cabecalhos.get('x-vercel-forwarded-for') ??
    cabecalhos.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'sem-ip'
  if (bloqueado(ip)) {
    return {
      status: 'erro',
      mensagem: 'Muitas mensagens seguidas. Tente de novo em alguns minutos.',
    }
  }

  // TODO(resend): sem essa chave o formulário só mostra o erro genérico
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contato] RESEND_API_KEY não configurada')
    return { status: 'erro', mensagem: ERRO_GENERICO }
  }

  try {
    const envio = new Resend(apiKey).emails.send({
      from: REMETENTE,
      to: DESTINO,
      replyTo: dados.email,
      subject: montarTitulo(dados),
      html: montarHtml(dados),
      text: montarTexto(dados),
    })

    const { error } = await Promise.race([
      envio,
      new Promise<never>((_, rejeita) =>
        setTimeout(() => rejeita(new Error('Resend não respondeu em 8s')), 8_000)
      ),
    ])

    if (error) {
      console.error('[contato] Resend recusou o envio:', error)
      return { status: 'erro', mensagem: ERRO_GENERICO }
    }
  } catch (e) {
    console.error('[contato] falha ao chamar o Resend:', e)
    return { status: 'erro', mensagem: ERRO_GENERICO }
  }

  return { status: 'ok' }
}
