"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { useCart } from "@/components/store/CartContext";

export function StoreHeader() {
  const { data: session } = useSession();
  const { items } = useCart();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-zinc-50">
          Estoque Store
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-300">
          <Link href="/" className="hover:text-emerald-200">
            Inicio
          </Link>
          <Link href="/products" className="hover:text-emerald-200">
            Produtos
          </Link>
          <Link href="/cart" className="hover:text-emerald-200">
            Carrinho ({totalItems})
          </Link>
          {session ? (
            <>
              <Link href="/account" className="hover:text-emerald-200">
                Minha conta
              </Link>
              {session.user.role === "admin" ? (
                <Link href="/admin" className="hover:text-emerald-200">
                  Admin
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:border-emerald-400/60"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="hover:text-emerald-200">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
