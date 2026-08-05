'use client'

import { useRouter } from 'next/navigation'
import { categoryService } from '@/services/categoryService'
import { tokenService } from '@/services/tokenService'
import { Category, PatchCategory } from '@/types/index'
import { useState } from 'react'

export default function EditCategory({ category }: { category: Category }) {
  const router = useRouter()
  const [tipo, setTipo] = useState(category.tipo)
  const [descricaoMeta, setDescricaoMeta] = useState(category.descricao_meta)
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setStatus('saving')
    const token = localStorage.getItem('access_token')
    const patchData: PatchCategory = { tipo, descricao_meta: descricaoMeta }
    try {
      await categoryService.updateCategory(String(category.id), patchData)
      router.push('/admin/management/dashboard/categories/edit')
    } catch (err) {
      console.log(err || "Não foi possível salvar as alterações")
      setStatus('error')
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Editar Categoria
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Nome/Tipo da Categoria *
          </label>
          <input
            type="text"
            id="tipo"
            maxLength={50}
            required
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Ex: Tecnologia, Esportes"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="cat_descricao_meta" className="block text-sm font-medium text-gray-700">
              Descrição Meta (SEO) *
            </label>
            <span className="text-xs text-gray-400">{descricaoMeta.length}/200</span>
          </div>
          <textarea
            id="cat_descricao_meta"
            maxLength={200}
            rows={3}
            required
            value={descricaoMeta}
            onChange={(e) => setDescricaoMeta(e.target.value)}
            placeholder="Descrição resumida para mecanismos de busca"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          {status === 'error' && (
            <p className="text-sm text-red-600">Erro ao salvar. Tente novamente.</p>
          )}
          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium rounded-lg shadow-sm transition-all"
          >
            {status === 'saving' ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
