import { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100",
        "placeholder:text-zinc-500 focus:border-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/20",
        className
      )}
      {...props}
    />
  );
}
