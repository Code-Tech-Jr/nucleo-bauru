'use client'

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import Heading from '@/components/ui/Heading'
import { ASSUNTOS, linkGmail, linkMailto, type DadosContato } from '@/lib/emailContato'
import { cn } from '@/lib/utils'

const VAZIO: DadosContato = { nome: '', email: '', assunto: '', mensagem: '' }

const CAMPO =
  'w-full rounded-md bg-gray-300 px-4 py-3 text-blue placeholder:text-gray-600 focus:outline-2 focus:outline-orange'

function Rotulo({ campo, children }: { campo: string; children: ReactNode }) {
  return (
    <label htmlFor={campo} className="text-sm font-bold text-blue">
      {children}
      <span className="text-orange">*</span>
    </label>
  )
}

export default function FormContato() {
  const [dados, setDados] = useState<DadosContato>(VAZIO)
  const [aberto, setAberto] = useState(false)

  function atualizar(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setDados((atual) => ({ ...atual, [name]: value }))
  }

  function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // o window.open tem que sair dentro do gesto do clique, senão o bloqueador de pop-up barra
    window.open(linkGmail(dados), '_blank', 'noopener,noreferrer')
    setAberto(true)
  }

  return (
    // mobile: tudo numa coluna só. lg: dados de contato à esquerda, mensagem à direita
    <form
      onSubmit={aoEnviar}
      className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8"
    >
      <Heading variant="section" className="lg:col-span-2">
        Entre em contato
      </Heading>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Rotulo campo="nome">Nome:</Rotulo>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            value={dados.nome}
            onChange={atualizar}
            placeholder="Digite seu nome..."
            className={CAMPO}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Rotulo campo="email">E-mail:</Rotulo>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={dados.email}
            onChange={atualizar}
            placeholder="Digite seu email..."
            className={CAMPO}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Rotulo campo="assunto">Assunto:</Rotulo>
          <div className="relative">
            <select
              id="assunto"
              name="assunto"
              required
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
          <Rotulo campo="mensagem">Mensagem:</Rotulo>
          <textarea
            id="mensagem"
            name="mensagem"
            required
            rows={5}
            value={dados.mensagem}
            onChange={atualizar}
            placeholder="Digite sua mensagem aqui..."
            className={cn(CAMPO, 'flex-1 resize-y')}
          />
        </div>

        {/* consentimento é só trava de UI: nada sai daqui sem a pessoa enviar pelo Gmail */}
        <label className="flex items-start gap-2 text-xs text-blue">
          <input
            type="checkbox"
            name="consentimento"
            required
            className="mt-0.5 size-4 shrink-0 accent-orange"
          />
          <span>
            Concordo com a Política de Privacidade e uso dos meus dados para responder a
            esse contato.
          </span>
        </label>

        {/* hover padrão do solid deixa o botão branco, e o card também é branco */}
        <Button
          type="submit"
          variant="solid"
          className="w-full hover:bg-orange/90 hover:text-white"
        >
          Enviar
        </Button>

        {aberto && (
          <p aria-live="polite" className="text-xs text-blue">
            Abrimos o Gmail com sua mensagem pronta — é só clicar em Enviar por lá. Não
            abriu?{' '}
            <a href={linkMailto(dados)} className="font-bold text-orange underline">
              Abrir no seu app de e-mail
            </a>
            .
          </p>
        )}
      </div>
    </form>
  )
}
