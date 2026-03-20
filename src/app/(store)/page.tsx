import Link from "next/link";

import { HeroCarousel } from "@/components/store/HeroCarousel";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductService } from "@/services/ProductService";
import { CarouselService } from "@/services/CarouselService";

export const dynamic = "force-dynamic";

export default async function StoreHomePage() {
  const featured = await ProductService.listProducts({ pageSize: 6 });
  const slides = await CarouselService.listSlides(true);

  return (
    <div className="space-y-12">
      <HeroCarousel slides={slides} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Destaques</h2>
            <p className="text-sm text-zinc-400">
              Itens recomendados para sua empresa.
            </p>
          </div>
          <Link href="/products" className="text-sm text-emerald-300">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {featured.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

