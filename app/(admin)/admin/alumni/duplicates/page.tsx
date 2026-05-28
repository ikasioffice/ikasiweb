"use client";
import { useEffect, useMemo, useState } from "react";
import { findDuplicateGroups, type DedupKey, type AlumniRow, type DuplicateGroup } from "@/lib/data/duplicates";
import { fetchAllAlumni, deleteAlumni, reassignBisnis, type BisnisRef } from "@/lib/data/admin-duplicates";
import { DuplicateGroupCard } from "@/components/admin/duplicate-group-card";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

const PAGE_SIZE = 20;

export default function DuplicatesPage() {
  const [all, setAll] = useState<AlumniRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<DedupKey>("nama");
  const [page, setPage] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // delete dialog state
  const [target, setTarget] = useState<AlumniRow | null>(null);
  const [group, setGroup] = useState<DuplicateGroup | null>(null);
  const [busy, setBusy] = useState(false);
  const [blockedBisnis, setBlockedBisnis] = useState<BisnisRef[] | null>(null);
  const [reassignTo, setReassignTo] = useState<string>("");

  async function load() {
    setLoading(true);
    setAll(await fetchAllAlumni());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(0); }, [mode]);

  const groups = useMemo(() => findDuplicateGroups(all, mode), [all, mode]);
  const pageGroups = groups.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(groups.length / PAGE_SIZE));

  function openDelete(g: DuplicateGroup, row: AlumniRow) {
    setGroup(g); setTarget(row); setBlockedBisnis(null); setReassignTo("");
  }
  function closeDialog() { setTarget(null); setGroup(null); setBlockedBisnis(null); }

  async function confirmDelete() {
    if (!target) return;
    setBusy(true);
    try {
      // kalau ada bisnis terblok dan admin sudah pilih target reassign → reassign dulu
      let reassignInfo: unknown = null;
      if (blockedBisnis && reassignTo) {
        const r = await reassignBisnis(target.id, reassignTo);
        reassignInfo = { from: target.id, to: reassignTo, moved: r.moved };
      }
      const res = await deleteAlumni(target.id, undefined, reassignInfo);
      if (res.ok) {
        setToast("Baris dihapus. Bisa di-restore di Riwayat Hapus.");
        closeDialog();
        await load();
      } else if (res.ok === false && "blocked" in res && res.blocked === "bisnis") {
        setBlockedBisnis(res.bisnis); // tampilkan UI reassign
      } else {
        setToast("Gagal menghapus: " + ("error" in res ? res.error : "unknown"));
      }
    } catch (e) {
      setToast("Error: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const keepCandidates = group?.rows.filter((r) => r.id !== target?.id) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight mb-4">Duplikat Alumni</h1>
      <div className="flex items-center gap-2 mb-5">
        {(["nama", "email", "no_hp"] as DedupKey[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-lg text-sm ${mode === m ? "bg-[#d4a72c]/15 text-[#d4a72c]" : "text-slate-400 hover:text-white"}`}>
            {m === "no_hp" ? "No HP" : m[0].toUpperCase() + m.slice(1)}
          </button>
        ))}
        <span className="text-xs text-slate-500 ml-auto">{groups.length} grup · hal {page + 1}/{totalPages}</span>
      </div>

      {loading ? (
        <div className="text-slate-500">Memuat…</div>
      ) : groups.length === 0 ? (
        <div className="text-slate-500 text-center py-12">Tidak ada duplikat untuk mode ini.</div>
      ) : (
        <>
          {pageGroups.map((g) => (
            <DuplicateGroupCard key={g.normalizedValue} group={g} onDelete={(row) => openDelete(g, row)} />
          ))}
          <div className="flex justify-center gap-3 mt-4">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-300 disabled:opacity-40">◄ Sebelumnya</button>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-300 disabled:opacity-40">Berikutnya ►</button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!target}
        title={blockedBisnis ? "Baris ini punya bisnis terkait" : "Hapus baris alumni?"}
        message={blockedBisnis
          ? "Pindahkan bisnis ke baris lain dalam grup ini dulu, lalu hapus."
          : `Hapus "${target?.nama}" (angkatan ${target?.angkatan}). Bisa di-restore.`}
        confirmLabel={blockedBisnis ? "Reassign & Hapus" : "Hapus"}
        loading={busy}
        confirmDisabled={!!blockedBisnis && !reassignTo}
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      >
        {blockedBisnis && (
          <div className="text-sm">
            <ul className="list-disc pl-5 text-slate-300 mb-3">
              {blockedBisnis.map((b) => <li key={b.id}>{b.nama_brand ?? b.id}</li>)}
            </ul>
            <label className="block text-xs text-slate-400 mb-1">Pindahkan bisnis ke baris (keep):</label>
            <select value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
              <option value="">— pilih baris —</option>
              {keepCandidates.map((r) => (
                <option key={r.id} value={r.id}>{r.nama} · {r.angkatan} · {r.prodi}</option>
              ))}
            </select>
          </div>
        )}
      </ConfirmDialog>

      {toast && (
        <div className="fixed bottom-6 right-6 glass-card rounded-xl px-4 py-3 text-sm text-white"
          onAnimationEnd={() => setToast(null)}>
          {toast}
          <button onClick={() => setToast(null)} className="ml-3 text-slate-400">✕</button>
        </div>
      )}
    </div>
  );
}
