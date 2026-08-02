import { authorService } from '@/services/authorService'
import Link from 'next/link'

export default async function AuthorsPage() {
  const data = await authorService.getAuthors()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Autores</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.results.map((author) => (
          <li key={author.id}>
            <Link
              href={`/authors/${author.id}`}
              className="block border border-navy-700 rounded-lg p-6 hover:border-cyan-glow transition-colors"
            >
              <h2 className="font-display text-lg font-bold">{author.nome}</h2>
              <p className="text-slate-400 text-sm">{author.profissao}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}