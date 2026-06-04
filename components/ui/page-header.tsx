import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
};

export function PageHeader({ title, subtitle, breadcrumb, className = "" }: Props) {
  return (
    <header className={`relative ${className}`}>
      {breadcrumb ? (
        <div className="mb-4 text-sm text-muted-foreground">{breadcrumb}</div>
      ) : null}
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
