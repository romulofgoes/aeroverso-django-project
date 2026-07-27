import type {Article, DjangoList} from "@/types";

const BASE_URL = "http://localhost:8000/articles/articles"; //endpoint no django REST framework

export const articleService = {
    getArticles: async (page=1): Promise<DjangoList<Article>> => {
        const res = await fetch(`${BASE_URL}?page=${page}`);
        if (!res.ok) throw new Error("Erro ao buscar artigos.");
        return res.json();
    },
    getArticle: async (id: number): Promise<Article> => {
        const res = await fetch(`${BASE_URL}/${id}`);
        if(!res.ok) throw new Error(`Erro ao buscar o artigo com id=${id}`);        
        return res.json();
    }

}