import { displayOrDash } from "@/lib/format";

export function InfoField({
  label, value, className = "",
}: { label: string; value: string | number | null | undefined; className?: string }) {
  const shown = displayOrDash(value == null ? null : String(value));
  if (shown === null) return null;
  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm font-medium text-foreground">{shown}</div>
    </div>
  );
}
