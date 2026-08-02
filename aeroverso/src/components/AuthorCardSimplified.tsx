import Link from 'next/link'
import { Author } from '@/types/index'

export default function ArticleCard({ author }: { author: Author }) {

  return (
    <li className="border border-navy-700 rounded-lg overflow-hidden bg-navy-900">
      <div className="p-4">
        <Link href={`edit/${author.id}`}>
          <h2 className="font-display text-lg font-bold mt-2 hover:text-cyan-glow transition-colors">
            {author.nome}
          </h2>
        </Link>
        <p className="text-slate-400 text-sm mt-1">{author.profissao}</p>
      </div>
    </li>
  )
}