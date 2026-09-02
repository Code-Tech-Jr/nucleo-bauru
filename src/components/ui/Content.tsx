import { cn } from '@/lib/utils'
import type { PolymorphicProps } from '@/lib/types'

const BASE_CLASSES = 'flex w-11/12 items-center'

export default function Content({
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
