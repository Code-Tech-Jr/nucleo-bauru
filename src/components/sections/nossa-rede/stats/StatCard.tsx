'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StatCard({
  valor,
  sufixo = '',
  rotulo,
  icone,
  className,
}: {
  valor: number
  sufixo?: string
  rotulo: string
  icone?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLLIElement>(null)
  const emVista = useInView(ref, { once: true })
  const reduzirMovimento = useReducedMotion()

  const valorAnimado = useMotionValue(valor)
  const valorExibido = useTransform(valorAnimado, (v) => Math.round(v))

  useEffect(() => {
    if (!emVista) return

    if (reduzirMovimento) {
      valorAnimado.set(valor)
      return
    }

    const controles = animate(valorAnimado, [0, valor], {
      duration: 1.5,
      ease: 'easeOut',
    })

    return () => controles.stop()
  }, [emVista, reduzirMovimento, valor, valorAnimado])

  return (
    <li
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-8 text-center shadow-card',
        className
      )}
    >
      <span className="flex items-center justify-center text-blue">
        {icone ?? <Rocket className="size-8" strokeWidth={2} />}
      </span>

      <span className="text-8xl font-extrabold text-blue tabular-nums">
        <motion.span>{valorExibido}</motion.span>
        {sufixo}
      </span>

      <span className="text-sm font-bold tracking-wide text-blue/80 uppercase">
        {rotulo}
      </span>
    </li>
  )
}
