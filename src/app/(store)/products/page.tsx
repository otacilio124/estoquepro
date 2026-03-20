import Link from "next/link";

import { ProductCard } from "@/components/store/ProductCard";
import { ProductService } from "@/services/ProductService";

export const dynamic = "force-dynamic";

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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
