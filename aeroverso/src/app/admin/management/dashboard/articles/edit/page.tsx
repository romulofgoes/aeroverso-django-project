import { articleService } from '@/services/articleService'
import ArticleCardSimplified from '@/components/ArticleCardSimplified'

export default async function Home() {
  const data = await articleService.getArticles(1)
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.results.map((article) => (
          <ArticleCardSimplified key={article.id} article={article} />
        ))}
      </ul>
    </div>
  )
}