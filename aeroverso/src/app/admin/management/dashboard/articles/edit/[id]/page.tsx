import EditArticle from "@/components/EditArticle";
import { articleService } from "@/services/articleService";
import { authorService } from "@/services/authorService";
import { categoryService } from "@/services/categoryService";

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  const autores = await authorService.getAuthors()
  const categorias = await categoryService.getCategories()
  const article = await articleService.getArticle(id)
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <EditArticle authors={autores.results} categories={categorias.results} article={article} />
    </div>
  );
}
