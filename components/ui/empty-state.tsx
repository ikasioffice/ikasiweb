import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, icon, className = "" }: Props) {
  return (
    <div
      className={`relative mx-auto flex max-w-md flex-col items-center rounded-xl border border-dashed border-border bg-card px-8 py-14 text-center shadow-sm ${className}`}
    >
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl bg-accent text-primary">
        {icon ?? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 9h18M8 4v16" />
          </svg>
        )}
      </div>
      <p className="font-heading text-lg font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
