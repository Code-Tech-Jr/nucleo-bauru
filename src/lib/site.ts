// Navegação compartilhada entre Header e Footer
export const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/sobre-nos', label: 'Sobre Nós' },
  { href: '/nossa-rede', label: 'Nossa Rede' },
  { href: '/#parceiros', label: 'Parceiros' },
  { href: '/noticias-e-eventos', label: 'Eventos e Notícias' },
] as const

// TODO(resend): e-mail oficial do Núcleo — usado no Footer e como destino padrão
// do formulário quando CONTATO_EMAIL_TO não está definida
export const EMAIL = 'presidencia@nucleobauru.com.br'

// Precisa bater com o remotePatterns do next.config.ts: o que passar daqui sem
// estar liberado lá estoura no render do servidor.
export const CLOUDINARY_BASE = 'https://res.cloudinary.com/bu6xbdjg/'

// metadataBase (canonical e og:url). Em produção, defina NEXT_PUBLIC_SITE_URL.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nucleobauru.com.br'
