"use client";

import { useState } from "react";

import { useCart } from "@/components/store/CartContext";

type AddToCartButtonProps = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  disabled?: boolean;
};

export function AddToCartButton({
  id,
  name,
  price,
  imageUrl,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (disabled) {
      return;
    }
    addItem({ id, name, price, imageUrl }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/60"
    >
      {disabled ? "Indisponível" : added ? "✓ Adicionado!" : "Adicionar ao carrinho"}
    </button>
  );
}
