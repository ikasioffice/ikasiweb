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
        <div className="mb-4 text-sm text-slate-500">{breadcrumb}</div>
      ) : null}
      <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-5xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
