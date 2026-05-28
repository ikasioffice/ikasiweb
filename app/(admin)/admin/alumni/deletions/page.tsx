"use client";
import { useEffect, useState } from "react";
import { listDeletions, restoreAlumni, type DeletionRow } from "@/lib/data/admin-duplicates";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type Snapshot = { nama?: string; angkatan?: number };

export default function DeletionsPage() {
  const [rows, setRows] = useState<DeletionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<DeletionRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function load() { setLoading(true); setRows(await listDeletions()); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function confirmRestore() {
    if (!target) return;
    setBusy(true);
    try {
      const res = await restoreAlumni(target.id);
      setToast(res.ok ? "Baris dipulihkan." : "Gagal restore: " + (res.error ?? "unknown"));
      setTarget(null);
      await load();
    } catch (e) {
      setToast("Error: " + (e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight mb-5">Riwayat Hapus Alumni</h1>
      {loading ? <div className="text-slate-500">Memuat…</div>
        : rows.length === 0 ? <div className="text-slate-500 text-center py-12">Belum ada penghapusan.</div>
        : (
          <div className="space-y-2">
            {rows.map((d) => {
              const snap = (d.alumni_snapshot ?? {}) as Snapshot;
              return (
                <div key={d.id} className="glass-card rounded-xl px-5 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{snap.nama ?? "—"}</div>
                    <div className="text-xs text-slate-400">
                      Angkatan {snap.angkatan ?? "—"} · {new Date(d.deleted_at).toLocaleString("id-ID")}
                      {d.reason ? ` · ${d.reason}` : ""}
                    </div>
                  </div>
                  <button onClick={() => setTarget(d)}
                    className="text-xs px-4 py-1.5 rounded-lg border border-green-500/30 text-green-400 hover:border-green-500/60">
                    Restore
                  </button>
                </div>
              );
            })}
          </div>
        )}

      <ConfirmDialog
        open={!!target}
        title="Pulihkan baris alumni?"
        message="Baris akan dikembalikan ke tabel alumni dengan id aslinya."
        confirmLabel="Restore"
        loading={busy}
        onConfirm={confirmRestore}
        onCancel={() => setTarget(null)}
      />
      {toast && (
        <div className="fixed bottom-6 right-6 glass-card rounded-xl px-4 py-3 text-sm text-white">
          {toast}<button onClick={() => setToast(null)} className="ml-3 text-slate-400">✕</button>
        </div>
      )}
    </div>
  );
}
