import type { ElementType, ReactNode } from 'react'

// Forma compartilhada pelos componentes de ui/ que trocam de tag via prop `as`
// (Container, Heading, Text, e o que vier depois no mesmo padrão)
export interface PolymorphicProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType
  children: ReactNode
}
