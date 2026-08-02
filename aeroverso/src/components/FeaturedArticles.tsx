import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/types/index'
import CategoryLink from './CategoryLink'

export default function FeaturedArticle({ article }: { article: Article }) {
  return (
    <div className="mb-12">
      <Link href={`/articles/${article.id}`} className="block group">
        <div className="relative w-full aspect-21/9 rounded-lg overflow-hidden mb-4">
          <Image
            src={article.imagem_capa || '/file.svg'}
            alt={article.titulo}
            fill
            priority
            className="object-cover"
          />
        </div>
      </Link>
      <CategoryLink category={article.categoria} />
      <Link href={`/articles/${article.id}`}>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 leading-tight hover:text-cyan-glow transition-colors">
          {article.titulo}
        </h1>
      </Link>
      <p className="text-slate-400 mt-2 text-lg">{article.descricao_meta}</p>
    </div>
  )
}