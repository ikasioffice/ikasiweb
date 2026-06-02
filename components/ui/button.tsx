import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "gold" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a72c]";
const sizes: Record<Size, string> = {
  md: "px-6 py-2.5 text-sm min-h-11",
  lg: "px-8 py-3 text-base min-h-11",
};
const variants: Record<Variant, string> = {
  gold: "btn-gold",
  outline: "border border-white/20 text-white hover:border-[#d4a72c]/60",
};

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function Button({
  children, href, variant = "gold", size = "md", className = "", onClick, type = "button",
}: Props) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
