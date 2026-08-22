import Image from 'next/image'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'

export default function Hero() {
  return (
    <Container
      as="section"
      id="inicio"
      className="relative overflow-hidden bg-blue py-14 md:py-20 lg:py-24"
    >
      {/* Foto de fundo só a partir do tablet como no design original */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/banner_home.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* leve degradê do azul da marca pra manter o texto legível para a foto */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue via-blue/70 to-transparent" />
      </div>

      <Content className="relative flex-col gap-10 md:flex-row md:items-center md:justify-between lg:min-h-[560px]">
        <div className="flex w-full max-w-xl flex-col gap-6">
          <Heading variant="hero">
            Somos o time que transforma impacto em{' '}
            <span className="text-orange">legado</span>
          </Heading>

          <Text variant="light" className="text-justify md:max-w-lg">
            Conectamos Empresas Juniores, desenvolvemos lideranças e fortalecemos o
            Movimento Empresa Júnior no Oeste Paulista. Aqui, pessoas encontram propósito,
            criam conexões e geram impacto que ultrapassa a universidade.
          </Text>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Button href="/sobre-nos" variant="outline" showArrow>
              Sobre nós
            </Button>
            <Button href="/#contato" variant="solid" showArrow>
              Contrate uma EJ
            </Button>
          </div>
        </div>

        {/* Foto de time + elementos decorativos só no mobile/tablet pequeno,
            já que a partir do md a foto de fundo assume esse papel */}
        <div className="relative mx-auto w-full max-w-[360px] md:hidden">
          <span
            aria-hidden
            className="absolute -top-[10%] -left-[10%] aspect-square w-[55%] rounded-full bg-gradient-to-r from-orange to-amber-400"
          />
          <span
            aria-hidden
            className="absolute -right-[8%] -bottom-[8%] aspect-square w-[35%] rounded-full bg-gradient-to-r from-orange/40 to-amber-400/40"
          />
          <Image
            src="/images/turma.webp"
            alt="Equipe do Núcleo Bauru reunida"
            width={640}
            height={640}
            className="relative z-10 w-full rounded-3xl object-cover"
          />
        </div>
      </Content>
    </Container>
  )
}
