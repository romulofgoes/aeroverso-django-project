import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
      <Link href="/" className="flex items-center gap-2 group">
        <Logo className="w-5 h-5 text-cyan-glow" />
        <span className="font-display font-semibold text-slate-300 group-hover:text-cyan-glow transition-colors">
          Aeroverso
        </span>
      </Link>
      <p>
        © {year} Aeroverso — código aberto sob licença{' '}
        
        <a href="https://opensource.org/license/mit/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-cyan-glow"
        >
          MIT
        </a>
      </p>
    </div>
  )
}