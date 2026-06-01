import { displayOrDash } from "@/lib/format";

export function InfoField({
  label, value, className = "",
}: { label: string; value: string | number | null | undefined; className?: string }) {
  const shown = displayOrDash(value == null ? null : String(value));
  if (shown === null) return null;
  return (
    <div className={className}>
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      <div className="text-sm text-slate-200">{shown}</div>
    </div>
  );
}
