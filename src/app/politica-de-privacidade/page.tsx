import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import { EMAIL } from '@/lib/site'

const SECOES = [
  {
    titulo: 'Quais dados são coletados',
    texto:
      'Vamos listar aqui os dados que o formulário de contato pede: nome, e-mail, assunto e mensagem.',
  },
  {
    titulo: 'Para que os dados são usados',
    texto: 'Vamos descrever aqui a finalidade da coleta e a base legal correspondente.',
  },
  {
    titulo: 'Por quanto tempo os dados são guardados',
    texto: 'Vamos informar aqui o prazo de retenção e o que acontece depois dele.',
  },
  {
    titulo: 'Com quem os dados são compartilhados',
    texto:
      'Vamos indicar aqui os serviços envolvidos no envio e no armazenamento das mensagens.',
  },
  {
    titulo: 'Direitos do titular (LGPD)',
    texto:
      'Vamos explicar aqui como pedir confirmação, acesso, correção, anonimização ou exclusão dos seus dados, e como esse pedido é atendido.',
  },
  {
    titulo: 'Contato do controlador',
    texto: `Até a publicação da versão final, dúvidas sobre seus dados podem ser enviadas para ${EMAIL}.`,
  },
] as const

export default function PoliticaDePrivacidade() {
  return (
    <>
      <Container
        as="section"
        className="h-[220px]"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <Content>
          <Heading variant="hero" className="text-5xl">
            Política de Privacidade
          </Heading>
        </Content>
      </Container>

      <Container as="section" className="flex-col gap-10 py-12">
        <Content className="flex-col gap-10">
          <Text variant="dark" className="text-justify">
            Esta página ainda é um rascunho: o conteúdo definitivo será publicado pelo
            Núcleo Bauru. Os títulos abaixo indicam o que a política vai cobrir — nada
            aqui vale como compromisso ainda.
          </Text>

          {SECOES.map(({ titulo, texto }) => (
            <div key={titulo} className="flex flex-col gap-6">
              <Heading variant="section">{titulo}</Heading>
              <Text className="text-justify">{texto}</Text>
            </div>
          ))}
        </Content>
      </Container>
    </>
  )
}
