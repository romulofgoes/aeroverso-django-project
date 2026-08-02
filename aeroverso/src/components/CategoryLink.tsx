import Link from 'next/link'
import { Category } from '@/types/index'

export default function CategoryLink({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className="font-display text-sm uppercase tracking-widest text-cyan-glow hover:underline"
    >
      {category.tipo}
    </Link>
  )
}