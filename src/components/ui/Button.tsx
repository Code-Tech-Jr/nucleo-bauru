import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

const PILL_BASE = 'rounded-lg border-1 border-transparent px-4 py-3 font-semibold md:px-5'

//Variants
// outline - Borda branca fundo transparente
// light - Fundo branco escrita em azul
// solid - fundo laranja escrita em branco

//active é apenas para quem for fazer o header, mas como o default é false nao precisa setar
export const buttonVariants = cva(
  'text-btn inline-flex items-center justify-center gap-2 cursor-pointer transition-all ease-in-out select-none active:opacity-80 duration-500',
  {
    variants: {
      variant: {
        header:
          'text-white font-semibold border-b-5 border-transparent px-1 duration-400 lg:hover:border-orange lg:hover:pb-3',
        footer: 'text-white font-semibold hover:text-orange duration-200',
        outline: `${PILL_BASE} border-white bg-transparent text-white hover:bg-white hover:text-blue`,
        light: `${PILL_BASE} bg-white text-blue hover:bg-blue hover:text-white`,
        solid: `${PILL_BASE} bg-orange text-white hover:bg-white hover:text-orange`,
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'header',
        active: true,
        class: 'lg:border-orange lg:pb-3',
      },
    ],
    defaultVariants: {
      variant: 'header',
      active: false,
    },
  }
)

// Caso o botão tenha a setinha use o atributo showArrow sendo true que ja ira aparecer
interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  showArrow?: boolean
  children: ReactNode
}

export default function Button({
  variant,
  active,
  showArrow,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, active }), className)} {...props}>
      {children}
      {showArrow && <ArrowRight className="size-5" strokeWidth={3} />}
    </button>
  )
}
