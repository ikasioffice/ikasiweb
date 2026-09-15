"use client";

import { useEffect, useState } from "react";
import {
  KATEGORI_LABEL,
  getBuktiSignedUrl,
  getRekap,
  hapusPendaftaran,
  listSemuaPendaftaran,
  setPendaftaranVerified,
  tambahPendaftaranManual,
  updatePendaftaran,
  formatRupiah,
  BIAYA,
  type Kategori,
  type Metode,
  type SalurunPendaftaran,
  type SalurunRekap,
  type UkuranJersey,
} from "@/lib/data/salurun";
import { EmptyState } from "@/components/ui/empty-state";

const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#d4a72c]/60 focus:outline-none";
const labelCls = "block text-xs font-semibold text-slate-400 mb-1.5";
const btnCls =
  "text-xs px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:border-[#d4a72c]/50 transition-colors";

type EditState = Partial<Record<keyof SalurunPendaftaran, string>>;

const UKURAN: UkuranJersey[] = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

const KOSONG_MANUAL = {
  nama: "",
  angkatan: "",
  kategori: "mahasiswa" as Kategori,
  whatsapp: "",
  email: "",
  ukuran_jersey: "M" as UkuranJersey,
  metode: "Transfer Bank" as Metode,
  catatan: "",
};

