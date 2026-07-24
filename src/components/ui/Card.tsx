import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PolymorphicProps } from '@/lib/types'
import Heading from './Heading'
import Text from './Text'

interface CardProps extends Omit<PolymorphicProps, 'children'> {
  icon?: LucideIcon
  title: string
  description: string
}

const BASE_CLASSES =
  'flex flex-col items-start gap-4 rounded-xl border border-blue/10 bg-white p-6 shadow-sm w-full'

export default function Card({
  icon: Icon,
  title,
  description,
  as: Component = 'div',
  className,
  ...props
}: CardProps) {
  return (
    <Component className={cn(BASE_CLASSES, className)} {...props}>
      {Icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange/10 text-orange">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <Heading variant="content" className="text-xl text-blue uppercase">
        {title}
      </Heading>
      <Text variant="dark">{description}</Text>
    </Component>
  )
}
