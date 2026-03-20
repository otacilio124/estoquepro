import Link from "next/link";
import { notFound } from "next/navigation";
import { CarouselService } from "@/services/CarouselService";
import { updateCarouselSlide } from "@/app/admin/carousel/actions";

export const dynamic = "force-dynamic";

type EditCarouselSlidePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCarouselSlidePage({
  params,
}: EditCarouselSlidePageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  
  if (!id || isNaN(id)) {
    notFound();
  }

  const slide = await CarouselService.getSlideById(id);

  if (!slide) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <section className="flex flex-col gap-2 motion-safe:animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-50">Editar Slide</h1>
            <p className="text-sm text-zinc-400">
              Modificando o slide selecionado.
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

      <form action={updateCarouselSlide} className="surface space-y-4 p-6">
        <input type="hidden" name="id" value={slide.id} />
        
        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-300">Titulo *</span>
          <input
            name="title"
            required
            defaultValue={slide.title}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-300">Subtitulo</span>
          <textarea
            name="subtitle"
            rows={2}
            defaultValue={slide.subtitle || ""}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none resize-none"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-300">URL da Imagem *</span>
          <input
            name="image_url"
            required
            defaultValue={slide.image_url}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-zinc-300">Texto do Link</span>
            <input
              name="link_text"
              defaultValue={slide.link_text || ""}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-zinc-300">URL do Link</span>
            <input
              name="link_url"
              defaultValue={slide.link_url || ""}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <label className="block space-y-1 flex-1">
            <span className="text-sm font-medium text-zinc-300">Ordem de Exibicao</span>
            <input
              name="order_index"
              type="number"
              defaultValue={slide.order_index}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            />
          </label>
          <label className="flex flex-col space-y-2 flex-1 items-end justify-center pt-5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-300">Ativo</span>
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={slide.is_active === 1}
                className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/50"
              />
            </div>
          </label>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Salvar Alteracoes
          </button>
        </div>
      </form>
    </div>
  );
}
