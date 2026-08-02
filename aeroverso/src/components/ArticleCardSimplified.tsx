import Link from 'next/link'
import { Article } from '@/types/index'
import CategoryLink from './CategoryLink'

export default function ArticleCard({ article }: { article: Article }) {

  return (
    <li className="border border-navy-700 rounded-lg overflow-hidden bg-navy-900">
      <div className="p-4">
        <CategoryLink category={article.categoria} />
        <Link href={`/admin/management/dashboard/articles/edit/${article.id}`}>
          <h2 className="font-display text-lg font-bold mt-2 hover:text-cyan-glow transition-colors">
            {article.titulo}
          </h2>
        </Link>
        <p className="text-slate-400 text-sm mt-1">{article.descricao_meta}</p>
      </div>
    </li>
  )
}