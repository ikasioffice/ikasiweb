import type { ReactNode } from "react";

type Variant = "gold" | "neutral";
const variants: Record<Variant, string> = {
  gold: "bg-primary/15 text-primary",
  neutral: "bg-accent text-accent-foreground",
};

export function Badge({
  children, variant = "neutral", className = "",
}: { children: ReactNode; variant?: Variant; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
