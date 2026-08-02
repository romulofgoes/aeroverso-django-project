import CreateArticle from "@/components/CreateArticle";
import { authorService } from "@/services/authorService";
import { categoryService } from "@/services/categoryService";

export default async function CreateArticlePage() {
    const autores = await authorService.getAuthors()
    const categorias = await categoryService.getCategories()
    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <CreateArticle authors={autores.results} categories={categorias.results} />
        </div>
    );
}
