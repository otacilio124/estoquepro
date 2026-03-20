import { ProductForm } from "@/components/products/ProductForm";
import { createProduct } from "@/app/admin/products/actions";
import { ProductService } from "@/services/ProductService";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await ProductService.listCategories();
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-50">
          Novo produto
        </h1>
        <p className="text-sm text-zinc-400">
          Cadastre itens com descricao, categoria e nivel de estoque.
        </p>
      </section>
      <ProductForm mode="create" action={createProduct} categories={categories} />
    </div>
  );
}
