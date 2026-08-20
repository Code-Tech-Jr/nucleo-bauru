// Navegação compartilhada entre Header e Footer
export const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/sobre-nos', label: 'Sobre Nós' },
  { href: '/nossa-rede', label: 'Nossa Rede' },
  { href: '/#parceiros', label: 'Parceiros' },
  { href: '/#eventos-e-noticias', label: 'Eventos e Notícias' },
] as const

// TODO(resend): e-mail oficial do Núcleo — usado no Footer e como destino padrão
// do formulário quando CONTATO_EMAIL_TO não está definida
export const EMAIL = 'presidencia@nucleobauru.com.br'
