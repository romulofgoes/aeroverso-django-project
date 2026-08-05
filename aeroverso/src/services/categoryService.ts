import { apiClient } from '@/lib/apiClient';
import { Category, CategoryRequestDTO, DjangoList, PatchCategory } from '@/types/index'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

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
  postCategory: async (newCategory:CategoryRequestDTO) => {
    const body = new FormData();
    body.append('tipo', newCategory.tipo);
    body.append('descricao_meta', newCategory.descricao_meta);
    await apiClient.request(`${BASE_URL}`, {
      method:"POST",
      body
    });
  },
  updateCategory: async (id: string, category:PatchCategory) => {
      const body = new FormData();
      Object.entries(category).forEach(([key, value]) => {
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