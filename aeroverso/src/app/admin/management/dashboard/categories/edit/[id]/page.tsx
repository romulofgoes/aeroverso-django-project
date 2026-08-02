import EditCategory from "@/components/EditCategory";
import { categoryService } from "@/services/categoryService";

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  const category = await categoryService.getCategory(id)
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <EditCategory category={category} />
    </div>
  );
}
