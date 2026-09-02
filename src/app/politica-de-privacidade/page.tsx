import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import { EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Como o Núcleo Bauru coleta, usa e protege os dados enviados pelo formulário de contato.',
  alternates: { canonical: '/politica-de-privacidade' },
}

// Conteúdo baseado no funcionamento real do formulário (src/lib/enviarContato.ts
// e emailContato.ts). O Núcleo ainda precisa confirmar: prazo de descarte das
// mensagens na caixa, razão social/CNPJ do controlador e se há encarregado (DPO).
const SECOES = [
  {
    titulo: 'Quem trata os seus dados',
    texto: `O controlador dos dados coletados neste site é o Núcleo Bauru. Para qualquer questão sobre esta política ou sobre os seus dados, o contato é ${EMAIL}.`,
  },
  {
    titulo: 'Quais dados são coletados',
    texto:
      'Ao enviar o formulário de contato, coletamos o seu nome, o seu e-mail, o assunto escolhido na lista e a mensagem que você escreve. Para conter envios automatizados e repetidos, o site também registra temporariamente o endereço IP de quem envia.',
  },
  {
    titulo: 'Para que os dados são usados',
    texto:
      'Os dados do formulário são usados apenas para receber e responder o seu contato. A base legal é o seu consentimento, dado ao marcar a caixa de concordância antes do envio. O endereço IP é usado somente como medida de segurança contra envios abusivos.',
  },
  {
    titulo: 'Com quem os dados são compartilhados',
    texto:
      'A mensagem é entregue pelo Resend, serviço de envio de e-mail, e o site é hospedado na Vercel. Ambos operam a infraestrutura necessária para o contato funcionar e podem processar os dados em servidores fora do Brasil. Não vendemos nem compartilhamos os seus dados para outras finalidades.',
  },
  {
    titulo: 'Por quanto tempo os dados são guardados',
    texto:
      'O site não guarda as mensagens em banco de dados próprio: elas chegam à caixa de e-mail do Núcleo, que as mantém pelo tempo necessário ao atendimento e as elimina quando não forem mais necessárias. O endereço IP fica apenas em memória temporária, por no máximo uma hora, e não é armazenado de forma permanente.',
  },
  {
    titulo: 'Segurança',
    texto:
      'O envio do formulário trafega por conexão criptografada (HTTPS) e conta com medidas contra spam e envios abusivos. Ainda assim, nenhum meio de transmissão de dados é totalmente livre de riscos.',
  },
  {
    titulo: 'Seus direitos (LGPD)',
    texto:
      'A Lei Geral de Proteção de Dados garante a você confirmar a existência do tratamento, acessar os seus dados, corrigi-los, pedir a anonimização ou a exclusão e revogar o consentimento a qualquer momento.',
  },
  {
    titulo: 'Como exercer os seus direitos',
    texto: `Para exercer qualquer um desses direitos ou tirar dúvidas sobre o tratamento dos seus dados, escreva para ${EMAIL}.`,
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
            Esta política explica como o Núcleo Bauru trata os dados enviados pelo
            formulário de contato deste site. Ela reflete o funcionamento atual do site e
            pode ser atualizada;
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
