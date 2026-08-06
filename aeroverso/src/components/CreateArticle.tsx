'use client'

import { articleService } from '@/services/articleService'
import { categoryService } from '@/services/categoryService'
import { tokenService } from '@/services/tokenService'
import { ArticleRequestDTO, Author, Category } from '@/types/index'
import { useState } from 'react'

interface AuthorOption {
  id: number
  nome: string
}

interface CategoryOption {
  id: number
  tipo: string
}

interface CreateArticleProps {
  authors?: AuthorOption[]
  categories?: CategoryOption[]
}

export default function CreateArticle({
  authors = [],
  categories = [],
}: CreateArticleProps) {
    
  const [formData, setFormData] = useState<ArticleRequestDTO>({
    autor: '',
    titulo: '',
    subtitulo: '',
    descricao_meta: '',
    conteudo: '',
    data: '',
    categoria: '',
    imagem_capa: null,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if(fileList) {
       setFormData((prev) => ({ ...prev, imagem_capa: fileList[0] }))
    }
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    await articleService.postArticle(formData)
    window.location.href = '/admin/management/dashboard'
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-8 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Criar Novo Artigo</h1>
        <p className="text-sm text-gray-500 mt-1">
          Preencha os campos abaixo para publicar um novo artigo no blog.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid de Autor e Categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-1">
              Autor *
            </label>
            <select
              id="autor"
              name="autor"
              required
              value={formData.autor}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Selecione um autor</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              id="categoria"
              name="categoria"
              required
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.tipo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Título */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
              Título *
            </label>
            <span className="text-xs text-gray-700">
              {formData.titulo.length}/60 caracteres
            </span>
          </div>
          <input
            type="text"
            id="titulo"
            name="titulo"
            maxLength={60}
            required
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ex: Guia Completo sobre SEO em 2026"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Subtítulo */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="subtitulo" className="block text-sm font-medium text-gray-700">
              Subtítulo *
            </label>
            <span className="text-xs text-gray-700">
              {formData.subtitulo.length}/120 caracteres
            </span>
          </div>
          <input
            type="text"
            id="subtitulo"
            name="subtitulo"
            maxLength={120}
            required
            value={formData.subtitulo}
            onChange={handleChange}
            placeholder="Uma breve introdução ao assunto do artigo"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Descrição Meta */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="descricao_meta" className="block text-sm font-medium text-gray-700">
              Descrição Meta (SEO) *
            </label>
            <span className="text-xs text-gray-700">
              {formData.descricao_meta.length}/160 caracteres
            </span>
          </div>
          <textarea
            id="descricao_meta"
            name="descricao_meta"
            maxLength={160}
            rows={2}
            required
            value={formData.descricao_meta}
            onChange={handleChange}
            placeholder="Resumo que aparecerá nos resultados de busca do Google..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Data e Imagem de Capa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
              Data de Publicação *
            </label>
            <input
              type="datetime-local"
              id="data"
              name="data"
              required
              value={formData.data}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="imagem_capa" className="block text-sm font-medium text-gray-700 mb-1">
              Imagem de Capa (Opcional)
            </label>
            <input
              type="file"
              id="imagem_capa"
              name="imagem_capa"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div>
          <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-1">
            Conteúdo do Artigo *
          </label>
          <textarea
            id="conteudo"
            name="conteudo"
            rows={10}
            required
            value={formData.conteudo}
            onChange={handleChange}
            placeholder="Escreva seu artigo aqui..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Botão Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all focus:ring-4 focus:ring-blue-200"
          >
            Publicar Artigo
          </button>
        </div>
      </form>
    </div>
  )
}