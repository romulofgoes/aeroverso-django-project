import type {Article, ArticleRequestDTO, DjangoList, PatchArticle} from "@/types";
import { tokenService } from "./tokenService";
import { apiClient } from "@/lib/apiClient";


const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/articles` //endpoint no django REST framework

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

  postArticle: async (dto: ArticleRequestDTO) => {
    const body = new FormData()
    body.append('titulo', dto.titulo)
    body.append('subtitulo', dto.subtitulo)
    body.append('descricao_meta', dto.descricao_meta)
    body.append('categoria', dto.categoria)
    body.append('conteudo', dto.conteudo)
    body.append('autor', dto.autor)
    body.append('data', dto.data)
    if(dto.imagem_capa) body.append('imagem_capa', dto.imagem_capa)
    await apiClient.request(`${BASE_URL}`, {
      method: "POST", 
      body,
    });
  },
  updateArticle: async (id: string, article:PatchArticle) => {
    const body = new FormData();
    Object.entries(article).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(key, value as string | Blob);
      }
    });
    await apiClient.request(`${BASE_URL}/${id}`, {
      method:"PATCH",
      body
    });
  }
}