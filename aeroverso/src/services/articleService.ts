import type {Article, DjangoList} from "@/types";

const BASE_URL = "http://localhost:8000/articles/articles"; //endpoint no django REST framework

export const articleService = {
  getArticles: async (
    page = 1,
    filters?: { categoria?: number; autor?: number }
  ): Promise<DjangoList<Article>> => {
    const params = new URLSearchParams({ page: String(page) })
    if (filters?.categoria) params.append('categoria', String(filters.categoria))
    if (filters?.autor) params.append('autor', String(filters.autor))

    const res = await fetch(`${BASE_URL}?${params.toString()}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Erro ao buscar artigos.')
    return res.json()
  },

  getArticle: async (id: number): Promise<Article> => {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Erro ao buscar o artigo com id=${id}`)
    return res.json()
  },
}