'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function HeaderMobile({ links }: { links: ReactNode }) {
  const [open, setOpen] = useState(false)

  // Com o menu aberto: fecha no Esc e trava o scroll da página
  useEffect(() => {
    if (!open) return

    function aoTeclar(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', aoTeclar)

    return () => {
      document.body.style.overflow = overflowAnterior
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [open])

  return (
    <>
      <button
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
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80%] flex-col gap-8 bg-blue p-6 transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
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

        <Button href="/contato" variant="solid" showArrow className="self-start">
          Fale conosco
        </Button>
      </div>
    </>
  )
}
