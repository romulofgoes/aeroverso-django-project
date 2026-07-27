import { articleService } from '@/services/articleService'
import { Article } from '@/types/index'

export default async function Page() {
    const articles = await articleService.getArticles()
    console.log(articles)
    return (
        <ul>
        {articles.results.map((article: Article) => (
            <li key={article.id}>
            <h1>{article.autor.nome}</h1>
            </li>
        ))}
        </ul>
    )
}