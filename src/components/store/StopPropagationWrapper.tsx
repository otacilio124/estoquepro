"use client";

import { MouseEvent } from "react";

type StopPropagationWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export function StopPropagationWrapper({ children, className }: StopPropagationWrapperProps) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
}
