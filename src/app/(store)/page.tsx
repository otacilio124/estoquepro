import Link from "next/link";

import { AddToCartButton } from "@/components/store/AddToCartButton";
import { ProductService } from "@/services/ProductService";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const dynamic = "force-dynamic";

export default async function StoreHomePage() {
  const featured = await ProductService.listProducts({ pageSize: 6 });

  return (
    <div className="space-y-12">
      <section className="surface grid gap-6 p-8 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Estoque Store
          </p>
          <h1 className="text-3xl font-semibold text-zinc-50 md:text-4xl">
            Sua loja completa para tecnologia, escritorio e bem-estar.
          </h1>
          <p className="text-sm text-zinc-400">
            Produtos selecionados, estoque atualizado e checkout rapido. Compre
            agora e acompanhe seus pedidos em tempo real.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
            >
              Ver catalogo
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-emerald-400/60"
            >
              Criar conta
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-2xl border border-zinc-800/70 bg-zinc-950/60 p-6">
          <div className="space-y-3 text-center">
            <div className="text-sm uppercase tracking-wide text-zinc-500">
              Entrega rapida
            </div>
            <div className="text-4xl font-semibold text-emerald-300">24h</div>
            <p className="text-xs text-zinc-500">
              Estoque local e despacho agil.
            </p>
          </div>
        </div>
      </section>

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
        <div className="grid gap-4 md:grid-cols-3">
          {featured.items.map((product) => (
            <div key={product.id} className="surface flex flex-col gap-4 p-4">
              <div className="flex h-36 items-center justify-center rounded-xl border border-zinc-800/70 bg-zinc-950/60">
                <img
                  src={product.imageUrl ?? "/placeholder.svg"}
                  alt={product.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-zinc-100">
                  {product.name}
                </div>
                <div className="text-xs text-zinc-400">{product.category}</div>
                <div className="text-sm text-emerald-300">
                  {formatCurrency(product.price)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href={`/products/${product.id}`}
                  className="text-xs text-zinc-400 hover:text-emerald-200"
                >
                  Ver detalhes
                </Link>
                <AddToCartButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  disabled={product.status === "OUT_OF_STOCK"}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
