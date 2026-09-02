import Image from 'next/image'
import Button from '@/components/ui/Button'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'

// Bloco "Somos a Evolução!" — usado na home (Nosso propósito) e na Nossa Rede.
export default function Resultado() {
  return (
    <div className="flex w-full flex-col items-center gap-10 rounded-3xl bg-blue px-6 py-10 text-left lg:flex-row lg:justify-between lg:gap-16 lg:px-16 lg:py-14">
      <div className="flex flex-col items-start gap-4">
        <Heading variant="section" as="h3">
          Resultado
        </Heading>
        <Heading variant="hero" as="p" className="text-4xl lg:text-5xl">
          Somos a Evolução!
        </Heading>

        <Text variant="light" className="max-w-lg">
          No ano de 2025, mais de 240 soluções entregues e toda a verba revertida em
          educação e desenvolvimento da rede do Núcleo Bauru.
        </Text>

        <Button href="/#contato" variant="outline" showArrow>
          Contrate uma EJ
        </Button>
      </div>

      <Image
        src="/logos/logo_chama.svg"
        alt=""
        width={220}
        height={220}
        unoptimized
        className="hidden w-40 shrink-0 lg:block"
      />
    </div>
  )
}
