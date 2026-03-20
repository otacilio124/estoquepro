import { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100",
        "focus:border-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
