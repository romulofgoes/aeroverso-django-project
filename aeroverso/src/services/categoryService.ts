import { Category, DjangoList } from '@/types/index'

const BASE_URL = `http://localhost:8000/articles/categories`

export const categoryService = {
  getCategories: async (): Promise<DjangoList<Category>> => {
    const res = await fetch(`${BASE_URL}/`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Erro ao buscar categorias.')
    return res.json()
  },
  getCategory: async (id: number): Promise<Category> => {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Erro ao buscar categoria com id=${id}`)
    return res.json()
  },
}