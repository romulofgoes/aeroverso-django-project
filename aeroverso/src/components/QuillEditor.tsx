'use client'

import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { useEffect, useRef } from 'react'

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// --- Embeds custom: YouTube (iframe), Instagram e Twitter/X (blockquote no
// formato oficial de oEmbed dessas plataformas). Ficam registrados uma única
// vez, no módulo, não a cada render do componente. ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlockEmbed: any = Quill.import('blots/block/embed')

class YoutubeEmbedBlot extends BlockEmbed {
  static blotName = 'youtube'
  static tagName = 'DIV'
  static className = 'ql-youtube-embed'

  static create(embedUrl: string) {
    const node: HTMLElement = super.create(embedUrl)
    node.setAttribute('contenteditable', 'false')
    node.dataset.url = embedUrl
    const iframe = document.createElement('iframe')
    iframe.src = embedUrl
    iframe.setAttribute('frameborder', '0')
    iframe.setAttribute('allowfullscreen', 'true')
    node.appendChild(iframe)
    return node
  }

  static value(node: HTMLElement) {
    return node.dataset.url
  }
}

class InstagramEmbedBlot extends BlockEmbed {
  static blotName = 'instagram'
  static tagName = 'DIV'
  static className = 'ql-instagram-embed'

  static create(url: string) {
    const node: HTMLElement = super.create(url)
    node.setAttribute('contenteditable', 'false')
    node.dataset.url = url
    const blockquote = document.createElement('blockquote')
    blockquote.className = 'instagram-media'
    // Estrutura mais próxima do embed oficial (blockquote + link dentro de um
    // div com padding) — funciona igual pra post de 1 foto, carrossel ou reel,
    // já que o Instagram usa a mesma URL/marcação (/p/ ou /reel/) pros três.
    // O permalink é reconstruído a partir do shortcode (nunca a URL crua
    // colada pelo usuário) — o embed.js falha silenciosamente se a URL tiver
    // query string residual, prefixo de usuário ou vier na rota /reels/.
    const shortcode = extractInstagramShortcode(url)
    const permalink = shortcode ? `https://www.instagram.com/p/${shortcode}/` : url
    blockquote.setAttribute('data-instgrm-captioned', '')
    blockquote.setAttribute(
      'data-instgrm-permalink',
      `${permalink}?utm_source=ig_embed&utm_campaign=loading`
    )
    blockquote.setAttribute('data-instgrm-version', '14')
    const wrapperDiv = document.createElement('div')
    wrapperDiv.style.padding = '16px'
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.textContent = 'Ver esta publicação no Instagram'
    wrapperDiv.appendChild(a)
    blockquote.appendChild(wrapperDiv)
    node.appendChild(blockquote)
    return node
  }

  static value(node: HTMLElement) {
    return node.dataset.url
  }
}

class TweetEmbedBlot extends BlockEmbed {
  static blotName = 'tweet'
  static tagName = 'DIV'
  static className = 'ql-tweet-embed'

  static create(url: string) {
    const node: HTMLElement = super.create(url)
    node.setAttribute('contenteditable', 'false')
    node.dataset.url = url
    const blockquote = document.createElement('blockquote')
    blockquote.className = 'twitter-tweet'
    const a = document.createElement('a')
    a.href = url
    a.textContent = url
    blockquote.appendChild(a)
    node.appendChild(blockquote)
    return node
  }

  static value(node: HTMLElement) {
    return node.dataset.url
  }
}

const YOUTUBE_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#444" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5V8.5L15.8 12Z"/></svg>'
const INSTAGRAM_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#444" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>'
const TWEET_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#444" d="M18.9 3H22l-7.2 8.2L23 21h-6.6l-5.1-6.4L5.4 21H2.3l7.7-8.8L2 3h6.8l4.6 5.9Zm-1.2 16h1.7L7.4 4.9H5.6Z"/></svg>'

const EMBED_ICONS: Record<string, string> = {
  youtube: YOUTUBE_ICON,
  instagram: INSTAGRAM_ICON,
  tweet: TWEET_ICON,
}

let embedsRegistered = false
function registerEmbedsOnce() {
  if (embedsRegistered) return
  Quill.register(YoutubeEmbedBlot, true)
  Quill.register(InstagramEmbedBlot, true)
  Quill.register(TweetEmbedBlot, true)
  embedsRegistered = true
}

function extractYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

// Reel copiado da aba de Reels vem como /reels/{id}/ (plural); o botão
// "Compartilhar → Copiar link" gera /reel/{id}/ (singular). /p/, /reel/ e
// /reels/ são só rotas diferentes pro mesmo id de mídia — por isso o embed
// é sempre remontado como /p/{id}/, que é a forma que o embed.js reconhece
// de forma confiável (ver aeroverso/AGENTS.md).
function extractInstagramShortcode(url: string): string | null {
  const match = url.match(/^https:\/\/(?:www\.)?instagram\.com\/(?:[^/]+\/)?(?:p|reels?|tv)\/([\w-]+)/)
  return match ? match[1] : null
}

function isInstagramUrl(url: string): boolean {
  return extractInstagramShortcode(url) !== null
}

function isTweetUrl(url: string): boolean {
  return /^https:\/\/(www\.)?(twitter|x)\.com\/\w+\/status\/\d+/.test(url)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function insertEmbed(this: any, blotName: string, url: string) {
  const range = this.quill.getSelection(true)
  this.quill.insertEmbed(range.index, blotName, url, 'user')
  this.quill.setSelection(range.index + 1, 0, 'user')
}

const toolbarHandlers = {
  youtube() {
    const url = window.prompt('Link do vídeo do YouTube:')
    if (!url) return
    const embedUrl = extractYoutubeEmbedUrl(url.trim())
    if (!embedUrl) {
      window.alert('Link do YouTube inválido.')
      return
    }
    insertEmbed.call(this, 'youtube', embedUrl)
  },
  instagram() {
    const url = window.prompt('Link do post/vídeo do Instagram:')
    if (!url) return
    if (!isInstagramUrl(url.trim())) {
      window.alert('Link do Instagram inválido.')
      return
    }
    insertEmbed.call(this, 'instagram', url.trim())
  },
  tweet() {
    const url = window.prompt('Link do post no Twitter/X:')
    if (!url) return
    if (!isTweetUrl(url.trim())) {
      window.alert('Link do Twitter/X inválido.')
      return
    }
    insertEmbed.call(this, 'tweet', url.trim())
  },
}

const TOOLBAR_CONTAINER = [
  [{ header: ['1', '2', '3', false] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['youtube', 'instagram', 'tweet'],
  ['clean'],
]

// Formato esperado pelo django-quill-editor: uma string JSON envelope
// {"delta": "<delta serializado>", "html": "<html>"}, igual ao que o
// próprio django_quill.js gera no admin do Django.
export default function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    registerEmbedsOnce()

    // Sempre monta o Quill num elemento novo e limpa o wrapper antes — em
    // dev, o React (StrictMode) roda este efeito duas vezes; sem isso, a
    // segunda instância do Quill duplicava a toolbar inteira.
    wrapper.innerHTML = ''
    const editorEl = document.createElement('div')
    wrapper.appendChild(editorEl)

    const quill = new Quill(editorEl, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: {
          container: TOOLBAR_CONTAINER,
          handlers: toolbarHandlers,
        },
      },
    })

    // Os botões custom (youtube/instagram/tweet) não têm ícone no mapa
    // interno que o tema 'snow' usa (esse mapa é uma referência de módulo
    // fixa, Quill.register('ui/icons', ...) não alcança ela) — setamos o
    // SVG direto no botão depois de criado.
    const toolbarEl = (quill.getModule('toolbar') as { container: HTMLElement }).container
    Object.entries(EMBED_ICONS).forEach(([format, icon]) => {
      const button = toolbarEl.querySelector(`.ql-${format}`)
      if (button) button.innerHTML = icon
    })

    if (value) {
      try {
        const parsed = JSON.parse(value)
        if (parsed.delta) {
          quill.setContents(JSON.parse(parsed.delta))
        }
      } catch {
        // conteúdo inicial inválido/legado — deixa o editor em branco
      }
    }

    quill.on('text-change', () => {
      const delta = JSON.stringify(quill.getContents())
      const html = quill.root.innerHTML
      onChangeRef.current(JSON.stringify({ delta, html }))
    })

    return () => {
      wrapper.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={wrapperRef} className="bg-white text-gray-700" />
}
