'use client'

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import Heading from '@/components/ui/Heading'
import {
  ASSUNTOS,
  ESTADO_INICIAL,
  linkMailto,
  type DadosContato,
  type EstadoContato,
} from '@/lib/emailContato'
import { enviarContato } from '@/lib/enviarContato'
import { cn } from '@/lib/utils'

const VAZIO: DadosContato = { nome: '', email: '', assunto: '', mensagem: '' }

const CAMPO =
  'w-full rounded-md bg-gray-300 px-4 py-3 text-blue placeholder:text-gray-600 focus:outline-2 focus:outline-orange'

// id do aviso: os campos recusados pela action apontam pra ele com aria-describedby
const ID_AVISO = 'contato-aviso'

const CHAVE_ENVIO = 'contato:ultimo-envio'
const COOLDOWN_MS = 5 * 60 * 1000

// só minutos: o texto fica dentro de uma live region, e mostrar segundos faria o
// leitor de tela reanunciar o aviso a cada tique
function contagem(restante: number) {
  const minutos = Math.ceil(restante / 60_000)

  return minutos > 1 ? `${minutos} minutos` : 'menos de 1 minuto'
}

// marca só o campo que a action recusou e liga ele ao texto do aviso, em vez de
// repetir o par aria-invalid/aria-describedby nos quatro inputs (WCAG 3.3.1)
function erroDoCampo(estado: EstadoContato, campo: keyof DadosContato) {
  if (estado.status !== 'erro' || estado.campo !== campo) return null

  return { 'aria-invalid': true, 'aria-describedby': ID_AVISO } as const
}

function Rotulo({ campo, children }: { campo: string; children: ReactNode }) {
  return (
    <label htmlFor={campo} className="text-sm font-bold text-blue">
      {children}

      <span aria-hidden className="text-orange">
        *
      </span>
    </label>
  )
}

export default function FormContato() {
  const [dados, setDados] = useState<DadosContato>(VAZIO)
  const [aceite, setAceite] = useState(false)
  const [estado, acao, enviando] = useActionState(enviarContato, ESTADO_INICIAL)
  const [ultimoEstado, setUltimoEstado] = useState(estado)

  const [restante, setRestante] = useState(0)
  const avisoRef = useRef<HTMLParagraphElement>(null)
  const aceiteRef = useRef<HTMLInputElement>(null)

  if (estado !== ultimoEstado) {
    setUltimoEstado(estado)
    if (estado.status === 'ok') {
      setDados(VAZIO)
      setAceite(false)
    }
  }

  useEffect(() => {
    if (estado.status === 'inicial') return
    avisoRef.current?.focus()

    if (aceiteRef.current) aceiteRef.current.checked = aceite
  }, [estado, aceite])

  // guarda o instante do envio e mantém a contagem viva. o localStorage faz o
  // bloqueio sobreviver ao F5, e o tique de 1s derruba o bloqueio sozinho quando
  // os 5 minutos acabam, sem precisar recarregar a página
  useEffect(() => {
    if (estado.status === 'ok') localStorage.setItem(CHAVE_ENVIO, String(Date.now()))

    function tique() {
      const envio = Number(localStorage.getItem(CHAVE_ENVIO))
      setRestante(Math.max(0, envio + COOLDOWN_MS - Date.now()))
    }

    tique()
    const id = setInterval(tique, 1000)

    return () => clearInterval(id)
  }, [estado])

  function atualizar(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setDados((atual) => ({ ...atual, [name]: value }))
  }

  return (
    // mobile: tudo numa coluna só. lg: dados de contato à esquerda, mensagem à direita
    <form
      action={acao}
      aria-labelledby="titulo-contato"

      onSubmit={(e) => {
        if (!enviando && restante <= 0) return
        e.preventDefault()

        avisoRef.current?.focus()
      }}
      className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8"
    >
      <Heading id="titulo-contato" variant="section" className="lg:col-span-2">
        Entre em contato
      </Heading>

      <p className="sr-only">Campos marcados com asterisco são obrigatórios.</p>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Rotulo campo="contato-nome">Nome:</Rotulo>
          <input
            id="contato-nome"
            name="nome"
            type="text"
            required
            autoComplete="name"
            {...erroDoCampo(estado, 'nome')}
            value={dados.nome}
            onChange={atualizar}
            placeholder="Digite seu nome..."
            className={CAMPO}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Rotulo campo="contato-email">E-mail:</Rotulo>
          <input
            id="contato-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            {...erroDoCampo(estado, 'email')}
            value={dados.email}
            onChange={atualizar}
            placeholder="Digite seu email..."
            className={CAMPO}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Rotulo campo="contato-assunto">Assunto:</Rotulo>
          <div className="relative">
            <select
              id="contato-assunto"
              name="assunto"
              required
              {...erroDoCampo(estado, 'assunto')}
              value={dados.assunto}
              onChange={atualizar}
              // sem opção escolhida o texto fica cinza, igual placeholder dos outros campos
              className={cn(
                CAMPO,
                'appearance-none pr-12',
                !dados.assunto && 'text-gray-600'
              )}
            >
              <option value="" disabled>
                Escolha o assunto
              </option>
              {ASSUNTOS.map((assunto) => (
                <option key={assunto} value={assunto} className="text-blue">
                  {assunto}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-blue"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Rotulo campo="contato-mensagem">Mensagem:</Rotulo>
          <textarea
            id="contato-mensagem"
            name="mensagem"
            required
            {...erroDoCampo(estado, 'mensagem')}
            rows={5}
            value={dados.mensagem}
            onChange={atualizar}
            placeholder="Digite sua mensagem aqui..."
            className={cn(CAMPO, 'flex-1 resize-y')}
          />
        </div>

        <input
          type="text"
          name="confirme_url_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />

        <label className="flex items-start gap-2 text-xs text-blue">
          <input
            ref={aceiteRef}
            type="checkbox"
            name="consentimento"
            required
            checked={aceite}
            onChange={(e) => setAceite(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-orange"
          />
          <span>
            Concordo com a{' '}
            <Link href="/politica-de-privacidade" className="font-bold underline">
              Política de Privacidade
            </Link>{' '}
            e uso dos meus dados para responder a esse contato.
          </span>
        </label>

        <Button
          type="submit"
          variant="solid"
          aria-disabled={enviando || restante > 0}
          className="w-full hover:bg-orange/90 hover:text-white aria-disabled:cursor-progress aria-disabled:opacity-70"
        >
          {enviando ? 'Enviando...' : 'Enviar'}
        </Button>

        <p
          ref={avisoRef}
          id={ID_AVISO}
          role="status"
          aria-live="polite"
          tabIndex={-1}
          className="text-xs text-blue empty:absolute"
        >
          {restante > 0 &&
            (estado.status === 'ok'
              ? `Mensagem enviada! Vamos responder no e-mail que você informou. Você poderá enviar outra em ${contagem(restante)}.`
              : `Você já enviou uma mensagem. Aguarde ${contagem(restante)} para enviar outra.`)}
          {restante <= 0 &&
            estado.status === 'ok' &&
            'Mensagem enviada! Vamos responder no e-mail que você informou.'}
          {restante <= 0 && estado.status === 'erro' && (
            <>
              {estado.mensagem}{' '}
              <a href={linkMailto(dados)} className="font-bold text-orange underline">
                Enviar pelo seu app de e-mail
              </a>
              .
            </>
          )}
        </p>
      </div>
    </form>
  )
}
