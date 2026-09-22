export interface CategoryRequestDTO {
  tipo: string
  descricao_meta: string
}
export interface Category  extends CategoryRequestDTO{
  id: number
}

export interface AuthorRequestDTO {
  nome: string
  profissao: string
}

export interface Author extends AuthorRequestDTO {
  id: number
}

export interface ArticleImage {
  id: number
  imagem: string
}

// Campos que são idênticos entre request (POST) e response (GET)
interface ArticleBase {
  titulo: string
  subtitulo: string
  descricao_meta: string
  conteudo: string
}

// Corpo do POST/PUT — categoria e autor são só o ID (o que o <select> te dá)
// data_publicacao NÃO entra aqui: é auto_now_add no backend (read-only), nunca
// enviado pelo cliente — ver "Article versioning" em backend/AGENTS.md
export interface ArticleRequestDTO extends ArticleBase {
  categoria: string
  autor: string
    imagem_capa: File | null
}

// Resposta do GET — categoria e autor vêm como objetos completos
export interface Article extends ArticleBase {
  id: number
  categoria: Category
  autor: Author
  categorias_relacionadas?: Category[]
  imagens?: ArticleImage[]
  imagem_capa: string | null
  data_publicacao: string
  ultima_atualizacao: string
}

export interface DjangoList<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Token {
  refresh:string,
  access: string
}

export type PatchArticle = Partial<ArticleRequestDTO>
export type PatchAuthor = Partial<AuthorRequestDTO>
export type PatchCategory = Partial<CategoryRequestDTO>

