import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { ProductService } from "@/services/ProductService";

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const linkSecondaryClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/30";

const linkPrimaryClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40";

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;
  const product = await ProductService.getProductById(id);

  if (!product) {
    notFound();
  }

  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : [product.imageUrl ?? "/placeholder.svg"];

  const statusLabel =
    product.status === "IN_STOCK"
      ? { label: "Em estoque", variant: "success" as const }
      : product.status === "LOW_STOCK"
      ? { label: "Estoque baixo", variant: "warning" as const }
      : { label: "Sem estoque", variant: "danger" as const };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 motion-safe:animate-fade-up">
        <h1 className="text-2xl font-semibold text-zinc-50">
          Detalhes do produto
        </h1>
        <p className="text-sm text-zinc-400">
          Visualize informacoes e a situacao atual do estoque.
        </p>
      </section>

      <div className="surface grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-center rounded-2xl border border-zinc-800/70 bg-zinc-950/60 p-6">
            <img
              src={images[0]}
              alt={product.name}
              className="h-40 w-40 rounded-xl object-cover"
            />
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="flex items-center justify-center rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-2"
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            Produto
          </div>
          <div className="text-xl font-semibold text-zinc-100">
            {product.name}
          </div>
          <div className="text-sm text-zinc-400">SKU: {product.sku}</div>
          <Badge variant={statusLabel.variant}>{statusLabel.label}</Badge>
        </div>

        <div className="space-y-1 md:col-span-2">
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            Descricao
          </div>
          <p className="text-sm text-zinc-300">
            {product.description?.trim().length
              ? product.description
              : "Nenhuma descricao informada."}
          </p>
        </div>

        <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Categoria
            </div>
            <div className="text-sm text-zinc-200">{product.category}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Preco unitario
            </div>
            <div className="text-sm text-zinc-200">
              {formatCurrency(product.price)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Quantidade
            </div>
            <div className="text-sm text-zinc-200">
              {product.quantity} unidades
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products" className={linkSecondaryClasses}>
          Voltar
        </Link>
        <Link
          href={`/admin/products/${product.id}/edit`}
          className={linkPrimaryClasses}
        >
          Editar
        </Link>
      </div>
    </div>
  );
}
