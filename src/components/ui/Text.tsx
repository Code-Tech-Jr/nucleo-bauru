import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { PolymorphicProps } from '@/lib/types'

export const textVariants = cva('text-body leading-relaxed font-semibold', {
  variants: {
    variant: {
      light: 'text-white', // seções com fundo escuro
      dark: 'text-black', // seções com fundo claro
    },
  },
  defaultVariants: {
    variant: 'dark',
  },
})

interface TextProps extends PolymorphicProps, VariantProps<typeof textVariants> {}

export default function Text({
  variant,
  as: Component = 'p',
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component className={cn(textVariants({ variant }), className)} {...props}>
      {children}
    </Component>
  )
}
