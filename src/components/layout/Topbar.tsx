import { Input } from "@/components/ui/Input";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-4">
        <form action="/admin/products" method="get" className="flex-1">
          <label className="relative block">
            <span className="sr-only">Buscar</span>
            <Input
              name="q"
              type="search"
              placeholder="Buscar por produtos, SKUs ou categorias"
              className="pl-4"
            />
          </label>
        </form>
        <div className="flex items-center gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 text-zinc-300 transition hover:border-emerald-400/60 hover:text-emerald-200">
            ?
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 text-zinc-300 transition hover:border-emerald-400/60 hover:text-emerald-200">
            !
          </button>
          <div className="flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1">
            <div className="h-7 w-7 rounded-full bg-zinc-700" />
            <span className="text-xs text-zinc-300">Douglas</span>
          </div>
        </div>
      </div>
    </header>
  );
}
