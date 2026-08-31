<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Form inputs must set an explicit text color

The `<body>` in `src/app/layout.tsx` sets `text-slate-100` (near-white) globally for the dark theme. Any form rendered on a light (`bg-white`/`bg-gray-50`) card — e.g. `CreateAuthor.tsx`, `EditAuthor.tsx` — must set an explicit text color (`text-gray-700` or similar) on its `<input>`/`<textarea>` elements, otherwise the typed text inherits the light body color and becomes unreadable against the light background.

# `Article.conteudo` is a Quill envelope string, not plain text/HTML

`CreateArticle.tsx` and `EditArticle.tsx` edit `conteudo` with `<QuillEditor>`
(`src/components/QuillEditor.tsx`), a thin wrapper around the vanilla `quill` npm package (not
`react-quill`) chosen to mirror `django-quill-editor`'s own JS widget exactly. `formData.conteudo`
is always a JSON string shaped `{"delta": "<json>", "html": "<html>"}` — never plain text and never
raw HTML on its own. This has to match what the Django backend expects; see the "QuillField needs
the `{delta, html}` JSON envelope" section in `backend/AGENTS.md` for the full contract (backend
raises `QuillParseError` on save if it gets anything else).

`QuillEditor` is deliberately uncontrolled after mount (the `value` prop only seeds initial
content once, via `quill.setContents(JSON.parse(parsed.delta))`) — re-applying `value` on every
render would fight the user's cursor. Any page reading `conteudo` for display (e.g.
`src/app/articles/[id]/page.tsx`) must `JSON.parse` it and use the `.html` key with
`dangerouslySetInnerHTML` — rendering the raw string directly shows the JSON envelope, not the
article text.

# Três embeds custom no QuillEditor: YouTube, Instagram, Twitter/X

`src/components/QuillEditor.tsx` registra 3 blots custom do Quill (`youtube`, `instagram`,
`tweet`), cada um com seu próprio botão na toolbar (ícone SVG inline, sem biblioteca de ícones).
Padrão usado, pra cada um: `window.prompt()` pede a URL → uma função valida/normaliza o link
(`extractYoutubeEmbedUrl` converte watch/youtu.be/shorts para a URL de embed; `isInstagramUrl` e
`isTweetUrl` só validam o domínio/formato) → `quill.insertEmbed(...)` insere o blot.

- **YouTube** vira um `<iframe>` de verdade (responsivo via `.ql-youtube-embed` em
  `globals.css`) — funciona igual dentro do editor e na página pública, sem depender de nada
  externo.
- **Instagram/Twitter** viram o `<blockquote>` exato que a Instagram/X.com espera pro próprio
  oEmbed delas (`blockquote.instagram-media` / `blockquote.twitter-tweet`) — de propósito, é a
  MESMA marcação nos dois lugares. Dentro do editor admin (sem o script da plataforma carregado)
  aparece só como um card com borda e o link (placeholder natural, ver CSS em `globals.css`); na
  página pública (`src/app/articles/[id]/page.tsx`), `src/components/ArticleEmbeds.tsx` carrega
  `instagram.com/embed.js`/`platform.twitter.com/widgets.js` sob demanda (só se o HTML do artigo
  contém aquele tipo de embed) e esses scripts substituem o blockquote pelo embed real. Se um dia
  precisar de preview ao vivo dentro do próprio admin, é só carregar os mesmos dois scripts lá
  também — decisão consciente de não fazer isso agora pra manter o editor leve.

Como `conteudo` já é servido como HTML "confiável" (`mark_safe` no Django, ver
`backend/AGENTS.md`), esses blots constroem os elementos via DOM API (`createElement`/`.href=`/
`.textContent=`) em vez de interpolar a URL crua em `innerHTML`, e as URLs são validadas por regex
ancorada ao domínio certo antes de aceitar — evita que uma URL maliciosa vire XSS armazenado. Uma
carrossel/reel do Instagram não muda nada aqui — é a mesma URL `/p/`ou `/reel/` e a mesma
marcação; se o embed parece "não funcionar", o problema não é o tipo de post.

## Dois gotchas reais que já aconteceram nesse componente

