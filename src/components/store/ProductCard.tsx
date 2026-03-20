import Link from "next/link";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { StopPropagationWrapper } from "@/components/store/StopPropagationWrapper";
import { ProductView } from "@/services/ProductService";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export function ProductCard({ product }: { product: ProductView }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="surface group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/60 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)] hover:-translate-y-1"
    >
      <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
        <img
          src={product.imageUrl ?? "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.status === "OUT_OF_STOCK" && (
          <span className="absolute right-3 top-3 rounded-full bg-zinc-900/80 px-2 py-0.5 text-xs font-semibold text-rose-400 ring-1 ring-rose-500/40 backdrop-blur-sm">
            Indisponível
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {product.category}
          </p>
          <h2 className="mt-0.5 text-sm font-semibold text-zinc-100 group-hover:text-emerald-300 transition-colors">
            {product.name}
          </h2>
        </div>

        <p className="text-lg font-semibold text-emerald-400">
          {formatCurrency(product.price)}
        </p>

        <div className="mt-auto flex flex-col items-center gap-2">
          <StopPropagationWrapper className="w-full">
            <AddToCartButton
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              disabled={product.status === "OUT_OF_STOCK"}
            />
          </StopPropagationWrapper>
        </div>
      </div>
    </Link>
  );
}
