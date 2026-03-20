import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  hint?: string;
  accent?: "emerald" | "amber" | "rose" | "zinc";
  icon?: ReactNode;
  delay?: number;
};

const ACCENT_STYLES: Record<
  NonNullable<StatCardProps["accent"]>,
  string
> = {
  emerald: "text-emerald-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
  zinc: "text-zinc-200",
};

export function StatCard({
  title,
  value,
  hint,
  accent = "zinc",
  icon,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="surface flex h-full flex-col gap-3 p-6 motion-safe:animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-sm font-semibold", ACCENT_STYLES[accent])}>
          {title}
        </span>
        {icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900/70 text-zinc-200">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="text-2xl font-semibold text-zinc-50">{value}</div>
      {hint ? <div className="text-xs text-zinc-400">{hint}</div> : null}
    </div>
  );
}
