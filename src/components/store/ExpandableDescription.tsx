"use client";

import { useState } from "react";

type ExpandableDescriptionProps = {
  text: string;
  maxLength?: number;
};

export function ExpandableDescription({
  text,
  maxLength = 120,
}: ExpandableDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  const isLong = text.length > maxLength;
  const displayed = expanded || !isLong ? text : text.slice(0, maxLength) + "…";

  return (
    <div className="text-sm text-zinc-400">
      <p className="leading-relaxed transition-all duration-300">{displayed}</p>
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          {expanded ? "Ver Menos ↑" : "Ver Mais ↓"}
        </button>
      )}
    </div>
  );
}
