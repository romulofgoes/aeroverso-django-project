import Link from 'next/link'
import Logo from './Logo'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/categories', label: 'Categorias' },
  { href: '/authors', label: 'Autores' },
]

export default function Navbar() {
  return (
    <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 group">
        <Logo className="w-7 h-7 text-cyan-glow" />
        <span className="font-display text-lg font-bold tracking-tight group-hover:text-cyan-glow transition-colors">
          Aeroverso
        </span>
      </Link>

      <ul className="flex items-center gap-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-300 hover:text-cyan-glow transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}