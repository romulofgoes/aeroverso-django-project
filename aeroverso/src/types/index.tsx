export interface Category {
  id: number
  tipo: string
  descricao_meta: string
}

export interface Author {
  id: number
  nome: string
  profissao: string
}

export interface ArticleImage {
  id: number
  imagem: string
}

export interface Article {
  id: number
  titulo: string
  subtitulo: string
  descricao_meta: string
  conteudo: string
  data: string
  imagem_capa: string
  categoria: Category
  categorias_relacionadas: Category[]
  autor: Author
  imagens: ArticleImage[]
}

export interface DjangoList<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}