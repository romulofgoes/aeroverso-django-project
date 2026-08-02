import { Category, CategoryRequestDTO, DjangoList, PatchCategory } from '@/types/index'

const BASE_URL = `http://localhost:8000/articles/categories`;

export const categoryService = {
  getCategories: async (): Promise<DjangoList<Category>> => {
    const res = await fetch(`${BASE_URL}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erro ao buscar categorias.');
    return res.json();
  },
  getCategory: async (id: number): Promise<Category> => {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Erro ao buscar categoria com id=${id}`);
    return res.json();
  },
  postCategory: async (newCategory:CategoryRequestDTO, token:string): Promise<Category> => {
    const body = new FormData();
    body.append('tipo', newCategory.tipo);
    body.append('descricao_meta', newCategory.descricao_meta);
    const res = await fetch(`${BASE_URL}`, {
      method:"POST",
      headers:{
        'Authorization':`Bearer ${token}`
      },
      body
    });
    if(!res.ok){
      throw new Error("Problema ao enviar dados da nova categoria criada.");
    }
    return res.json();
  },
  updateCategory: async (id: string, token:string, category:PatchCategory): Promise<Category> => {
      const body = new FormData();
      Object.entries(category).forEach(([key, value]) => {
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