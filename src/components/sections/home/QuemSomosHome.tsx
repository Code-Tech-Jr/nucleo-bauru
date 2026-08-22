import Image from 'next/image'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'

export default function QuemSomosHome() {
  return (
    <Container
      as="section"
      aria-labelledby="titulo-quem-somos"
      className="py-16 lg:py-20"
    >
      <Content className="flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="flex w-full flex-col gap-6 lg:max-w-md">
          <Heading variant="section" id="titulo-quem-somos">
            Quem somos
          </Heading>

          <Heading variant="content">
            A força que desenvolve o Movimento Empresa Júnior no Oeste Paulista.
          </Heading>

          <Text variant="dark" className="text-justify">
            Nascemos para fortalecer o MEJ no Oeste Paulista. Conectamos pessoas,
            desenvolvemos lideranças e impulsionamos Empresas Juniores, gerando impacto
            dentro das universidades.
          </Text>

          <Button href="/sobre-nos" variant="light" showArrow className="self-start">
            Saiba mais
          </Button>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-card lg:max-w-xl">
          <Image
            src="/images/quem_somos.jpeg"
            alt="Membros do Núcleo Bauru em um encontro presencial"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </Content>
    </Container>
  )
}
