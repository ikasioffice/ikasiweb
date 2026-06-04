"use client";

type Props = {
  query: string;
  onQuery: (v: string) => void;
  angkatan: number | null;
  onAngkatan: (v: number | null) => void;
  prodi: string | null;
  onProdi: (v: string | null) => void;
  domisili: string | null;
  onDomisili: (v: string | null) => void;
  optionsAngkatan: number[];
  optionsProdi: string[];
  optionsDomisili: string[];
  onReset: () => void;
};

export function SearchFilterBar(props: Props) {
  const hasFilter =
    props.angkatan !== null || props.prodi !== null || props.domisili !== null || props.query !== "";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="relative mb-3">
        <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Cari nama, perusahaan, atau bidang…"
          value={props.query}
          onChange={(e) => props.onQuery(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select
          value={props.angkatan?.toString() ?? ""}
          onChange={(v) => props.onAngkatan(v ? parseInt(v) : null)}
          placeholder="Semua Angkatan"
          options={props.optionsAngkatan.map((y) => ({ value: y.toString(), label: y.toString() }))}
        />
        <Select
          value={props.prodi ?? ""}
          onChange={(v) => props.onProdi(v || null)}
          placeholder="Semua Prodi"
          options={props.optionsProdi.map((p) => ({ value: p, label: p }))}
        />
        <Select
          value={props.domisili ?? ""}
          onChange={(v) => props.onDomisili(v || null)}
          placeholder="Semua Domisili"
          options={props.optionsDomisili.map((d) => ({ value: d, label: d }))}
        />
        {hasFilter && (
          <button
            onClick={props.onReset}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
            </svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function Select({
  value, onChange, placeholder, options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
