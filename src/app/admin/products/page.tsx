import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductService, StockStatus } from "@/services/ProductService";

export const dynamic = "force-dynamic";

const normalizeStatus = (value?: string): StockStatus | undefined => {
  if (value === "IN_STOCK" || value === "LOW_STOCK" || value === "OUT_OF_STOCK") {
    return value;
  }
  return undefined;
};

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
    status?: string;
    page?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const category = resolvedSearchParams?.category?.trim() ?? "";
  const status = normalizeStatus(resolvedSearchParams?.status);
  const page = normalizePage(resolvedSearchParams?.page);

  const [productResult, categories] = await Promise.all([
    ProductService.listProducts({
      query: query || undefined,
      category: category || undefined,
      status,
      page,
      pageSize: 8,
    }),
    ProductService.listCategories(),
  ]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 motion-safe:animate-fade-up">
        <h1 className="text-2xl font-semibold text-zinc-50">Produtos</h1>
        <p className="text-sm text-zinc-400">
          Gerencie o catalogo completo, fotos e niveis de estoque.
        </p>
      </section>

      <ProductFilters
        categories={categories}
        values={{ query, category, status }}
      />

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Lista de produtos
            </h2>
            <p className="text-xs text-zinc-500">
              Atualizado em tempo real via SQLite
            </p>
          </div>
          <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
            {productResult.total} itens
          </div>
        </div>
        <ProductTable
          products={productResult.items}
          totalCount={productResult.total}
          page={productResult.page}
          pageSize={productResult.pageSize}
          totalPages={productResult.totalPages}
          query={{ query, category, status }}
        />
      </section>
    </div>
  );
}
