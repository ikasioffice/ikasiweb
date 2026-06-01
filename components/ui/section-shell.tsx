import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  grid?: boolean;
  className?: string;
  innerClassName?: string;
};

export function SectionShell({ children, grid, className = "", innerClassName = "" }: Props) {
  return (
    <section className={`relative px-6 ${grid ? "bp-grid" : ""} ${className}`}>
      <div className={`mx-auto max-w-5xl ${innerClassName}`}>{children}</div>
    </section>
  );
}
