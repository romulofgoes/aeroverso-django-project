import { articleService } from '@/services/articleService'
import { categoryService } from '@/services/categoryService'
import ArticleCard from '@/components/ArticleCard'
import { notFound } from 'next/navigation'

export default async function CategoryPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const  resolvedParams  = await params
  const categoryId = Number(resolvedParams.id)

  const [category, articles] = await Promise.all([
    categoryService.getCategory(categoryId),
    articleService.getArticles(1, { categoria: categoryId }),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">{category.tipo}</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.results.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ul>
    </div>
  )
}