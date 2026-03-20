import Link from "next/link";
import { CarouselService } from "@/services/CarouselService";
import { deleteCarouselSlide, toggleCarouselSlideActive } from "@/app/admin/carousel/actions";

export const dynamic = "force-dynamic";

export default async function CarouselAdminPage() {
  const slides = await CarouselService.listSlides(false);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 motion-safe:animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-50">Carrossel</h1>
            <p className="text-sm text-zinc-400">
              Gerencie os slides exibidos na pagina inicial.
            </p>
          </div>
          <Link
            href="/admin/carousel/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Novo Slide
          </Link>
        </div>
      </section>

      <div className="surface divide-y divide-zinc-800/70">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Slides cadastrados
            </h2>
            <p className="text-xs text-zinc-500">
              Total: {slides.length} slides
            </p>
          </div>
        </div>
        <div className="divide-y divide-zinc-800/70">
          {slides.length === 0 ? (
            <div className="px-6 py-8 text-sm text-zinc-500">
              Nenhum slide cadastrado ainda.
            </div>
          ) : (
            slides.map((slide) => (
              <div
                key={slide.id}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-lg bg-zinc-900 shrink-0">
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-200 line-clamp-1">
                      {slide.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      Ordem: {slide.order_index} | Ativo:{" "}
                      <span
                        className={
                          slide.is_active ? "text-emerald-400" : "text-rose-400"
                        }
                      >
                        {slide.is_active ? "Sim" : "Nao"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <form action={toggleCarouselSlideActive}>
                    <input type="hidden" name="id" value={slide.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-700"
                    >
                      {slide.is_active ? "Desativar" : "Ativar"}
                    </button>
                  </form>
                  <Link
                    href={`/admin/carousel/${slide.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-700"
                  >
                    Editar
                  </Link>
                  <form action={deleteCarouselSlide}>
                    <input type="hidden" name="id" value={slide.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg bg-rose-500/90 px-3 py-1.5 text-xs font-semibold text-zinc-50 transition hover:bg-rose-400"
                    >
                      Remover
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
