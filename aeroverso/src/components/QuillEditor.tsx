'use client'

import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { useEffect, useRef } from 'react'

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Formato esperado pelo django-quill-editor: uma string JSON envelope
// {"delta": "<delta serializado>", "html": "<html>"}, igual ao que o
// próprio django_quill.js gera no admin do Django.
export default function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!editorRef.current) return

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={editorRef} className="bg-white" />
}
