import type { ComponentType } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
} from 'react-icons/fa6'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'

const REDES: {
  href: string
  label: string
  Icone: ComponentType<{ className?: string }>
}[] = [
  {
    href: 'https://www.instagram.com/nucleobauru',
    label: 'Instagram',
    Icone: FaInstagram,
  },
  {
    href: 'https://www.facebook.com/nucleobauru',
    label: 'Facebook',
    Icone: FaFacebookF,
  },
  {
    href: 'https://www.linkedin.com/company/nucleobauru',
    label: 'LinkedIn',
    Icone: FaLinkedinIn,
  },
  {
    href: 'https://www.youtube.com/@nucleobauru2063',
    label: 'YouTube',
    Icone: FaYoutube,
  },
]

const MAPA_DO_SITE = [
  { href: '/', label: 'Início' },
  { href: '/sobre-nos', label: 'Sobre Nós' },
  { href: '/nossa-rede', label: 'Nossa Rede' },
  { href: '/#eventos-e-noticias', label: 'Eventos e Notícias' },
  { href: '/#parceiros', label: 'Parceiros' },
]

const INSTITUCIONAL = [
  { href: '/sobre-nos#quem-somos', label: 'Quem somos' },
  { href: '/sobre-nos#missao-visao-valores', label: 'Missão, Visão e Valores' },
]

const EMAIL = 'presidencia@nucleobauru.com.br'
const TELEFONE = '(00)0000-0000'

// slot fixo para os ícones de contato, para o texto alinhar entre as linhas
const SLOT_ICONE = 'flex h-9 w-9 shrink-0 items-center justify-center'
const LINK_CLASSES = 'text-white transition-colors hover:text-orange'

function ColunaLinks({
  titulo,
  links,
}: {
  titulo: string
  links: { href: string; label: string }[]
}) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Heading variant={'section'}>{titulo}</Heading>
      {/* w-fit + mx-auto centraliza o bloco no mobile sem desalinhar as linhas entre si */}
      <nav aria-label={titulo} className="mx-auto w-fit lg:mx-0">
        <ul className="flex flex-col gap-2">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={`${LINK_CLASSES} font-semibold`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default function Footer() {
  return (
    <Container as="footer" className="bg-blue py-12 lg:py-16">
      <Content className="flex-col items-stretch gap-12">
        {/* mobile: tudo empilhado e centralizado. lg: marca à esquerda e as três
            listas distribuídas à direita, com os topos alinhados */}
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:items-start lg:gap-12 lg:text-left">
          <div className="flex w-44 shrink-0 flex-col items-center gap-8">
            <Link href="/" aria-label="Núcleo Bauru — página inicial">
              <Image
                src="/logos/logo_branco.png"
                alt="Núcleo Bauru"
                width={280}
                height={291}
                className="h-auto w-32 lg:w-36"
                priority={false}
              />
            </Link>

            <ul className="flex items-center gap-3">
              {REDES.map(({ href, label, Icone }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue transition-colors hover:bg-orange hover:text-white"
                  >
                    <Icone className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* sm: as listas viram 2 colunas; lg: as três se distribuem na linha */}
          <div className="grid w-full gap-12 sm:grid-cols-2 lg:flex lg:flex-1 lg:justify-between lg:gap-12">
            <ColunaLinks titulo="Mapa do site" links={MAPA_DO_SITE} />
            <ColunaLinks titulo="Institucional" links={INSTITUCIONAL} />

            <div className="flex min-w-0 flex-col gap-4 sm:col-span-2 lg:col-span-1">
              <Heading variant={'section'}>Contato</Heading>
              <ul className="mx-auto flex w-fit flex-col gap-3 lg:mx-0">
                <li>
                  <a
                    href={`mailto:${EMAIL}`}
                    className={`group flex items-center gap-3 ${LINK_CLASSES}`}
                  >
                    <span
                      className={`${SLOT_ICONE} rounded-full bg-orange transition-colors group-hover:bg-white`}
                    >
                      <FaEnvelope className="h-4 w-4 text-white group-hover:text-orange" />
                    </span>
                    <span className="font-semibold break-all">{EMAIL}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${TELEFONE.replace(/\D/g, '')}`}
                    className={`group flex items-center gap-3 ${LINK_CLASSES}`}
                  >
                    <span
                      className={`${SLOT_ICONE} rounded-full bg-orange transition-colors group-hover:bg-white`}
                    >
                      <FaPhone className="h-4 w-4 text-white group-hover:text-orange" />
                    </span>
                    <span className="font-semibold">{TELEFONE}</span>
                  </a>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <span className={SLOT_ICONE}>
                    <FaLocationDot className="h-6 w-6 text-orange" />
                  </span>
                  <address className="font-semibold not-italic">Bauru, SP</address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="w-full text-center text-sm text-white sm:text-base">
          © {new Date().getFullYear()} Núcleo Bauru. Todos os direitos reservados. MEJ -
          Movimento Empresa Júnior.
        </p>
      </Content>
    </Container>
  )
}
