'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { EMAIL } from '@/lib/site'

export default function HeaderMobile({ links }: { links: ReactNode }) {
  const [open, setOpen] = useState(false)
  const gatilhoRef = useRef<HTMLButtonElement>(null)
  const fecharRef = useRef<HTMLButtonElement>(null)

  // Com o menu aberto: fecha no Esc, fecha ao virar desktop, trava o scroll da
  // página e move o foco para o botão de fechar
  useEffect(() => {
    if (!open) return

    function aoTeclar(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    const mq = window.matchMedia('(min-width: 64rem)') // lg do Tailwind v4
    const fecharSeDesktop = () => setOpen(false)
    const gatilho = gatilhoRef.current

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', aoTeclar)
    mq.addEventListener('change', fecharSeDesktop)
    fecharRef.current?.focus()

    return () => {
      document.body.style.overflow = overflowAnterior
      document.removeEventListener('keydown', aoTeclar)
      mq.removeEventListener('change', fecharSeDesktop)
      // só devolve o foco se o gatilho ainda estiver na página (não roubar no desmonte)
      if (gatilho?.isConnected) gatilho.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={gatilhoRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="cursor-pointer text-white lg:hidden"
      >
        <Menu className="size-8" />
      </button>

      {/* Fundo escurecido do menu mobile */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        id="menu-mobile"
        aria-label="Menu de navegação"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80%] flex-col gap-8 bg-blue p-6 transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          ref={fecharRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
          className="cursor-pointer self-end text-white"
        >
          <X className="size-8" />
        </button>

        {/* Clicar em qualquer link fecha o menu */}
        <ul onClick={() => setOpen(false)} className="flex flex-col items-start gap-6">
          {links}
        </ul>

        <Button href={`mailto:${EMAIL}`} variant="solid" showArrow className="self-start">
          Fale conosco
        </Button>
      </div>
    </>
  )
}
