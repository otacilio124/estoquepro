import Link from "next/link";
import { createCarouselSlide } from "@/app/admin/carousel/actions";

export default function NewCarouselSlidePage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <section className="flex flex-col gap-2 motion-safe:animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-50">Novo Slide</h1>
            <p className="text-sm text-zinc-400">
              Adicione um novo slide ao carrossel.
            </p>
          </div>
          <Link
            href="/admin/carousel"
            className="text-sm text-zinc-400 hover:text-zinc-200"
          >
            Voltar
          </Link>
        </div>
      </section>

      <form action={createCarouselSlide} className="surface space-y-4 p-6">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-300">Titulo *</span>
          <input
            name="title"
            required
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            placeholder="Ex: Oferta Especial"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-300">Subtitulo</span>
          <textarea
            name="subtitle"
            rows={2}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none resize-none"
            placeholder="Descricao curta para o slide..."
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-300">URL da Imagem *</span>
          <input
            name="image_url"
            required
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            placeholder="/placeholder.svg"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-zinc-300">Texto do Link</span>
            <input
              name="link_text"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
              placeholder="Ex: Comprar"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-zinc-300">URL do Link</span>
            <input
              name="link_url"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
              placeholder="Ex: /products/123"
            />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-300">Ordem de Exibicao</span>
          <input
            name="order_index"
            type="number"
            defaultValue={0}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
          />
        </label>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Salvar Slide
          </button>
        </div>
      </form>
    </div>
  );
}
