import { apiClient } from '@/lib/apiClient'
import { Author, AuthorRequestDTO, DjangoList, PatchAuthor } from '@/types/index'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/authors`

export const authorService = {
  getAuthors: async (): Promise<DjangoList<Author>> => {
    const res = await fetch(`${BASE_URL}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Erro ao buscar autores.')
    return res.json()
  },
  getAuthor: async (id: number): Promise<Author> => {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Erro ao buscar autor com id=${id}`)
    return res.json()
  },
  postAuthor: async (newAuthor:AuthorRequestDTO)=> {
    const body = new FormData()
    body.append('nome', newAuthor.nome)
    body.append('profissao', newAuthor.profissao)
    const res = await apiClient.request(`${BASE_URL}`,{
      method:"POST",
      body
    });
  }
,
updateAuthor: async (id: string, author:PatchAuthor)=> {
    const body = new FormData();
    Object.entries(author).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(key, value as string | Blob);
      }
    });
    const res = await apiClient.request(`${BASE_URL}/${id}`, {
      method:"PATCH",
      body
    });
  }
}