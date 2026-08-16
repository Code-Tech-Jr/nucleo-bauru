'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import { EMAIL, NAV_LINKS } from '@/lib/site'
import HeaderMobile from './HeaderMobile'

export default function Header() {
  const pathname = usePathname()

  const links = NAV_LINKS.map(({ href, label }) => {
    const ativo = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

    return (
      <li key={href}>
        <Button
          href={href}
          variant="header"
          active={ativo}
          aria-current={ativo ? 'page' : undefined}
        >
          {label}
        </Button>
      </li>
    )
  })

  return (
    <Container as="header" className="bg-blue">
      <Content as="nav" aria-label="Principal" className="h-25 justify-between">
        <Link href="/" aria-label="Núcleo Bauru — página inicial">
          <Image
            src="/logos/logo_branco.png"
            alt="Núcleo Bauru"
            width={154}
            height={160}
            priority
            className="h-20 w-auto"
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">{links}</ul>

        <Button
          href={`mailto:${EMAIL}`}
          variant="solid"
          showArrow
          className="hidden lg:inline-flex"
        >
          Fale conosco
        </Button>

        <HeaderMobile links={links} />
      </Content>
    </Container>
  )
}
