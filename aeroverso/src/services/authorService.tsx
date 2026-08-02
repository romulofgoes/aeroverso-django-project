import { Author, DjangoList } from '@/types/index'

const BASE_URL = `http://localhost:8000/articles/authors`

export const authorService = {
  getAuthors: async (): Promise<DjangoList<Author>> => {
    const res = await fetch(`${BASE_URL}/`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Erro ao buscar autores.')
    return res.json()
  },
  getAuthor: async (id: number): Promise<Author> => {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Erro ao buscar autor com id=${id}`)
    return res.json()
  },
}