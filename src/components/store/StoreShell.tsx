import { ReactNode } from "react";

import { StoreHeader } from "@/components/store/StoreHeader";

export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <StoreHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
