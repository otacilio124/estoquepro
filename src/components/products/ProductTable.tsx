import Link from "next/link";

import { ProductView, StockStatus } from "@/services/ProductService";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { deleteProduct } from "@/app/admin/products/actions";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  StockStatus,
  { label: string; variant: "success" | "warning" | "danger" }
> = {
  IN_STOCK: { label: "Em estoque", variant: "success" },
  LOW_STOCK: { label: "Estoque baixo", variant: "warning" },
  OUT_OF_STOCK: { label: "Sem estoque", variant: "danger" },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const linkSecondaryClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900/70 px-3 py-1.5 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/30";

const linkGhostClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/30";

const paginationLinkClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/30";

type ProductTableProps = {
  products: ProductView[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  query: {
    query?: string;
    category?: string;
    status?: string;
  };
};

const buildHref = (
  page: number,
  query: ProductTableProps["query"]
): string => {
  const params = new URLSearchParams();

  if (query.query) {
    params.set("q", query.query);
  }

  if (query.category) {
    params.set("category", query.category);
  }

  if (query.status) {
    params.set("status", query.status);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const qs = params.toString();
  return qs ? `/admin/products?${qs}` : "/admin/products";
};

export function ProductTable({
  products,
  totalCount,
  page,
  pageSize,
  totalPages,
  query,
}: ProductTableProps) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="surface overflow-hidden motion-safe:animate-fade-in">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-950/60 text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-6 py-3">Foto</th>
              <th className="px-6 py-3">Produto</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Preco</th>
              <th className="px-6 py-3">Quantidade</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/70">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-zinc-400"
                >
                  Nenhum produto encontrado com os filtros atuais.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const status = statusConfig[product.status];

                return (
                  <tr
                    key={product.id}
                    className="transition hover:bg-zinc-900/60"
                  >
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-950/60">
                        <img
                          src={product.imageUrl ?? "/placeholder.svg"}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-100">
                        {product.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        SKU: {product.sku}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-200">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-zinc-200">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 text-zinc-200">
                      {product.quantity} unidades
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className={linkSecondaryClasses}
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className={linkGhostClasses}
                        >
                          Detalhes
                        </Link>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <Button type="submit" variant="danger">
                            Excluir
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/70 px-6 py-4 text-xs text-zinc-500">
        <span>
          Mostrando {start} a {end} de {totalCount} resultados
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={buildHref(page - 1, query)}
            className={cn(
              paginationLinkClasses,
              page === 1 && "pointer-events-none opacity-40"
            )}
            aria-disabled={page === 1}
          >
            Anterior
          </Link>
          <span className="text-xs text-zinc-400">
            Pagina {page} de {totalPages}
          </span>
          <Link
            href={buildHref(page + 1, query)}
            className={cn(
              paginationLinkClasses,
              page === totalPages && "pointer-events-none opacity-40"
            )}
            aria-disabled={page === totalPages}
          >
            Proxima
          </Link>
        </div>
      </div>
    </div>
  );
}
