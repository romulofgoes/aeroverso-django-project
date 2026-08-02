import { authorService } from '@/services/authorService'
import { articleService } from '@/services/articleService'
import ArticleCard from '@/components/ArticleCard'

export default async function AuthorPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authorId = Number(id)

  const [author, articles] = await Promise.all([
    authorService.getAuthor(authorId),
    articleService.getArticles(1, { autor: authorId }),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold">{author.nome}</h1>
      <p className="text-slate-400 mb-8">{author.profissao}</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.results.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ul>
    </div>
  )
}