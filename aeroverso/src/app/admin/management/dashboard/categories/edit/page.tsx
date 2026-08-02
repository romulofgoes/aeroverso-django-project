import CategoryCardSimplified from '@/components/CategoryCardSimplified'
import { categoryService } from '@/services/categoryService'

export default async function Home() {
  const data = await categoryService.getCategories()
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.results.map((category) => (
          <CategoryCardSimplified key={category.id} category={category} />
        ))}
      </ul>
    </div>
  )
}