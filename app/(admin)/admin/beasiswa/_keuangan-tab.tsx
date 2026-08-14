"use client";

import { useEffect, useState } from "react";
import {
  listSemuaDonasi,
  getRekap,
  setTargetDana,
  setDonasiVerified,
  updateDonasi,
  hapusDonasi,
  tambahDonasiManual,
  getBuktiSignedUrl,
  formatRupiah,
  hitungPersen,
  type BeasiswaDonasi,
  type BeasiswaRekap,
} from "@/lib/data/beasiswa";
import { EmptyState } from "@/components/ui/empty-state";

const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#d4a72c]/60 focus:outline-none";
const labelCls = "block text-xs font-semibold text-slate-400 mb-1.5";
const btnCls =
  "text-xs px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:border-[#d4a72c]/50 transition-colors";

type EditState = Partial<Record<keyof BeasiswaDonasi, string>>;

const KOSONG_MANUAL = {
  nama: "",
  angkatan: "",
  whatsapp: "",
  nominal: "",
  tanggal_transfer: "",
  metode: "Transfer Bank BSI",
  catatan: "",
};

export function KeuanganTab() {
  const [rekap, setRekap] = useState<BeasiswaRekap | null>(null);
  const [donasi, setDonasi] = useState<BeasiswaDonasi[]>([]);
  const [loading, setLoading] = useState(true);

  const [target, setTarget] = useState("");
  const [targetStatus, setTargetStatus] = useState<string | null>(null);
  const [savingTarget, setSavingTarget] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState>({});

  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ ...KOSONG_MANUAL });
  const [manualErr, setManualErr] = useState<string | null>(null);
  const [savingManual, setSavingManual] = useState(false);

  async function muat() {
    const [r, d] = await Promise.all([getRekap(), listSemuaDonasi()]);
    setRekap(r);
    setDonasi(d);
    setTarget(String(r?.target_dana ?? 0));
    setLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await muat();
    })();
  }, []);

  async function simpanTarget(e: React.FormEvent) {
    e.preventDefault();
    setSavingTarget(true);
    setTargetStatus(null);
    const { error } = await setTargetDana(Number(target.replace(/\D/g, "")) || 0);
    setSavingTarget(false);
    setTargetStatus(error ? `Gagal: ${error}` : "Target dana tersimpan.");
    if (!error) await muat();
  }

  async function toggleVerified(row: BeasiswaDonasi) {
    const next = !row.is_verified;
    const { error } = await setDonasiVerified(row.id, next);
    if (error) {
      alert("Gagal mengubah status: " + error);
      return;
    }
    setDonasi((prev) => prev.map((d) => (d.id === row.id ? { ...d, is_verified: next } : d)));
    setRekap(await getRekap());
  }

  function mulaiEdit(row: BeasiswaDonasi) {
    setEditingId(row.id);
    setEdit({
      nama: row.nama,
      angkatan: row.angkatan,
      whatsapp: row.whatsapp ?? "",
      nominal: String(row.nominal),
      tanggal_transfer: row.tanggal_transfer ?? "",
      metode: row.metode ?? "",
      catatan: row.catatan ?? "",
    });
  }

  async function simpanEdit(id: string) {
    const { error } = await updateDonasi(id, {
      nama: edit.nama ?? "",
      angkatan: edit.angkatan ?? "",
      whatsapp: edit.whatsapp || null,
      nominal: Number((edit.nominal ?? "").replace(/\D/g, "")) || 0,
      tanggal_transfer: edit.tanggal_transfer || null,
      metode: edit.metode || null,
      catatan: edit.catatan || null,
    });
    if (error) {
      alert("Gagal menyimpan: " + error);
      return;
    }
    setEditingId(null);
    await muat();
  }

  async function handleHapus(row: BeasiswaDonasi) {
    if (!confirm(`Hapus data dukungan dari "${row.nama}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    const { error } = await hapusDonasi(row.id);
    if (error) {
      alert("Gagal menghapus: " + error);
      return;
    }
    setDonasi((prev) => prev.filter((d) => d.id !== row.id));
    setRekap(await getRekap());
  }

  async function bukaBukti(path: string) {
    const url = await getBuktiSignedUrl(path);
    if (!url) {
      alert("Gagal membuat link bukti. Coba muat ulang halaman.");
      return;
    }
    window.open(url, "_blank", "noopener");
  }

  async function simpanManual(e: React.FormEvent) {
    e.preventDefault();
    setManualErr(null);
    const nominal = Number(manual.nominal.replace(/\D/g, "")) || 0;
    if (!manual.nama.trim() || !manual.angkatan.trim()) {
      setManualErr("Nama dan angkatan wajib diisi.");
      return;
    }
    if (nominal <= 0) {
      setManualErr("Nominal harus lebih dari nol.");
      return;
    }
    setSavingManual(true);
    const { error } = await tambahDonasiManual({
      nama: manual.nama.trim(),
      angkatan: manual.angkatan.trim(),
      whatsapp: manual.whatsapp || null,
      nominal,
      tanggal_transfer: manual.tanggal_transfer || null,
      metode: manual.metode || null,
      catatan: manual.catatan || null,
      is_verified: false,
    });
    setSavingManual(false);
    if (error) {
      setManualErr(error);
      return;
    }
    setManual({ ...KOSONG_MANUAL });
    setShowManual(false);
    await muat();
  }

  const persen = hitungPersen(rekap?.dana_terkumpul ?? 0, rekap?.target_dana ?? 0);

  return (
    <div className="space-y-8">
      {/* ---------- Ringkasan ---------- */}
      <section className="glass-card rounded-xl p-6">
        <h2 className="font-heading text-lg font-bold text-white mb-1">Ringkasan Dana</h2>
        <p className="text-xs text-slate-400 mb-5">
          Dana terkumpul dihitung otomatis dari donasi yang sudah diverifikasi — tidak bisa diisi manual.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          {[
            { label: "Target Dana", val: formatRupiah(rekap?.target_dana ?? 0) },
            { label: "Dana Terkumpul", val: formatRupiah(rekap?.dana_terkumpul ?? 0) },
            { label: "Jumlah Donatur", val: String(rekap?.jumlah_donatur ?? 0) },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white/5 p-4">
              <div className="text-xs text-slate-400">{s.label}</div>
              <div className="font-heading text-xl font-extrabold text-[#d4a72c] mt-1">{s.val}</div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Progres pengumpulan</span>
            <span className="tabular-nums">{persen}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-[#d4a72c]" style={{ width: `${persen}%` }} />
          </div>
        </div>

        <form onSubmit={simpanTarget} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px]">
            <label className={labelCls} htmlFor="target">Target Dana (Rp)</label>
            <input
              id="target"
              className={inputCls}
              inputMode="numeric"
              value={target}
              onChange={(e) => setTarget(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <button type="submit" disabled={savingTarget} className="btn-gold px-5 py-2 rounded-full text-sm disabled:opacity-50">
            {savingTarget ? "Menyimpan..." : "Simpan Target"}
          </button>
          {targetStatus && (
            <span className={`text-xs ${targetStatus.startsWith("Gagal") ? "text-red-400" : "text-green-400"}`}>
              {targetStatus}
            </span>
          )}
        </form>
      </section>

      {/* ---------- Daftar donasi ---------- */}
      <section>
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">Bukti Dukungan Masuk</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hanya yang sudah diverifikasi yang tampil di halaman publik.
            </p>
          </div>
          <button type="button" onClick={() => setShowManual((v) => !v)} className={btnCls}>
            {showManual ? "Tutup" : "+ Tambah Data Manual"}
          </button>
        </div>

        {showManual && (
          <form onSubmit={simpanManual} className="glass-card rounded-xl p-5 mb-5 space-y-4">
            <p className="text-xs text-slate-400">
              Untuk mencatat dukungan yang tidak lewat form (transfer langsung/tunai). Masuk sebagai
              &ldquo;Belum Diverifikasi&rdquo; — verifikasi seperti data lainnya.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="mNama">Nama</label>
                <input id="mNama" className={inputCls} value={manual.nama} onChange={(e) => setManual({ ...manual, nama: e.target.value })} />
              </div>
              <div>
                <label className={labelCls} htmlFor="mAngkatan">Angkatan</label>
                <input id="mAngkatan" className={inputCls} value={manual.angkatan} onChange={(e) => setManual({ ...manual, angkatan: e.target.value })} />
              </div>
              <div>
                <label className={labelCls} htmlFor="mWa">WhatsApp</label>
                <input id="mWa" className={inputCls} value={manual.whatsapp} onChange={(e) => setManual({ ...manual, whatsapp: e.target.value })} />
              </div>
              <div>
                <label className={labelCls} htmlFor="mNominal">Nominal (Rp)</label>
                <input id="mNominal" className={inputCls} inputMode="numeric" value={manual.nominal} onChange={(e) => setManual({ ...manual, nominal: e.target.value.replace(/\D/g, "") })} />
              </div>
              <div>
                <label className={labelCls} htmlFor="mTanggal">Tanggal Transfer</label>
                <input id="mTanggal" type="date" className={inputCls} value={manual.tanggal_transfer} onChange={(e) => setManual({ ...manual, tanggal_transfer: e.target.value })} />
              </div>
              <div>
                <label className={labelCls} htmlFor="mMetode">Metode</label>
                <input id="mMetode" className={inputCls} value={manual.metode} onChange={(e) => setManual({ ...manual, metode: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="mCatatan">Catatan</label>
              <input id="mCatatan" className={inputCls} value={manual.catatan} onChange={(e) => setManual({ ...manual, catatan: e.target.value })} />
            </div>
            {manualErr && <div className="text-xs text-red-400">{manualErr}</div>}
            <button type="submit" disabled={savingManual} className="btn-gold px-5 py-2 rounded-full text-sm disabled:opacity-50">
              {savingManual ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : donasi.length === 0 ? (
          <EmptyState
            title="Belum ada bukti dukungan"
            description="Data akan muncul di sini setelah donatur mengisi form di halaman /beasiswa/dukung."
          />
        ) : (
          <div className="space-y-3">
            {donasi.map((row) => {
              const editing = editingId === row.id;
              return (
                <div key={row.id} className="glass-card rounded-xl px-5 py-4">
                  {editing ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-3">
                        {([
                          ["nama", "Nama"],
                          ["angkatan", "Angkatan"],
                          ["whatsapp", "WhatsApp"],
                          ["nominal", "Nominal"],
                          ["tanggal_transfer", "Tanggal"],
                          ["metode", "Metode"],
                        ] as const).map(([k, label]) => (
                          <div key={k}>
                            <label className={labelCls} htmlFor={`${row.id}-${k}`}>{label}</label>
                            <input
                              id={`${row.id}-${k}`}
                              className={inputCls}
                              type={k === "tanggal_transfer" ? "date" : "text"}
                              value={edit[k] ?? ""}
                              onChange={(e) =>
                                setEdit((p) => ({
                                  ...p,
                                  [k]: k === "nominal" ? e.target.value.replace(/\D/g, "") : e.target.value,
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className={labelCls} htmlFor={`${row.id}-catatan`}>Catatan</label>
                        <input
                          id={`${row.id}-catatan`}
                          className={inputCls}
                          value={edit.catatan ?? ""}
                          onChange={(e) => setEdit((p) => ({ ...p, catatan: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => simpanEdit(row.id)} className="btn-gold px-4 py-1.5 rounded-full text-xs">Simpan</button>
                        <button type="button" onClick={() => setEditingId(null)} className={btnCls}>Batal</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white">{row.nama}</span>
                          <span className="text-xs text-slate-400">Angkatan {row.angkatan}</span>
                          {row.is_verified ? (
                            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">Terverifikasi</span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400">Belum Diverifikasi</span>
                          )}
                        </div>
                        <div className="font-heading text-lg font-extrabold text-[#d4a72c] mt-1">
                          {formatRupiah(row.nominal)}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {row.tanggal_transfer ?? "tanggal tidak diisi"}
                          {row.metode ? ` · ${row.metode}` : ""}
                          {row.whatsapp ? ` · ${row.whatsapp}` : ""}
                        </div>
                        {row.catatan && <div className="text-xs text-slate-400 mt-1 italic">&ldquo;{row.catatan}&rdquo;</div>}
                        <div className="text-xs mt-1">
                          {row.bukti_path ? (
                            <button type="button" onClick={() => bukaBukti(row.bukti_path!)} className="text-[#d4a72c] hover:underline">
                              Lihat bukti transfer
                            </button>
                          ) : (
                            <span className="text-slate-500">Bukti dikirim via WhatsApp</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 flex-wrap">
                        <button type="button" onClick={() => toggleVerified(row)} className={btnCls}>
                          {row.is_verified ? "Batalkan Verifikasi" : "Verifikasi"}
                        </button>
                        <button type="button" onClick={() => mulaiEdit(row)} className={btnCls}>Edit</button>
                        <button
                          type="button"
                          onClick={() => handleHapus(row)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:border-red-500/60 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
