import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { AddToCartButton } from "@/components/store/AddToCartButton";
import { BuyNowButton } from "@/components/store/BuyNowButton";
import { ProductImageCarousel } from "@/components/store/ProductImageCarousel";
import { ProductService } from "@/services/ProductService";
import { CommentService } from "@/services/CommentService";
import { authOptions } from "@/lib/auth";
import { createProductComment } from "@/app/(store)/products/[id]/actions";
import { ExpandableDescription } from "@/components/store/ExpandableDescription";

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function StoreProductDetails({
  params,
  searchParams,
}: ProductDetailsPageProps) {
  const { id } = await params;
  const [product, session, comments] = await Promise.all([
    ProductService.getProductById(id),
    getServerSession(authOptions),
    CommentService.listByProductId(id),
  ]);

  if (!product) {
    notFound();
  }

  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : [product.imageUrl ?? "/placeholder.svg"];
  const error = (await searchParams)?.error;

  const description = product.description?.trim().length
    ? product.description
    : "Produto selecionado para oferecer performance e confianca no seu dia a dia. Alta qualidade, durabilidade garantida e suporte dedicado para melhorar sua experiencia em cada uso.";

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Voce tambem pode estar interessado: {product.name.toLowerCase()}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/products" className="text-emerald-300 hover:text-emerald-200">
              Voltar
            </Link>
            <span className="text-zinc-600">/</span>
            <Link href="/products" className="hover:text-emerald-200">
              Produtos
            </Link>
            <span className="text-zinc-600">/</span>
            <span>{product.category}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200">{product.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:border-emerald-400/60 hover:text-emerald-200"
            >
              Compartilhar
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_1fr_0.9fr]">
        {/* Image carousel */}
        <ProductImageCarousel images={images} productName={product.name} />

        {/* Product info */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-emerald-200">
              Novo
            </span>
            <span>+{Math.max(10, product.quantity)} vendidos</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-50">
              {product.name}
            </h1>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              {product.category} · SKU {product.sku}
            </p>
          </div>
          <div className="text-3xl font-semibold text-emerald-300">
            {formatCurrency(product.price)}
          </div>

          {/* Expandable description */}
          <ExpandableDescription text={description} />

          <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4 text-sm text-zinc-400">
            Combine meios de pagamento, Pix e cartao em ate 10x sem juros.
          </div>
          <div className="text-xs text-zinc-500">
            O que voce precisa saber sobre este produto
          </div>
          <div className="grid gap-2 text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Estoque disponivel: {product.quantity} unidades
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Entrega rapida para todo o Brasil
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Garantia de 12 meses com suporte premium
            </div>
          </div>
        </div>

        {/* Purchase box */}
        <aside className="surface space-y-5 p-6">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-emerald-300">
              Chegara gratis
            </div>
            <div className="text-xs text-zinc-500">
              Entrega estimada em ate 3 dias uteis.
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4 text-sm text-zinc-300">
            <div className="font-semibold text-zinc-100">Estoque disponivel</div>
            <div className="mt-1">
              Quantidade: <span className="text-zinc-100">1 unidade</span>
            </div>
            <div className="text-xs text-zinc-500">
              {product.quantity} disponiveis
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <BuyNowButton
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              disabled={product.status === "OUT_OF_STOCK"}
            />
            <AddToCartButton
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              disabled={product.status === "OUT_OF_STOCK"}
            />
          </div>

          <div className="space-y-2 text-xs text-zinc-500">
            <div>Devolucao gratis em ate 30 dias.</div>
            <div>Compra garantida com devolucao facilitada.</div>
            <div>1 ano de garantia de fabrica.</div>
          </div>
        </aside>
      </section>

      <section id="comments" className="surface space-y-6 p-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Comentarios</h2>
          <p className="text-xs text-zinc-500">
            Avaliacoes reais de clientes.
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
            {decodeURIComponent(error)}
          </div>
        ) : null}

        {session ? (
          <form
            action={createProductComment}
            className="space-y-3 rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4"
          >
            <input type="hidden" name="productId" value={product.id} />
            <label className="space-y-1 text-sm">
              <span className="text-zinc-300">
                Comentario como {session.user?.name ?? "cliente"}
              </span>
              <textarea
                name="comment"
                rows={4}
                placeholder="Conte como foi sua experiencia..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
                required
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
            >
              Enviar comentario
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4 text-sm text-zinc-400">
            <Link
              href={`/auth/signin?callbackUrl=/products/${product.id}#comments`}
              className="text-emerald-300 hover:text-emerald-200"
            >
              Entre
            </Link>{" "}
            para comentar e avaliar este produto.
          </div>
        )}

        {comments.length === 0 ? (
          <p className="text-sm text-zinc-400">
            Ainda nao ha comentarios. Seja o primeiro!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between text-xs text-zinc-500">
                  <span>{comment.userName}</span>
                  <span>
                    {new Date(comment.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-300">
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
