import type { ReactNode } from "react";

type Variant = "gold" | "neutral";
const variants: Record<Variant, string> = {
  gold: "border-[#d4a72c]/30 bg-[#d4a72c]/10 text-[#d4a72c]",
  neutral: "border-white/10 bg-white/5 text-slate-300",
};

export function Badge({
  children, variant = "neutral", className = "",
}: { children: ReactNode; variant?: Variant; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
