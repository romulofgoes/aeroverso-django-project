import { categoryService } from '@/services/categoryService'
import Link from 'next/link'

export default async function CategoriesPage() {
  const data = await categoryService.getCategories()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Categorias</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {data.results.map((category) => (
          <li key={category.id}>
            <Link
              href={`/categories/${category.id}`}
              className="block text-center border border-navy-700 rounded-lg py-6 hover:border-cyan-glow hover:text-cyan-glow transition-colors"
            >
              {category.tipo}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}