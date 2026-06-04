import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  interactive?: boolean;
  className?: string;
};

export function Card({ children, href, interactive, className = "" }: Props) {
  const hasPadding = /(^|\s)p-/.test(className);
  const cls =
    `rounded-lg border border-border bg-card ${hasPadding ? "" : "p-6 "}shadow-sm ` +
    (interactive || href ? "transition-all hover:shadow-md hover:-translate-y-0.5 " : "") +
    className;
  if (href) {
    return (
      <Link href={href} className={`group block ${cls}`}>
        {children}
      </Link>
    );
  }
  return <div className={cls}>{children}</div>;
}