function exportCsv(rows: SalurunPendaftaran[]) {
  const cols: { key: keyof SalurunPendaftaran; label: string }[] = [
    { key: "nama", label: "Nama" },
    { key: "angkatan", label: "Angkatan" },
    { key: "kategori", label: "Kategori" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "email", label: "Email" },
    { key: "ukuran_jersey", label: "Ukuran Jersey" },
    { key: "metode", label: "Metode Pembayaran" },
    { key: "donasi", label: "Donasi Beasiswa" },
    { key: "nominal", label: "Total Dibayar" },
    { key: "is_verified", label: "Terverifikasi" },
    { key: "catatan", label: "Catatan" },
    { key: "created_at", label: "Tanggal Daftar" },
  ];
  const head = cols.map((c) => c.label).join(",");
  const lines = rows.map((r) =>
    cols
      .map((c) => {
        const v = r[c.key];
        const s = v == null ? "" : String(v);
        return `"${s.replace(/"/g, '""')}"`;
      })
      .join(","),
  );
  const csv = [head, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `salurun-pendaftar-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function SalurunTab() {
  const [rekap, setRekap] = useState<SalurunRekap | null>(null);
  const [pendaftar, setPendaftar] = useState<SalurunPendaftaran[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState>({});

  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ ...KOSONG_MANUAL });
  const [manualErr, setManualErr] = useState<string | null>(null);
  const [savingManual, setSavingManual] = useState(false);

  const [filter, setFilter] = useState<"semua" | "belum" | "terverifikasi">("semua");

  async function muat() {
    const [r, d] = await Promise.all([getRekap(), listSemuaPendaftaran()]);
    setRekap(r);
    setPendaftar(d);
    setLoading(false);
  }

  useEffect(() => {
    void (async () => {
      await muat();
    })();
  }, []);

  async function toggleVerified(row: SalurunPendaftaran) {
    const next = !row.is_verified;
    const { error } = await setPendaftaranVerified(row.id, next);
    if (error) {
      alert("Gagal mengubah status: " + error);
      return;
    }
    setPendaftar((prev) => prev.map((d) => (d.id === row.id ? { ...d, is_verified: next } : d)));
    setRekap(await getRekap());
  }

  function mulaiEdit(row: SalurunPendaftaran) {
    setEditingId(row.id);
    setEdit({
      nama: row.nama,
      angkatan: row.angkatan,
      kategori: row.kategori,
      whatsapp: row.whatsapp,
      email: row.email ?? "",
      ukuran_jersey: row.ukuran_jersey,
      metode: row.metode,
      nominal: String(row.nominal),
      catatan: row.catatan ?? "",
    });
  }

  async function simpanEdit(id: string) {
    const { error } = await updatePendaftaran(id, {
      nama: edit.nama ?? "",
      angkatan: edit.angkatan ?? "",
      kategori: edit.kategori ?? "mahasiswa",
      whatsapp: edit.whatsapp ?? "",
      email: edit.email || null,
      ukuran_jersey: (edit.ukuran_jersey as UkuranJersey) ?? "M",
      metode: edit.metode ?? "Transfer Bank",
      nominal: Number((edit.nominal ?? "").replace(/\D/g, "")) || 0,
      catatan: edit.catatan || null,
    });
    if (error) {
      alert("Gagal menyimpan: " + error);
      return;
    }
    setEditingId(null);
    await muat();
  }

  async function handleHapus(row: SalurunPendaftaran) {
    if (!confirm(`Hapus pendaftaran "${row.nama}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    const { error } = await hapusPendaftaran(row.id);
    if (error) {
      alert("Gagal menghapus: " + error);
      return;
    }
    setPendaftar((prev) => prev.filter((d) => d.id !== row.id));
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
    if (!manual.nama.trim() || !manual.whatsapp.trim() || !manual.angkatan.trim()) {
      setManualErr("Nama, angkatan, dan WhatsApp wajib diisi.");
      return;
    }
    setSavingManual(true);
    const { error } = await tambahPendaftaranManual({
      nama: manual.nama.trim(),
      angkatan: manual.angkatan.trim(),
      kategori: manual.kategori,
      whatsapp: manual.whatsapp.trim(),
      email: manual.email.trim() || null,
      ukuran_jersey: manual.ukuran_jersey,
      metode: manual.metode,
      nominal: BIAYA[manual.kategori],
      catatan: manual.catatan.trim() || null,
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

  const tampil = pendaftar.filter((p) => {
    if (filter === "belum") return !p.is_verified;
    if (filter === "terverifikasi") return p.is_verified;
    return true;
  });

  const totalDonasi = pendaftar
    .filter((p) => p.is_verified)
    .reduce((acc, p) => acc + (Number(p.donasi) || 0), 0);

  return (
    <div className="space-y-8">
      {/* ---------- Ringkasan ---------- */}
      <section className="glass-card rounded-xl p-6">
        <h2 className="font-heading text-lg font-bold text-white mb-1">Ringkasan Peserta</h2>
        <p className="text-xs text-slate-400 mb-5">
          Hanya peserta yang sudah diverifikasi yang dihitung sebagai peserta resmi SALURUN 2026.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Peserta Terverifikasi", val: String(rekap?.jumlah_peserta ?? 0) },
            { label: "Mahasiswa", val: String(rekap?.jumlah_mahasiswa ?? 0) },
            { label: "Alumni", val: String(rekap?.jumlah_alumni ?? 0) },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white/5 p-4">
              <div className="text-xs text-slate-400">{s.label}</div>
              <div className="font-heading text-xl font-extrabold text-[#d4a72c] mt-1">{s.val}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-white/5 p-4">
          <div className="text-xs text-slate-400">Total Donasi Beasiswa (peserta terverifikasi)</div>
          <div className="font-heading text-xl font-extrabold text-[#d4a72c] mt-1">{formatRupiah(totalDonasi)}</div>
        </div>
      </section>

      {/* ---------- Daftar pendaftar ---------- */}
      <section>
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">Pendaftar</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verifikasi bukti transfer untuk mengonfirmasi peserta.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={() => exportCsv(tampil)} className={btnCls}>
              ⬇ Export CSV
            </button>
            <button type="button" onClick={() => setShowManual((v) => !v)} className={btnCls}>
              {showManual ? "Tutup" : "+ Tambah Data Manual"}
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {([
            ["semua", "Semua"],
            ["belum", "Belum Diverifikasi"],
            ["terverifikasi", "Terverifikasi"],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilter(val)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                filter === val
                  ? "border-[#d4a72c]/60 bg-[#d4a72c]/10 text-[#d4a72c] font-semibold"
                  : "border-white/20 text-slate-400 hover:border-white/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {showManual && (
          <form onSubmit={simpanManual} className="glass-card rounded-xl p-5 mb-5 space-y-4">
            <p className="text-xs text-slate-400">
              Untuk mencatat pendaftaran yang tidak lewat form (transfer langsung/tunai). Masuk sebagai
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
                <label className={labelCls} htmlFor="mKategori">Kategori</label>
                <select
                  id="mKategori"
                  className={inputCls}
                  value={manual.kategori}
                  onChange={(e) => setManual({ ...manual, kategori: e.target.value as Kategori })}
                >
                  <option value="mahasiswa">Mahasiswa — {formatRupiah(BIAYA.mahasiswa)}</option>
                  <option value="alumni">Alumni — {formatRupiah(BIAYA.alumni)}</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="mWa">WhatsApp</label>
                <input id="mWa" className={inputCls} value={manual.whatsapp} onChange={(e) => setManual({ ...manual, whatsapp: e.target.value })} />
              </div>
              <div>
                <label className={labelCls} htmlFor="mEmail">Email</label>
                <input id="mEmail" className={inputCls} value={manual.email} onChange={(e) => setManual({ ...manual, email: e.target.value })} />
              </div>
              <div>
                <label className={labelCls} htmlFor="mUkuran">Ukuran Jersey</label>
                <select
                  id="mUkuran"
                  className={inputCls}
                  value={manual.ukuran_jersey}
                  onChange={(e) => setManual({ ...manual, ukuran_jersey: e.target.value as UkuranJersey })}
                >
                  {UKURAN.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="mMetode">Metode Pembayaran</label>
                <select
                  id="mMetode"
                  className={inputCls}
                  value={manual.metode}
                  onChange={(e) => setManual({ ...manual, metode: e.target.value as Metode })}
                >
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="QRIS">QRIS</option>
                </select>
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
        ) : tampil.length === 0 ? (
          <EmptyState
            title="Belum ada pendaftar"
            description="Data akan muncul di sini setelah peserta mengisi form di halaman /salurun/daftar."
          />
        ) : (
          <div className="space-y-3">
            {tampil.map((row) => {
              const editing = editingId === row.id;
              return (
                <div key={row.id} className="glass-card rounded-xl px-5 py-4">
                  {editing ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className={labelCls} htmlFor={`${row.id}-nama`}>Nama</label>
                          <input
                            id={`${row.id}-nama`}
                            className={inputCls}
                            value={edit.nama ?? ""}
                            onChange={(e) => setEdit((p) => ({ ...p, nama: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor={`${row.id}-angkatan`}>Angkatan</label>
                          <input
                            id={`${row.id}-angkatan`}
                            className={inputCls}
                            value={edit.angkatan ?? ""}
                            onChange={(e) => setEdit((p) => ({ ...p, angkatan: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor={`${row.id}-kategori`}>Kategori</label>
                          <select
                            id={`${row.id}-kategori`}
                            className={inputCls}
                            value={edit.kategori ?? "mahasiswa"}
                            onChange={(e) => setEdit((p) => ({ ...p, kategori: e.target.value }))}
                          >
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="alumni">Alumni</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls} htmlFor={`${row.id}-ukuran`}>Ukuran Jersey</label>
                          <select
                            id={`${row.id}-ukuran`}
                            className={inputCls}
                            value={edit.ukuran_jersey ?? "M"}
                            onChange={(e) => setEdit((p) => ({ ...p, ukuran_jersey: e.target.value }))}
                          >
                            {UKURAN.map((u) => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls} htmlFor={`${row.id}-metode`}>Metode Pembayaran</label>
                          <select
                            id={`${row.id}-metode`}
                            className={inputCls}
                            value={edit.metode ?? "Transfer Bank"}
                            onChange={(e) => setEdit((p) => ({ ...p, metode: e.target.value }))}
                          >
                            <option value="Transfer Bank">Transfer Bank</option>
                            <option value="QRIS">QRIS</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls} htmlFor={`${row.id}-wa`}>WhatsApp</label>
                          <input
                            id={`${row.id}-wa`}
                            className={inputCls}
                            value={edit.whatsapp ?? ""}
                            onChange={(e) => setEdit((p) => ({ ...p, whatsapp: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor={`${row.id}-email`}>Email</label>
                          <input
                            id={`${row.id}-email`}
                            className={inputCls}
                            value={edit.email ?? ""}
                            onChange={(e) => setEdit((p) => ({ ...p, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor={`${row.id}-nominal`}>Nominal</label>
                          <input
                            id={`${row.id}-nominal`}
                            className={inputCls}
                            value={edit.nominal ?? ""}
                            onChange={(e) => setEdit((p) => ({ ...p, nominal: e.target.value.replace(/\D/g, "") }))}
                          />
                        </div>
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
                          <span className="text-xs text-slate-400">{KATEGORI_LABEL[row.kategori as Kategori] ?? row.kategori}</span>
                          <span className="text-xs text-slate-400">· Angkatan {row.angkatan}</span>
                          <span className="text-xs text-slate-400">· Jersey {row.ukuran_jersey}</span>
                          <span className="text-xs text-slate-400">· {row.metode}</span>
                          {row.is_verified ? (
                            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">Terverifikasi</span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400">Belum Diverifikasi</span>
                          )}
                        </div>
                        <div className="font-heading text-lg font-extrabold text-[#d4a72c] mt-1">
                          {formatRupiah(row.nominal)}
                        </div>
                        {Number(row.donasi) > 0 && (
                          <div className="text-[11px] text-slate-500 -mt-0.5">
                            termasuk donasi beasiswa {formatRupiah(row.donasi)}
                          </div>
                        )}
                        <div className="text-xs text-slate-400 mt-1">
                          {row.whatsapp}
                          {row.email ? ` · ${row.email}` : ""}
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
