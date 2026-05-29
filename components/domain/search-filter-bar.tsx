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
  return (
    <div className="mx-5 sm:mx-8 lg:mx-12 p-4 glass-card rounded-2xl flex flex-wrap gap-3 items-center lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <input
        type="text"
        placeholder="Cari nama, profesi, atau perusahaan..."
        value={props.query}
        onChange={(e) => props.onQuery(e.target.value)}
        className="w-full sm:flex-1 sm:min-w-[200px] min-w-0 bg-black/30 border border-white/[0.08] text-white px-4 py-3 rounded-xl text-sm"
      />
      <Select
        value={props.angkatan?.toString() ?? ""}
        onChange={(v) => props.onAngkatan(v ? parseInt(v) : null)}
        placeholder="Angkatan"
        options={props.optionsAngkatan.map((y) => ({ value: y.toString(), label: y.toString() }))}
      />
      <Select
        value={props.prodi ?? ""}
        onChange={(v) => props.onProdi(v || null)}
        placeholder="Prodi"
        options={props.optionsProdi.map((p) => ({ value: p, label: p }))}
      />
      <Select
        value={props.domisili ?? ""}
        onChange={(v) => props.onDomisili(v || null)}
        placeholder="Domisili"
        options={props.optionsDomisili.map((d) => ({ value: d, label: d }))}
      />
      <button
        onClick={props.onReset}
        className="text-[#d4a72c] text-xs font-semibold px-2"
      >
        Reset
      </button>
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
      className="flex-1 lg:flex-none min-w-0 bg-black/30 border border-white/[0.08] text-slate-300 px-3 py-3 rounded-xl text-sm"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
