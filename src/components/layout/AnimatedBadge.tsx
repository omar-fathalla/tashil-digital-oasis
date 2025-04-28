
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBadgeProps {
  value: string | number;
  variant?: "new" | "count";
  className?: string;
}

export function AnimatedBadge({ value, variant = "count", className }: AnimatedBadgeProps) {
  return (
    <span
      className={cn(
        "absolute right-2 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium",
        "animate-in fade-in duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out",
        variant === "new" 
          ? "bg-blue-500 text-white" 
          : "bg-red-500 text-white",
        "before:absolute before:inset-0 before:rounded-md before:animate-[ping_1s_ease-in-out_1]",
        className
      )}
    >
      {value}
    </span>
  );
}
