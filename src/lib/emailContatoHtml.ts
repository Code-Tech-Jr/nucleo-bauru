import { montarTitulo, type DadosContato } from '@/lib/emailContato'

// Cores do site (globals.css) repetidas aqui de propósito: cliente de e-mail não
// lê variável CSS nem folha externa, tudo precisa estar inline no HTML.
const AZUL = '#1f3160'
const LARANJA = '#ed551a'
const FUNDO = '#f2f4f8'
const BORDA = '#e2e6ee'
const CINZA = '#6b7280'

const FONTE = 'Arial, Helvetica, sans-serif'

// O conteúdo vem de formulário público: sem escapar, dá pra injetar HTML e link
// dentro da caixa de quem abre o e-mail.
function escapar(texto: string) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Cliente de e-mail ignora white-space: pre-wrap, então quebra de linha vira <br>
// e linha em branco vira parágrafo.
function paragrafos(texto: string) {
  const blocos = escapar(texto.trim()).split(/\n{2,}/)

  return blocos
    .map((bloco, i) => {
      const margem = i === blocos.length - 1 ? '0' : '0 0 12px'
      return `<p style="margin:${margem};">${bloco.replace(/\n/g, '<br />')}</p>`
    })
    .join('')
}

function linha(rotulo: string, valor: string) {
  return `
            <tr>
              <td style="padding:0 0 12px;font-family:${FONTE};font-size:12px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;color:${CINZA};width:96px;vertical-align:top;">${rotulo}</td>
              <td style="padding:0 0 12px;font-family:${FONTE};font-size:15px;line-height:1.5;color:${AZUL};vertical-align:top;">${valor}</td>
            </tr>`
}

export function montarHtml(dados: DadosContato) {
  const { nome, email, assunto, mensagem } = dados
  const nomeSeguro = escapar(nome)
  const emailSeguro = escapar(email)

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapar(montarTitulo(dados))}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${FUNDO};">
    <!-- prévia que a caixa de entrada mostra ao lado do assunto -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${nomeSeguro} enviou uma mensagem pelo formulário do site.</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${FUNDO};">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid ${BORDA};border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background-color:${AZUL};border-bottom:4px solid ${LARANJA};padding:24px 32px;">
                <p style="margin:0;font-family:${FONTE};font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#a9b6d4;">Núcleo Bauru</p>
                <h1 style="margin:8px 0 0;font-family:${FONTE};font-size:20px;line-height:1.3;font-weight:bold;color:#ffffff;">Novo contato pelo site</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 32px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${linha('Nome', nomeSeguro)}
${linha('E-mail', `<a href="mailto:${emailSeguro}" style="color:${LARANJA};text-decoration:underline;">${emailSeguro}</a>`)}
${linha('Assunto', escapar(assunto))}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:12px 32px 28px;">
                <p style="margin:0 0 10px;font-family:${FONTE};font-size:12px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;color:${CINZA};">Mensagem</p>
                <div style="border-left:3px solid ${LARANJA};background-color:#f7f8fb;border-radius:0 8px 8px 0;padding:16px 18px;font-family:${FONTE};font-size:15px;line-height:1.6;color:${AZUL};">${paragrafos(mensagem)}</div>
              </td>
            </tr>

            <tr>
              <td style="border-top:1px solid ${BORDA};background-color:#fafbfd;padding:18px 32px;">
                <p style="margin:0;font-family:${FONTE};font-size:12px;line-height:1.6;color:${CINZA};">
                  Enviado pelo formulário de contato do site do Núcleo Bauru.<br />
                  Basta responder este e-mail para falar com ${nomeSeguro}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
