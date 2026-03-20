import { notFound } from "next/navigation";

import { ProductForm } from "@/components/products/ProductForm";
import { ProductService } from "@/services/ProductService";
import { updateProduct } from "@/app/admin/products/actions";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    ProductService.getProductById(id),
    ProductService.listCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-50">
          Editar produto
        </h1>
        <p className="text-sm text-zinc-400">
          Ajuste valores e mantenha o estoque atualizado.
        </p>
      </section>
      <ProductForm
        mode="edit"
        defaultValues={product}
        action={updateProductWithId}
        categories={categories}
      />
    </div>
  );
}
