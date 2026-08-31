import Image from 'next/image'
import Link from 'next/link'
import { articleService } from '@/services/articleService'
import type { Metadata } from 'next'


type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const article = await articleService.getArticle(Number(id))

  return {
    title: article.titulo,
    description: article.descricao_meta,
    openGraph: {
      title: article.titulo,
      description: article.descricao_meta,
      url: `https://aeroverso.com.br/articles/${article.id}`,
      siteName: 'Aeroverso',
      images: [
        {
          url: article.imagem_capa || 'https://aeroverso.com.br/og-image.jpg',
          width: 1200,
          height: 630,
          alt: article.titulo,
        },
      ],
      locale: 'pt_BR',
      type: 'article',
    },
  }
}

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  const article = await articleService.getArticle(id)

  return (
    // max-w-3xl: limita a largura do texto pra ficar confortável de ler (linhas não muito longas)
    // mx-auto: centraliza a coluna na tela
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Categoria como "etiqueta" — usa a fonte display e a cor de destaque ciano */}
        <p className="font-display text-sm uppercase tracking-widest text-cyan-glow mb-3">    
            {article.categoria.tipo}
        </p>

        {/* Título principal — fonte display, grande, forte */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-3">
            {article.titulo}
        </h1>

        {/* Subtítulo — mais claro/discreto que o título, pra não competir com ele */}
        <h2 className="text-lg text-slate-400 mb-6">
            {article.subtitulo}
        </h2>

        {/* Autor e data */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href={`/authors/${article.autor.id}`} className="hover:text-cyan-glow transition-colors">
                {article.autor.nome}
            </Link>
            <span aria-hidden="true">•</span>
            <time dateTime={article.data}>
                {new Date(article.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </time>
        </div>
            {/* Imagem de capa — aspect-video mantém proporção 16:9 responsiva */}
        <div className="relative w-full aspect-video mb-10 rounded-lg overflow-hidden border border-navy-700">
            <Image
            src={article.imagem_capa || "/file.svg"}
            alt={article.titulo}
            fill
            className="object-cover"
            priority
            />
        </div>


        {/* Corpo do texto — fonte de leitura (Inter), espaçamento generoso entre linhas */}
        <div className="font-body text-base sm:text-lg leading-relaxed text-slate-200 whitespace-pre-line">
            {article.conteudo}
        </div>

    </article>
  )
}