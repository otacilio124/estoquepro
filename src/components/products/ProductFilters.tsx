import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export type ProductFilterValues = {
  query?: string;
  category?: string;
  status?: string;
};

type ProductFiltersProps = {
  categories: string[];
  values: ProductFilterValues;
};

export function ProductFilters({ categories, values }: ProductFiltersProps) {
  return (
    <form
      method="get"
      className="surface flex flex-col gap-4 p-4 motion-safe:animate-fade-up lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="grid w-full gap-3 lg:grid-cols-[2fr_1fr_1fr]">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Buscar produto
          </span>
          <Input
            name="q"
            type="search"
            placeholder="Buscar por nome, SKU ou categoria"
            defaultValue={values.query ?? ""}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Categoria
          </span>
          <Select name="category" defaultValue={values.category ?? ""}>
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Status
          </span>
          <Select name="status" defaultValue={values.status ?? ""}>
            <option value="">Todos</option>
            <option value="IN_STOCK">Em estoque</option>
            <option value="LOW_STOCK">Estoque baixo</option>
            <option value="OUT_OF_STOCK">Sem estoque</option>
          </Select>
        </label>
      </div>
      <div className="flex w-full flex-wrap justify-end gap-2 lg:w-auto">
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/30"
        >
          Limpar
        </Link>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
        >
          Adicionar produto
        </Link>
      </div>
    </form>
  );
}
