"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Produtos", href: "/admin/products" },
  { label: "Categorias", href: "/admin/categories" },
  { label: "Carrossel", href: "/admin/carousel" },
  { label: "Relatorios", href: "/admin/reports" },
  { label: "Configuracoes", href: "/admin/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-zinc-800/70 lg:bg-zinc-950/80">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
          <span className="text-lg font-bold">E</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-100">Estoque Pro</div>
          <div className="text-xs text-zinc-500">Gestao inteligente</div>
        </div>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
          <Link
            key={item.label}
            href={item.href}
            className={
              isActive
                ? "flex items-center gap-3 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200"
                : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900/70"
            }
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {item.label}
          </Link>
        );
        })}
      </nav>
      <div className="border-t border-zinc-800/70 px-6 py-4 text-xs text-zinc-500">
        v1.0 Academic
      </div>
    </aside>
  );
}
