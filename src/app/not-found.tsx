import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'

export const metadata: Metadata = {
  title: 'Página não encontrada',
}

// Sem este arquivo o Next mostra o 404 dele, em inglês, num documento lang="pt-BR".
export default function NaoEncontrada() {
  return (
    <Container as="section" className="flex-1 py-16">
      <Content className="max-w-[900px] flex-col items-start gap-4">
        <Heading as="h1" variant="content">
          Página não encontrada
        </Heading>
        <Text variant="dark">O endereço que você acessou não existe ou saiu do ar.</Text>
        <Button href="/" variant="solid" showArrow>
          Voltar para o início
        </Button>
      </Content>
    </Container>
  )
}
