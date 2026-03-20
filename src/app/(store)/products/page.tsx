import Link from "next/link";

import { AddToCartButton } from "@/components/store/AddToCartButton";
import { StopPropagationWrapper } from "@/components/store/StopPropagationWrapper";
import { ProductService } from "@/services/ProductService";

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const normalizePage = (value?: string) => {
  const parsed = Number(value ?? "1");
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }
  return Math.floor(parsed);
};

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
};

export default async function StoreProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const category = resolvedSearchParams?.category?.trim() ?? "";
  const page = normalizePage(resolvedSearchParams?.page);

  const [productResult, categories] = await Promise.all([
    ProductService.listProducts({
      query: query || undefined,
      category: category || undefined,
      page,
      pageSize: 12,
    }),
    ProductService.listCategories(),
  ]);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-50">Produtos</h1>
        <p className="text-sm text-zinc-400">
          Explore nosso catalogo completo e escolha seus favoritos.
        </p>
      </section>

      <form method="get" className="surface flex flex-col gap-4 p-4 md:flex-row md:items-end">
        <label className="flex-1 space-y-1 text-xs uppercase tracking-wide text-zinc-400">
          Buscar
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar por produto"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <label className="space-y-1 text-xs uppercase tracking-wide text-zinc-400">
          Categoria
          <select
            name="category"
            defaultValue={category}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          Filtrar
        </button>
      </form>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {productResult.items.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="surface group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/60 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)] hover:-translate-y-1"
          >
            {/* Image area – covers the full width */}
            <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
              <img
                src={product.imageUrl ?? "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.status === "OUT_OF_STOCK" && (
                <span className="absolute right-3 top-3 rounded-full bg-zinc-900/80 px-2 py-0.5 text-xs font-semibold text-rose-400 ring-1 ring-rose-500/40 backdrop-blur-sm">
                  Indisponível
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {product.category}
                </p>
                <h2 className="mt-0.5 text-sm font-semibold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                  {product.name}
                </h2>
              </div>

              <p className="text-lg font-semibold text-emerald-400">
                {formatCurrency(product.price)}
              </p>

              {/* Action buttons – centered */}
              <div className="mt-auto flex flex-col items-center gap-2">
                <StopPropagationWrapper className="w-full">
                  <AddToCartButton
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    disabled={product.status === "OUT_OF_STOCK"}
                  />
                </StopPropagationWrapper>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
