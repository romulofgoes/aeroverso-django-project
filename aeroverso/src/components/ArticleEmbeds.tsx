'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
    twttr?: { widgets: { load: () => void } }
  }
}

function loadScriptOnce(src: string, id: string) {
  if (document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.src = src
  script.async = true
  document.body.appendChild(script)
}

// Processa os embeds de Instagram/Twitter presentes no HTML do artigo
// (ver QuillEditor.tsx). O YouTube não precisa disso — é um <iframe> puro.
export default function ArticleEmbeds({ html }: { html: string }) {
  useEffect(() => {
    if (html.includes('instagram-media')) {
      if (window.instgrm) {
        window.instgrm.Embeds.process()
      } else {
        loadScriptOnce('https://www.instagram.com/embed.js', 'instagram-embed-script')
      }
    }
    if (html.includes('twitter-tweet')) {
      if (window.twttr) {
        window.twttr.widgets.load()
      } else {
        loadScriptOnce('https://platform.twitter.com/widgets.js', 'twitter-widget-script')
      }
    }
  }, [html])

  return null
}
