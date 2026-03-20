import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 focus-visible:ring-emerald-400/40",
  secondary:
    "bg-zinc-900/70 text-zinc-100 hover:bg-zinc-800/80 focus-visible:ring-zinc-400/30",
  ghost:
    "bg-transparent text-zinc-200 hover:bg-zinc-800/60 focus-visible:ring-zinc-500/30",
  danger:
    "bg-rose-500/90 text-zinc-50 hover:bg-rose-400 focus-visible:ring-rose-400/40",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold",
        "transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed",
        "disabled:bg-zinc-800 disabled:text-zinc-500",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    />
  );
}
