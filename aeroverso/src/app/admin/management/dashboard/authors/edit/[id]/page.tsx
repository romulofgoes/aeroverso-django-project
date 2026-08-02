import EditAuthor from "@/components/EditAuthor";
import { authorService } from "@/services/authorService";

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  const author = await authorService.getAuthor(id)
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <EditAuthor author={author} />
    </div>
  );
}
