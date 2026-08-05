'use client'

import { authorService } from '@/services/authorService'
import { tokenService } from '@/services/tokenService'
import { useState } from 'react'

export default function CreateAuthor() {
  const [nome, setNome] = useState('')
  const [profissao, setProfissao] = useState('')

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    console.log('Autor cadastrado:', { nome, profissao })
    const formData = {
      'nome': nome,
      'profissao': profissao
    }
    await authorService.postAuthor(formData)
    console.log("Provavelmente token expirou")
    console.log('Dados do autor:', formData)
    setNome('')
    setProfissao('')
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Novo Autor
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

        <button
          type="submit"
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm transition-all"
        >
          Cadastrar Autor
        </button>
      </form>
    </div>
  )
}