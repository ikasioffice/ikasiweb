"use client";
import type { AlumniRow, DuplicateGroup } from "@/lib/data/duplicates";

const FIELDS: { key: keyof AlumniRow; label: string }[] = [
  { key: "angkatan", label: "Angkatan" },
  { key: "prodi", label: "Prodi" },
  { key: "email", label: "Email" },
  { key: "no_hp", label: "No HP" },
  { key: "nomor_anggota", label: "No Anggota" },
];

export function DuplicateGroupCard({
  group, onDelete,
}: { group: DuplicateGroup; onDelete: (row: AlumniRow) => void }) {
  const ambiguous = group.classification === "ambiguous";
  return (
    <div className="glass-card rounded-2xl p-5 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-bold text-white">&ldquo;{group.normalizedValue}&rdquo;</span>
        {ambiguous ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-300">⚠ AMBIGU</span>
        ) : group.classification === "clear-cut" ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400">clear-cut</span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">no-form</span>
        )}
        <span className="text-xs text-slate-500 ml-auto">{group.rows.length} baris</span>
      </div>
      {ambiguous && (
        <div className="text-xs text-red-300 bg-red-950/40 border border-red-900/40 rounded-lg px-3 py-2 mb-3">
          Angkatan/prodi berbeda — kemungkinan orang berbeda. Tidak ada rekomendasi hapus.
        </div>
      )}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${group.rows.length}, minmax(0,1fr))` }}>
        {group.rows.map((row) => {
          const rec = group.recommendations[row.id];
          return (
            <div key={row.id} className="border border-white/10 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-1 mb-2">
                {rec.recommend === "keep" && <span className="px-1.5 py-0.5 rounded bg-green-900/40 text-green-300">KEEP</span>}
                {rec.recommend === "delete" && <span className="px-1.5 py-0.5 rounded bg-red-900/40 text-red-300">HAPUS?</span>}
                {rec.recommend === "review" && <span className="px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-300">REVIEW</span>}
                {row.is_form_filled && <span className="text-green-400">form✓</span>}
                {row.auth_user_id && <span className="text-blue-400">login✓</span>}
              </div>
              <dl className="space-y-1">
                {FIELDS.map((f) => (
                  <div key={String(f.key)} className="flex justify-between gap-2">
                    <dt className="text-slate-500">{f.label}</dt>
                    <dd className="text-slate-200 truncate">{String(row[f.key] ?? "—")}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-slate-500 mt-2 italic">{rec.reason}</p>
              <button onClick={() => onDelete(row)}
                className="mt-2 w-full px-2 py-1 rounded-lg border border-red-500/30 text-red-400 hover:border-red-500/60">
                Hapus baris ini
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
