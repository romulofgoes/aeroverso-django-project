import { Author, AuthorRequestDTO, DjangoList, PatchAuthor } from '@/types/index'

const BASE_URL = `http://localhost:8000/articles/authors`

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
  postAuthor: async (newAuthor:AuthorRequestDTO, token:string): Promise<Author> => {
    const body = new FormData()
    body.append('nome', newAuthor.nome)
    body.append('profissao', newAuthor.profissao)
    const res = await fetch(`${BASE_URL}`,{

      method:"POST",
      headers: {
        'Authorization':`Bearer ${token}`
      },
      body
    }
    )
    if(!res.ok){
     const errMsg = await res.text();
      throw new Error(errMsg || `Erro ao criar o autor ${newAuthor.nome}`);
    }
    return res.json();
  }
,
updateAuthor: async (id: string, token:string, author:PatchAuthor): Promise<Author> => {
    const body = new FormData();
    Object.entries(author).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(key, value as string | Blob);
      }
    });
    const res = await fetch(`${BASE_URL}/${id}`, {
      method:"PATCH",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body
    });
    if(!res.ok){
      const errMsg = await res.text();
      throw new Error(errMsg || `Erro ao criar o artigo ${id}`);
    }
    return res.json();
  }
}