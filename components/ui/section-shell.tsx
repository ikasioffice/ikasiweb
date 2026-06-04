import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  grid?: boolean;
  className?: string;
  innerClassName?: string;
};

export function SectionShell({ children, grid, className = "", innerClassName = "" }: Props) {
  return (
    <section className={`relative px-6 ${className}`}>
      {grid && <div aria-hidden className="bp-grid bp-grid-fade pointer-events-none absolute inset-0" />}
      <div className={`relative mx-auto max-w-5xl ${innerClassName}`}>{children}</div>
    </section>
  );
}
