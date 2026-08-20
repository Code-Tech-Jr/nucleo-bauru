import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import FormContato from '@/components/forms/FormContato'
import CardParceiro from './CardParceiro'
import { cn } from '@/lib/utils'

const CARD = 'rounded-3xl border border-blue bg-white p-6 sm:p-8 lg:p-10'

export default function Contato() {
  return (
    <Container as="section" aria-labelledby="titulo-contato" className="py-12 lg:py-16">
      <Content className="flex-col items-stretch gap-6 lg:flex-row lg:gap-8">
        <CardParceiro className={cn(CARD, 'lg:w-[30%] lg:shrink-0')} />

        <div className={cn(CARD, 'lg:flex-1')}>
          <FormContato />
        </div>
      </Content>
    </Container>
  )
}
