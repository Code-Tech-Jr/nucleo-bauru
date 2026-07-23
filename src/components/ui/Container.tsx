import { cn } from '@/lib/utils'
import type { PolymorphicProps } from '@/lib/types'

const BASE_CLASSES = 'flex w-full items-center justify-center'

export default function Container({
  children,
  as: Component = 'div',
  className,
  ...props
}: PolymorphicProps) {
  return (
    <Component className={cn(BASE_CLASSES, className)} {...props}>
      {children}
    </Component>
  )
}
