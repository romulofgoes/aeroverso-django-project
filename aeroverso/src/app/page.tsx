import { articleService } from '@/services/articleService'
import FeaturedArticle from '@/components/FeaturedArticles'
import ArticleCard from '@/components/ArticleCard'

export default async function Home() {
  const data = await articleService.getArticles(1)
  const [destaque, ...secundarios] = data.results

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {destaque && <FeaturedArticle article={destaque} />}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {secundarios.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ul>
    </div>
  )
}