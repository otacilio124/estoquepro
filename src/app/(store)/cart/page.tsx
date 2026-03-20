"use client";

import Link from "next/link";

import { useCart } from "@/components/store/CartContext";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function CartPage() {
  const { items, total, updateItem, removeItem } = useCart();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-50">Carrinho</h1>

      {items.length === 0 ? (
        <div className="surface p-6 text-sm text-zinc-400">
          Seu carrinho esta vazio.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="surface flex flex-wrap items-center gap-4 p-4">
              <img
                src={item.imageUrl ?? "/placeholder.svg"}
                alt={item.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-100">{item.name}</div>
                <div className="text-xs text-zinc-400">
                  {formatCurrency(item.price)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateItem(item.id, item.quantity - 1)}
                  className="rounded-lg border border-zinc-800 px-2 py-1 text-xs text-zinc-300"
                >
                  -
                </button>
                <span className="text-sm text-zinc-100">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateItem(item.id, item.quantity + 1)}
                  className="rounded-lg border border-zinc-800 px-2 py-1 text-xs text-zinc-300"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-xs text-rose-300 hover:text-rose-200"
              >
                Remover
              </button>
            </div>
          ))}

          <div className="surface flex items-center justify-between p-4">
            <span className="text-sm text-zinc-400">Total</span>
            <span className="text-lg font-semibold text-emerald-300">
              {formatCurrency(total)}
            </span>
          </div>

          <div className="flex justify-end">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
            >
              Finalizar compra
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
