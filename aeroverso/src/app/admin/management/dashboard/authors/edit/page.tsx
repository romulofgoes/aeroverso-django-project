import AuthorCardSimplified from '@/components/AuthorCardSimplified'
import { authorService } from '@/services/authorService'

export default async function Home() {
  const data = await authorService.getAuthors()
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.results.map((author) => (
          <AuthorCardSimplified key={author.id} author={author} />
        ))}
      </ul>
    </div>
  )
}