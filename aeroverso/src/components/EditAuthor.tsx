'use client'

import { useRouter } from 'next/navigation'
import { authorService } from '@/services/authorService'
import { tokenService } from '@/services/tokenService'
import { Author, PatchAuthor } from '@/types/index'
import { useState } from 'react'

export default function EditAuthor({ author }: { author: Author }) {
  const router = useRouter()
  const [nome, setNome] = useState(author.nome)
  const [profissao, setProfissao] = useState(author.profissao)
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setStatus('saving')
    const token = localStorage.getItem('access_token')
    const patchData: PatchAuthor = { nome, profissao }
    try {
      await authorService.updateAuthor(String(author.id), patchData)
      router.push('/admin/management/dashboard/authors/edit')
    } catch (err) {
      console.log(err || "Não foi possível salvar as alterações")
      setStatus('error')
    }
    window.location.href = '/admin/management/dashboard'
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Editar Autor
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome do Autor *
            </label>
            <span className="text-xs text-gray-400">{nome.length}/70</span>
          </div>
          <input
            type="text"
            id="nome"
            maxLength={70}
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Maria da Silva"
            className="w-full px-4 py-2 bg-gray-50 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="profissao" className="block text-sm font-medium text-gray-700">
              Profissão / Cargo *
            </label>
            <span className="text-xs text-gray-400">{profissao.length}/50</span>
          </div>
          <input
            type="text"
            id="profissao"
            maxLength={50}
            required
            value={profissao}
            onChange={(e) => setProfissao(e.target.value)}
            placeholder="Ex: Jornalista de Tecnologia"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          {status === 'error' && (
            <p className="text-sm text-red-600">Erro ao salvar. Tente novamente.</p>
          )}
          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-medium rounded-lg shadow-sm transition-all"
          >
            {status === 'saving' ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
