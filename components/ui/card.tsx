import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  interactive?: boolean;
  className?: string;
};

const corner =
  "before:absolute before:left-0 before:top-0 before:h-3 before:w-3 before:border-l before:border-t before:border-[var(--color-blueprint-line-strong)] " +
  "after:absolute after:bottom-0 after:right-0 after:h-3 after:w-3 after:border-b after:border-r after:border-[var(--color-blueprint-line-strong)]";

export function Card({ children, href, interactive, className = "" }: Props) {
  const cls =
    `relative glass-card rounded-2xl p-6 ${corner} ` +
    (interactive || href ? "transition-colors hover:border-[#d4a72c]/40 " : "") +
    className;
  if (href) {
    return (
      <Link href={href} className={`block group ${cls}`}>
        {children}
      </Link>
    );
  }
  return <div className={cls}>{children}</div>;
}
