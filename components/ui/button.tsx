import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "gold" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";
const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-11 px-6 text-sm",
};
const variants: Record<Variant, string> = {
  gold: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  outline: "border border-input bg-background text-foreground hover:bg-accent",
  ghost: "text-foreground hover:bg-accent",
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
