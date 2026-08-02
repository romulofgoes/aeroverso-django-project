import Link from 'next/link'
import { Category } from '@/types/index'

export default function ArticleCard({ category }: { category: Category }) {

  return (
    <li className="border border-navy-700 rounded-lg overflow-hidden bg-navy-900">
      <div className="p-4">
        <Link href={`edit/${category.id}`}>
          <h2 className="font-display text-lg font-bold mt-2 hover:text-cyan-glow transition-colors">
            {category.tipo}
          </h2>
        </Link>
        <p className="text-slate-400 text-sm mt-1">{category.descricao_meta}</p>
      </div>
    </li>
  )
}