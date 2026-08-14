"use client";

import { useEffect, useRef, useState } from "react";
import {
  getContent,
  hapusContent,
  simpanContent,
  getSettings,
  unggahProposal,
  type BeasiswaContent,
} from "@/lib/data/beasiswa";
import { DEFAULTS } from "@/app/(public)/beasiswa/_content";
import { CONTENT_GROUPS } from "./_fields";

const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#d4a72c]/60 focus:outline-none";
const labelCls = "block text-sm font-semibold text-white mb-1";

/** Nilai efektif sebuah field: override admin bila ada, kalau tidak teks bawaan. */
function efektif(overrides: BeasiswaContent, key: string): string {
  const v = overrides[key];
  return v != null && v.trim() !== "" ? v : (DEFAULTS[key] ?? "");
}

export function KontenTab() {
  // values = apa yang tampil di form (selalu terisi, seperti admin lama).
  // tersimpan = override yang benar-benar ada di database, dipakai untuk tahu
  // baris mana yang perlu dihapus saat field dikembalikan ke bawaannya.
  const [values, setValues] = useState<BeasiswaContent>({});
  const [tersimpan, setTersimpan] = useState<BeasiswaContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [proposalName, setProposalName] = useState<string | null>(null);
  const [proposalUrl, setProposalUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void (async () => {
      const [content, settings] = await Promise.all([getContent(), getSettings()]);
      const awal: BeasiswaContent = {};
      for (const key of Object.keys(DEFAULTS)) awal[key] = efektif(content, key);
      setValues(awal);
      setTersimpan(content);
      setProposalName(settings?.proposal_name ?? null);
      setProposalUrl(settings?.proposal_url ?? null);
      setLoading(false);
    })();
  }, []);

  async function handleSimpan(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    // Hanya simpan yang benar-benar berbeda dari bawaan. Field yang sama dengan
    // bawaan barisnya dihapus, bukan ditulis ulang -- supaya perubahan teks
    // bawaan di kode nanti tetap terlihat dan tabelnya tidak menumpuk duplikat.
    const ubah: BeasiswaContent = {};
    const kembalikan: string[] = [];
    for (const key of Object.keys(DEFAULTS)) {
      const nilai = (values[key] ?? "").trim();
      const bawaan = (DEFAULTS[key] ?? "").trim();
      if (nilai !== "" && nilai !== bawaan) ubah[key] = values[key] ?? "";
      else if (tersimpan[key] != null) kembalikan.push(key);
    }

    const { error: errSimpan } = await simpanContent(ubah);
    const { error: errHapus } = errSimpan ? { error: null } : await hapusContent(kembalikan);
    setSaving(false);

    const err = errSimpan ?? errHapus;
    if (err) {
      setStatus(`Gagal menyimpan: ${err}`);
      return;
    }
    setTersimpan(ubah);
    const n = Object.keys(ubah).length;
    setStatus(
      n === 0
        ? "Tersimpan. Semua teks kembali memakai bawaan."
        : `Tersimpan. ${n} field diubah dari bawaan.`,
    );
  }

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    setUploadStatus(null);
    if (!file) {
      setUploadStatus("Pilih file PDF terlebih dahulu.");
      return;
    }
    if (file.type !== "application/pdf") {
      setUploadStatus("File harus berformat PDF.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadStatus("Ukuran file maksimal 15MB.");
      return;
    }
    setUploading(true);
    const { url, error } = await unggahProposal(file);
    setUploading(false);
    if (error) {
      setUploadStatus(`Gagal mengunggah: ${error}`);
      return;
    }
    setProposalUrl(url);
    setProposalName(file.name);
    if (fileRef.current) fileRef.current.value = "";
    setUploadStatus('Berhasil. Tombol "Unduh Proposal" di halaman publik sekarang mengarah ke file ini.');
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-xl h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ---------- Proposal PDF ---------- */}
      <section className="glass-card rounded-xl p-6">
        <h2 className="font-heading text-lg font-bold text-white mb-1">File Proposal</h2>
        <p className="text-xs text-slate-400 mb-4">
          {proposalUrl ? (
            <>
              File saat ini:{" "}
              <a href={proposalUrl} target="_blank" rel="noopener noreferrer" className="text-[#d4a72c] hover:underline">
                {proposalName ?? "Lihat file"}
              </a>
            </>
          ) : (
            "Belum ada proposal diunggah — tombol unduh di halaman publik disembunyikan."
          )}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <input ref={fileRef} type="file" accept="application/pdf" className="text-xs text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-1.5 file:text-xs file:text-white" />
          <button type="button" onClick={handleUpload} disabled={uploading} className="btn-gold px-5 py-2 rounded-full text-sm disabled:opacity-50">
            {uploading ? "Mengunggah..." : "Unggah & Ganti"}
          </button>
        </div>
        {uploadStatus && (
          <div className={`text-xs mt-3 ${uploadStatus.startsWith("Gagal") || uploadStatus.startsWith("File") || uploadStatus.startsWith("Ukuran") || uploadStatus.startsWith("Pilih") ? "text-red-400" : "text-green-400"}`}>
            {uploadStatus}
          </div>
        )}
      </section>

      {/* ---------- Teks halaman ---------- */}
      <form onSubmit={handleSimpan} className="space-y-6">
        <div className="glass-card rounded-xl p-6">
          <h2 className="font-heading text-lg font-bold text-white mb-1">Teks Halaman</h2>
          <p className="text-xs text-slate-400">
            Semua field sudah terisi teks yang sedang tampil di halaman. Ubah yang perlu saja —
            field yang isinya sama dengan bawaan tidak ikut disimpan, jadi tetap mengikuti teks
            bawaan bila nanti diperbarui. Field bertanda <span className="text-[#d4a72c]">diubah</span>{" "}
            berarti sudah berbeda dari bawaannya.
          </p>
        </div>

        {CONTENT_GROUPS.map((group) => (
          <details key={group.title} className="glass-card rounded-xl p-6" open={group === CONTENT_GROUPS[0]}>
            <summary className="font-heading cursor-pointer text-base font-bold text-[#d4a72c]">
              {group.title}
              <span className="ml-2 text-xs font-normal text-slate-500">{group.fields.length} field</span>
            </summary>
            <div className="mt-5 space-y-5">
              {group.fields.map((f) => {
                const bawaan = DEFAULTS[f.key] ?? "";
                const diubah = (values[f.key] ?? "").trim() !== bawaan.trim();
                return (
                <div key={f.key}>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <label className={labelCls + " mb-0"} htmlFor={f.key}>{f.label}</label>
                    {diubah && (
                      <>
                        <span
                          title="Berbeda dari teks bawaan"
                          className="rounded-full bg-[#d4a72c]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#d4a72c]"
                        >
                          diubah
                        </span>
                        <button
                          type="button"
                          onClick={() => setValues((p) => ({ ...p, [f.key]: bawaan }))}
                          className="text-[11px] text-slate-400 underline underline-offset-2 hover:text-white"
                        >
                          kembalikan ke bawaan
                        </button>
                      </>
                    )}
                  </div>
                  {f.hint && <p className="text-xs text-slate-400 mb-1.5">{f.hint}</p>}
                  {f.type === "text" ? (
                    <input
                      id={f.key}
                      type="text"
                      className={inputCls}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                    />
                  ) : (
                    <textarea
                      id={f.key}
                      rows={f.rows ?? 3}
                      className={`${inputCls} ${f.type === "textarea" ? "" : "font-mono text-xs leading-relaxed"}`}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                    />
                  )}
                </div>
                );
              })}
            </div>
          </details>
        ))}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-gold px-6 py-2.5 rounded-full text-sm disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          {status && (
            <span className={`text-xs ${status.startsWith("Gagal") ? "text-red-400" : "text-green-400"}`}>{status}</span>
          )}
        </div>
      </form>
    </div>
  );
}
