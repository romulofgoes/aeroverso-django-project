import Link from "next/link";

const icons = {
    article: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    author: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    category: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M3 11l8-8h6a2 2 0 012 2v6l-8 8a2 2 0 01-2.828 0l-5.172-5.172a2 2 0 010-2.828z" />
    ),
}

function Icon({ name }: { name: keyof typeof icons }) {
    return (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {icons[name]}
        </svg>
    )
}

const createLinks = [
    { href: "/admin/management/dashboard/articles", title: "Artigos", description: "Criar um novo artigo do blog.", icon: "article" as const },
    { href: "/admin/management/dashboard/authors", title: "Autores", description: "Cadastrar um novo autor.", icon: "author" as const },
    { href: "/admin/management/dashboard/categories", title: "Categorias", description: "Cadastrar uma nova categoria.", icon: "category" as const },
]

const editLinks = [
    { href: "/admin/management/dashboard/articles/edit", title: "Editar Artigos", description: "Alterar um artigo existente.", icon: "article" as const },
    { href: "/admin/management/dashboard/authors/edit", title: "Editar Autores", description: "Alterar um autor existente.", icon: "author" as const },
    { href: "/admin/management/dashboard/categories/edit", title: "Editar Categorias", description: "Alterar uma categoria existente.", icon: "category" as const },
]

function LinkGrid({ links }: { links: typeof createLinks }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="block bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-blue-400 transition-all"
                >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                        <Icon name={link.icon} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{link.title}</h3>
                    <p className="text-sm text-gray-500">{link.description}</p>
                </Link>
            ))}
        </div>
    )
}

export default function Dashboard() {
    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Painel de Administração</h1>
                <p className="text-sm text-slate-400 mt-1">Gerencie o conteúdo do blog.</p>
            </div>

            <section className="mb-10">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Criar novo</h2>
                <LinkGrid links={createLinks} />
            </section>

            <section>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Editar existente</h2>
                <LinkGrid links={editLinks} />
            </section>
        </div>
    );
}
