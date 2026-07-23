import type { ElementType } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { PolymorphicProps } from '@/lib/types'

const UPPERCASE_TITLE = 'uppercase tracking-wide'

export const headingVariants = cva('', {
  variants: {
    variant: {
      hero: 'text-[clamp(2.25rem,1.75rem+2.5vw,3.75rem)] font-bold text-white', // 4xl a 6xl
      section: `${UPPERCASE_TITLE} text-xl font-bold text-orange`,
      content: 'text-3xl font-semibold text-blue',
      news: `${UPPERCASE_TITLE} font-bold text-lg text-blue-light tracking-tighter`,
    },
  },
  defaultVariants: {
    variant: 'content',
  },
})

interface HeadingProps extends PolymorphicProps, VariantProps<typeof headingVariants> {}

const DEFAULT_TAG: Record<NonNullable<HeadingProps['variant']>, ElementType> = {
  hero: 'h1',
  section: 'h2',
  content: 'h3',
  news: 'h3',
}

export default function Heading({
  variant = 'content',
  as,
  className,
  children,
  ...props
}: HeadingProps) {
  const Component = as ?? DEFAULT_TAG[variant ?? 'content']

  return (
    <Component className={cn(headingVariants({ variant }), className)} {...props}>
      {children}
    </Component>
  )
}
