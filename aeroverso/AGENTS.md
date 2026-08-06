<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Form inputs must set an explicit text color

The `<body>` in `src/app/layout.tsx` sets `text-slate-100` (near-white) globally for the dark theme. Any form rendered on a light (`bg-white`/`bg-gray-50`) card — e.g. `CreateAuthor.tsx`, `EditAuthor.tsx` — must set an explicit text color (`text-gray-700` or similar) on its `<input>`/`<textarea>` elements, otherwise the typed text inherits the light body color and becomes unreadable against the light background.

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
