'use client'

import { categoryService } from '@/services/categoryService'
import { tokenService } from '@/services/tokenService'
import { useState } from 'react'

export default function CreateCategory() {
  const [tipo, setTipo] = useState('')
  const [descricaoMeta, setDescricaoMeta] = useState('')

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    console.log('Categoria cadastrada:', { tipo, descricao_meta: descricaoMeta })
    const token = localStorage.getItem('access_token')
    const formData = {
      'tipo': tipo,
      'descricao_meta': descricaoMeta
    }
    try {
      await categoryService.postCategory(formData, token || "a")
    } catch(err) {
        const tokenRef = localStorage.getItem('refresh_token')
        if(tokenRef) { 
          const newToken = (await tokenService.getNewToken(tokenRef)).access || "a" 
          await categoryService.postCategory(formData, newToken)
        }
        else throw new Error ("Não foi possível achar o refresh token no localStorage")
      console.log(e || "Provavelmente token expirou")
    }
    console.log('Dados do autor:', formData)
    setTipo('')
    setDescricaoMeta('')
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Nova Categoria
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
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all"
        >
          Cadastrar Categoria
        </button>
      </form>
    </div>
  )
}