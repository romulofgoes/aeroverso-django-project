import Link from "next/link";

const managementLinks = [
    {
        href: "/admin/management/dashboard/articles",
        title: "Artigos",
        description: "Criar um novo artigo do blog.",
    },
    {
        href: "/admin/management/dashboard/authors",
        title: "Autores",
        description: "Cadastrar um novo autor.",
    },
    {
        href: "/admin/management/dashboard/categories",
        title: "Categorias",
        description: "Cadastrar uma nova categoria.",
    },
    {
        href: "/admin/management/dashboard/articles/edit",
        title: "Artigo-Editar",
        description: "Editar artigo.",
    },
    {
        href: "/admin/management/dashboard/authors/edit",
        title: "Autor-Editar",
        description: "Editar autor.",
    },
    {
        href: "/admin/management/dashboard/categories/edit",
        title: "Categoria-Editar",
        description: "Editar categoria.",
    },

]

export default function Dashboard() {
    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Painel de Administração</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {managementLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="block bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-blue-400 transition-all"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">{link.title}</h2>
                        <p className="text-sm text-gray-500">{link.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
