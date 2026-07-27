import { useState, useEffect } from 'react';
import { Article } from '@/types';
import { articleService } from '@/services/articleService'

export function useArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);

    const fetchArticles = async () => {
        try {
            const data = await articleService.getArticles(page);    
            setArticles(data.results);
            setLoading(false);
        }catch (e){
            setError("Não foi possível carregar os artigos.")
            setLoading(true)
        }
    }
    useEffect(() => { fetchArticles(); }, [page]);

    return { articles, loading, error, page };
}