1. **Ícone de botão custom sumindo (mesma cor do fundo → parece "invisível”)**: `SnowTheme`
   (`node_modules/quill/themes/snow.js`) faz `import icons from '../ui/icons.js'` e usa essa
   referência de objeto DIRETAMENTE pra montar os botões — ela **não** relê `Quill.imports['ui/icons']`
   toda vez. Ou seja, `Quill.register('ui/icons', { ...icons, meuFormato: svg }, true)` registra um
   objeto novo que o tema nunca vai olhar, e o botão fica sem `innerHTML` (em branco, indistinguível
   do fundo do toolbar). Correção usada: depois de criar a instância do Quill, pegar
   `quill.getModule('toolbar').container` e setar `button.innerHTML` diretamente nos elementos
   `.ql-<formato>` — não depende de nenhum registro interno do Quill.
2. **Toolbar duplicada**: o efeito que cria o Quill não tinha cleanup nenhum. Em dev, o
   `reactStrictMode` (default do Next) roda todo `useEffect` duas vezes (monta → limpa → monta de
   novo); sem cleanup, a segunda montagem criava uma SEGUNDA instância do Quill no mesmo container
   — daí duas toolbars, e o `text-change` de uma instância podia sobrescrever o conteúdo salvo pela
   outra (suspeito nº 1 se um embed "sumir" depois de salvar). Correção: o efeito agora limpa
   `wrapper.innerHTML` antes de montar E no cleanup, e sempre cria um `<div>` novo pro Quill se
   prender — idempotente não importa quantas vezes o efeito rodar.
3. **Reel do Instagram: "link inválido" e/ou não renderiza (só o texto do fallback)**: Instagram
   tem duas rotas pro mesmo Reel — `/reel/{id}/` (singular, do botão "Compartilhar → Copiar link")
   e `/reels/{id}/` (plural, da própria aba de Reels) — aceitar só uma das duas rejeita metade dos
   links reais que um usuário cola. Além disso, mesmo aceitando a URL, usar a URL CRUA (com query
   string tipo `?igsh=...`, prefixo de usuário etc.) como `data-instgrm-permalink` faz o
   `embed.js` falhar *silenciosamente* — sem erro, só deixa o link de fallback como está. Correção:
   `extractInstagramShortcode()` aceita `p`, `reel` ou `reels` e extrai só o shortcode; o permalink
   é sempre reconstruído como `https://www.instagram.com/p/{shortcode}/` (comprovadamente
   reconhecido pelo embed.js, ver `InstagramEmbedBlot.create`), nunca a URL colada pelo usuário.

# Dashboard chrome lives in the layout, not in individual pages

`src/app/admin/management/dashboard/layout.tsx` renders a persistent top bar (a "← Painel" link and a "Sair" button) around every page under `dashboard/`, in addition to its auth guard. New pages added under `dashboard/` inherit this bar automatically — don't add your own back-navigation or logout control inside a page component, extend the layout instead.

# The dashboard logout button has no logic yet

`handleLogout` in `dashboard/layout.tsx` is an intentional stub (button renders, `onClick` does nothing). Whoever wires up logout should fill that function in — clear `access_token`/`refresh_token` from `localStorage` and redirect to `/admin/management` — rather than adding a second logout control elsewhere.

---

## Registro de uso de IA — restilização da área de admin/management (2026-08-05)

Feito por Claude (Sonnet 5), a pedido do usuário, para melhorar a aparência da área de
admin/management (`src/app/admin/management/`) usando princípios de UI/UX consagrados,
mantendo o escopo o mais simples possível.

**Princípios de UI/UX aplicados:**

- **Consistência e padrões** (heurística de Nielsen) — o login passou a reusar o mesmo padrão
  de card branco/input/botão já usado em `CreateAuthor.tsx` e afins, em vez de um estilo novo.
- **Visibilidade do status do sistema** — login mostra "Entrando..." durante a requisição e
  desabilita o botão nesse período.
- **Ajudar o usuário a reconhecer e corrigir erros** — mensagem "Usuário ou senha inválidos."
  visível na tela, em vez de falha silenciosa só logada no console.
- **Reconhecimento em vez de recordação / correspondência com o mundo real** — títulos como
  "Artigo-Editar" viraram "Editar Artigos"; cada card do dashboard ganhou um ícone que identifica
  o tipo de conteúdo (artigo/autor/categoria), reaproveitado entre criar e editar.
- **Gestalt — proximidade e similaridade** — os 6 links do dashboard, antes soltos num único
  grid, agora estão agrupados em duas seções rotuladas: "Criar novo" e "Editar existente".
- **Controle e liberdade do usuário** — barra fixa no dashboard com link "← Painel" e botão
  "Sair" (antes não havia nenhuma navegação além do botão voltar do navegador).
- **Contraste/legibilidade (WCAG)** — corrigido o bug já documentado acima ("Form inputs must
  set an explicit text color"); título do dashboard trocado de `text-gray-800` (baixo contraste
  sobre `bg-navy-950`) para branco.
- **Affordance / Lei de Fitts** — botão de login com estilo claramente clicável e área de toque
  generosa (largura total), no mesmo padrão dos demais formulários.

**Arquivos alterados:**

1. `src/app/admin/management/page.tsx` (login) — reescrito: imports mortos removidos, card
   branco centralizado (`max-w-sm`), inputs/botão no padrão visual do resto do site, estado de
   erro e de carregamento adicionados.
2. `src/app/admin/management/dashboard/page.tsx` (hub) — contraste do título corrigido, links
   divididos em seções "Criar novo"/"Editar existente", rótulos reescritos em linguagem natural,
   ícone por tipo de entidade.
3. `src/app/admin/management/dashboard/layout.tsx` — barra superior fixa adicionada (ver
   entradas acima sobre o chrome do dashboard e o stub de logout).

**Fora de escopo, não alterado (decisão deliberada):** cores de botão diferentes por entidade
(azul/roxo/verde) nos 6 formulários de criar/editar; mistura entre cards escuros (listas de
edição) e cards claros (formulários de criar/editar). Registrado aqui para não ser confundido
com descuido — foi uma escolha para manter a mudança simples, a pedido do usuário.
