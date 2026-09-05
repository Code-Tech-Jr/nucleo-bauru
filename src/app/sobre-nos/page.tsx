import type { Metadata } from 'next'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import Content from '@/components/ui/Content'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Timeline from '@/components/sections/Timeline'

export const metadata: Metadata = {
  title: 'Sobre o Núcleo',
  description:
    'A história do Núcleo Bauru, do NEJunesp (2006) ao Movimento Empresa Júnior no Oeste Paulista.',
  alternates: { canonical: '/sobre-nos' },
}

export default function SobreNos() {
  return (
    <>
      <Container
        as="section"
        className="h-[220px]"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <Content>
          <Heading variant="hero" className="text-5xl">
            Sobre o Núcleo
          </Heading>
        </Content>
      </Container>

      {/* id: alvo da âncora /sobre-nos#quem-somos usada no rodapé */}
      <Container as="section" id="quem-somos" className="flex-col gap-10 py-12">
        <Content className="flex-col gap-10">
          <Heading variant="section" className="self-start">
            Quem Somos?
          </Heading>

          <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-10">
            <Text variant="dark" className="text-justify">
              A história do Núcleo Bauru tem início na construção do NEJunesp, criado em
              2006, em Araraquara, com o propósito de integrar as Empresas Juniores da
              Unesp e fortalecer o Movimento Empresa Júnior dentro da universidade. Com o
              crescimento da rede e o aumento do número de EJs distribuídas por diferentes
              campi, surgiu a necessidade de aproximar o suporte às empresas e tornar a
              atuação mais estratégica. Em 2015, a organização passou por uma renovação de
              identidade, adotando o nome Núcleo UNESP, refletindo uma estrutura mais
              consolidada e preparada para expandir sua atuação.
            </Text>

            <div className="relative aspect-[1215/609] w-full overflow-hidden rounded-[5.3%/10.6%]">
              <Image
                src="/images/galera.webp"
                alt="Membros do Núcleo Bauru reunidos"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-10">
            <div className="relative aspect-[1215/609] w-full overflow-hidden rounded-[5.3%/10.6%]">
              <Image
                src="/images/turma.webp"
                alt="Turma do Núcleo Bauru em evento"
                fill
                className="object-cover"
              />
            </div>

            <Text variant="dark" className="text-justify">
              Esse crescimento culminou, em 2018, na regionalização dos núcleos,
              descentralizando a gestão e aproximando ainda mais o acompanhamento das
              Empresas Juniores. Foi nesse contexto que nasceu o Núcleo Bauru, reunindo as
              EJs da região para promover desenvolvimento, integração e resultados cada
              vez mais consistentes. Em 2020, o Núcleo passou por uma nova reformulação de
              identidade visual e posicionamento, dando origem ao Núcleo Bauru como é
              conhecido atualmente: uma rede colaborativa que conecta pessoas e empresas
              em torno de um mesmo propósito, impulsionando o protagonismo do interior
              paulista e fortalecendo o ecossistema do MEJ na região.
            </Text>
          </div>

          <Timeline />

          <div className="flex flex-col gap-6">
            <Heading variant="section">Movimento Empresa Júnior (MEJ)</Heading>

            <Text className="text-justify">
              Empresa júnior (EJ) é uma empresa constituída exclusivamente por alunos de
              graduação de instituições de ensino superior, organizados em uma associação
              civil, com o intuito de desenvolver projetos e consultorias para empresas,
              entidades e sociedade em geral, nas suas áreas de atuação, sob a supervisão
              de professores e profissionais especializados.
            </Text>

            <Text className="text-justify">
              As empresas juniores possuem gestão autônoma em relação à universidade ou
              qualquer entidade acadêmica. A renda obtida com os serviços e projetos
              prestados pela empresa deve ser investida na própria instituição, sem a
              captação de recursos financeiros para seus membros.
            </Text>
          </div>

          <div className="flex flex-col gap-6">
            <Heading variant="section">Histórico do Movimento</Heading>

            <Text className="text-justify">
              O surgimento da 1ª Empresa Júnior se deu na França em 1967, quando alunos da
              ESSEC-L&apos;École Supérieure des Sciences Económiques et Commerciales, em
              Paris, sentiram a necessidade de um maior contato com o mercado e colocar em
              prática o conhecimento acadêmico. Assim, foi fundada a Júnior ESSEC Conseil,
              a primeira EJ do mundo. A partir daí o movimento se difundiu e pode ser
              considerado um fenômeno econômico empresarial.
            </Text>

            <Text className="text-justify">
              Em 1986 ocorreu o processo de internacionalização e, atualmente, existem
              Empresas Juniores espalhadas por todo o mundo: Portugal, Espanha, Itália,
              Inglaterra, Eslovênia, Suíça, Alemanha, entre outros. Hoje na Europa existe
              uma associação europeia de Empresas Juniores (JADE) e confederações
              nacionais em todos os países.
            </Text>

            <Text className="text-justify">
              No Brasil a primeira ocorrência foi em São Paulo, surgiram as empresas da
              FGV (Fundação Getúlio Vargas) e da FAAP (Fundação Armando Álvares Penteado).
              A ideia foi introduzida pela câmara de comércio França-Brasil em 1988. Em
              1992 é criada a FEJESP - Federação das Empresas Juniores do Estado de São
              Paulo, e em 2003 surge a Brasil Júnior, para representar as EJs confederadas
              em todas as esferas, representando o MEJ no âmbito nacional.
            </Text>

            <Text className="text-justify">
              Em 2016, é aprovada a Lei 13.267, que disciplina a criação e organização de
              todas as EJs do Brasil. Hoje existem em torno de 1500 Empresas Juniores por
              todo o país, nas mais diversas áreas de atuação.
            </Text>
          </div>
        </Content>
      </Container>
    </>
  )
}
