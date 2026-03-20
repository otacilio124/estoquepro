import { CategoryService } from "@/services/CategoryService";
import { createCategory, deleteCategory } from "@/app/admin/categories/actions";

export const dynamic = "force-dynamic";

type CategoriesPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error;
  const categories = await CategoryService.listCategories();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 motion-safe:animate-fade-up">
        <h1 className="text-2xl font-semibold text-zinc-50">Categorias</h1>
        <p className="text-sm text-zinc-400">
          Crie e mantenha as categorias usadas nos produtos.
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {decodeURIComponent(error)}
        </div>
      ) : null}

      <div className="surface space-y-4 p-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Nova categoria</h2>
          <p className="text-xs text-zinc-500">
            Adicione categorias para organizar o estoque.
          </p>
        </div>
        <form action={createCategory} className="flex flex-col gap-3 sm:flex-row">
          <input
            name="name"
            placeholder="Nome da categoria"
            className="w-full flex-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
          >
            Criar categoria
          </button>
        </form>
      </div>

      <div className="surface divide-y divide-zinc-800/70">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Categorias cadastradas
            </h2>
            <p className="text-xs text-zinc-500">
              Total: {categories.length} categorias
            </p>
          </div>
        </div>
        <div className="divide-y divide-zinc-800/70">
          {categories.length === 0 ? (
            <div className="px-6 py-8 text-sm text-zinc-500">
              Nenhuma categoria cadastrada ainda.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <span className="text-sm text-zinc-200">{category.name}</span>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-500/90 px-3 py-1.5 text-xs font-semibold text-zinc-50 transition hover:bg-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
                  >
                    Remover
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
