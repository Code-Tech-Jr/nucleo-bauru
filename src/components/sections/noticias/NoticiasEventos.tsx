import { getNoticias } from '@/lib/getNoticias'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'
import NoticiaCard from './NoticiaCard'

const QUANTIDADE_NA_HOME = 3

// Busca os próprios dados pra Home
export default async function NoticiasEventos() {
  const noticias = (await getNoticias()).slice(0, QUANTIDADE_NA_HOME)

  // Sem planilha configurada ou sem nenhuma linha válida, a seção não existe
  if (noticias.length === 0) return null

  return (
    <Container as="section" id="eventos-e-noticias" className="py-12">
      <Content>
        <div className="flex w-full flex-col gap-4 rounded-2xl p-6 shadow-card">
          <Heading variant="news" as="h2" className="text-blue">
            Eventos e Notícias
          </Heading>

          <ul className="flex flex-col gap-2">
            {noticias.map((noticia) => (
              <li key={noticia.id}>
                <NoticiaCard noticia={noticia} />
              </li>
            ))}
          </ul>

          <Button
            href="/noticias-e-eventos"
            variant="footer"
            showArrow
            className="self-end text-orange hover:text-blue"
          >
            Todas as Notícias
          </Button>
        </div>
      </Content>
    </Container>
  )
}
