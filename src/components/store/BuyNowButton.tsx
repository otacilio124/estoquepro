"use client";

import { useRouter } from "next/navigation";

import { useCart } from "@/components/store/CartContext";

type BuyNowButtonProps = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  disabled?: boolean;
};

export function BuyNowButton({
  id,
  name,
  price,
  imageUrl,
  disabled = false,
}: BuyNowButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleClick = () => {
    if (disabled) {
      return;
    }
    addItem({ id, name, price, imageUrl }, 1);
    router.push("/checkout");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/60"
    >
      {disabled ? "Indisponivel" : "Comprar agora"}
    </button>
  );
}
