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
    <div className="mx-5 sm:mx-8 lg:mx-12 p-4 glass-card rounded-2xl flex flex-col gap-3 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-center">
      <input
        type="text"
        placeholder="Cari nama, profesi, atau perusahaan..."
        value={props.query}
        onChange={(e) => props.onQuery(e.target.value)}
        className="w-full min-h-11 bg-black/30 border border-white/[0.08] text-white px-4 py-3 rounded-xl text-sm"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:contents">
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
      </div>
      <button
        onClick={props.onReset}
        className="self-start lg:self-auto text-[#d4a72c] text-xs font-semibold px-2 py-2"
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
      className="w-full min-h-11 bg-black/30 border border-white/[0.08] text-slate-300 px-3 py-3 rounded-xl text-sm"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
