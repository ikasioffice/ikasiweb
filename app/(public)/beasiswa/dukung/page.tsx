"use client";

import { useState } from "react";
import Link from "next/link";
import { kirimDonasi, unggahBukti, formatRupiah } from "@/lib/data/beasiswa";
import { WA_NUMBER } from "../_content";

const METODE_OPTIONS = ["Transfer Bank BSI", "QRIS"];
const MAX_BUKTI_BYTES = 5 * 1024 * 1024;

type CaraBukti = "upload" | "whatsapp";

type FormState = {
  nama: string;
  angkatan: string;
  whatsapp: string;
  nominal: string;
  tanggal: string;
  metode: string;
  catatan: string;
};

const INITIAL: FormState = {
  nama: "",
  angkatan: "",
  whatsapp: "",
  nominal: "",
  tanggal: "",
  metode: "",
  catatan: "",
};

const inputCls =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring";
const labelCls = "mb-1.5 block text-sm font-medium text-foreground";
const hintCls = "mt-1.5 text-xs text-muted-foreground";

export default function DukungPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [cara, setCara] = useState<CaraBukti>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState(""); // anti-spam: harus tetap kosong
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const nominalAngka = Number(form.nominal.replace(/\D/g, "")) || 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nama = form.nama.trim();
    const angkatan = form.angkatan.trim();

    if (!nama || !angkatan) {
      setError("Nama lengkap dan angkatan wajib diisi.");
      return;
    }
    if (nominalAngka <= 0) {
      setError("Nominal transfer wajib diisi dan harus lebih dari nol.");
      return;
    }
    if (cara === "upload") {
      if (!file) {
        setError("Pilih file bukti transfer terlebih dahulu, atau pilih kirim lewat WhatsApp.");
        return;
      }
      if (file.size > MAX_BUKTI_BYTES) {
        setError("Ukuran file maksimal 5MB.");
        return;
      }
    }

    // Honeypot terisi → kemungkinan bot. Pura-pura sukses, tidak menyimpan.
    if (honeypot) { setDone(true); return; }

    setSending(true);

    let buktiPath: string | null = null;
    if (cara === "upload" && file) {
      const { path, error: upErr } = await unggahBukti(file);
      if (upErr) {
        setSending(false);
        setError(`Gagal mengunggah bukti: ${upErr}`);
        return;
      }
      buktiPath = path;
    }

    const { error: insErr } = await kirimDonasi({
      nama,
      angkatan,
      whatsapp: form.whatsapp.trim() || null,
      nominal: nominalAngka,
      tanggal_transfer: form.tanggal || null,
      metode: form.metode || null,
      catatan: form.catatan.trim() || null,
      bukti_path: buktiPath,
    });

    setSending(false);
    if (insErr) {
      setError(`Gagal mengirim data: ${insErr}`);
      return;
    }
    setDone(true);
  }

  if (done) {
    const pesan =
      cara === "whatsapp"
        ? "Halo IKASI, saya sudah mengirimkan donasi untuk Program Beasiswa Alumni. Bukti transfernya akan saya kirimkan menyusul di chat ini. Terima kasih."
        : "Halo IKASI, saya sudah mengirimkan donasi untuk Program Beasiswa Alumni beserta bukti transfernya lewat form di website. Mohon dicek, terima kasih.";

    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="font-heading mt-5 text-2xl font-extrabold tracking-tight">
            Bukti dukungan terkirim
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {cara === "whatsapp"
              ? "Data Anda sudah kami terima. Klik tombol di bawah untuk membuka WhatsApp, lalu lampirkan foto/screenshot bukti transfer Anda di chat yang sama."
              : "Data dan bukti transfer Anda sudah kami terima. Dukungan akan tampil di halaman Beasiswa setelah diverifikasi admin."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              {cara === "whatsapp" ? "Kirim Bukti via WhatsApp" : "Konfirmasi ke WhatsApp Admin"}
            </a>
            <Link
              href="/beasiswa"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Kembali ke Halaman Beasiswa
            </Link>
          </div>

          {cara === "upload" && (
            <p className={hintCls}>
              Langkah WhatsApp ini opsional — bukti Anda sudah tercatat.
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <Link href="/beasiswa" className="hover:text-foreground">Beasiswa Alumni</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Kirim Bukti Dukungan</span>
      </nav>

      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        Kirim <span className="text-primary">Bukti Dukungan</span>
      </h1>
      <p className="mt-2 text-muted-foreground">
        Sudah transfer lewat rekening atau QRIS? Lengkapi data di bawah agar dukungan Anda
        diverifikasi admin dan tercatat di halaman Beasiswa.
      </p>

      <form onSubmit={handleSubmit} className="relative mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Honeypot anti-spam (disembunyikan dari user) */}
        <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
          <label>Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="nama">
              Nama lengkap <span className="text-primary">*</span>
            </label>
            <input id="nama" className={inputCls} placeholder="Nama sesuai identitas" value={form.nama} onChange={(e) => set("nama", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="angkatan">
              Angkatan <span className="text-primary">*</span>
            </label>
            <input id="angkatan" className={inputCls} inputMode="numeric" placeholder="Contoh: 2015" value={form.angkatan} onChange={(e) => set("angkatan", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="wa">Nomor WhatsApp</label>
            <input id="wa" className={inputCls} inputMode="tel" placeholder="08xxxxxxxxxx" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="nominal">
              Nominal transfer <span className="text-primary">*</span>
            </label>
            <input
              id="nominal"
              className={inputCls}
              inputMode="numeric"
              placeholder="500.000"
              value={form.nominal}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                set("nominal", digits ? Number(digits).toLocaleString("id-ID") : "");
              }}
            />
            {nominalAngka > 0 && <p className={hintCls}>{formatRupiah(nominalAngka)}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="tanggal">Tanggal transfer</label>
            <input id="tanggal" type="date" className={inputCls} value={form.tanggal} onChange={(e) => set("tanggal", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="metode">Metode pengiriman</label>
            <select id="metode" className={inputCls} value={form.metode} onChange={(e) => set("metode", e.target.value)}>
              <option value="">Pilih metode</option>
              {METODE_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cara kirim bukti */}
        <fieldset className="mt-6">
          <legend className={labelCls}>
            Cara kirim bukti transfer <span className="text-primary">*</span>
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ["upload", "Upload di sini"],
              ["whatsapp", "Kirim lewat WhatsApp"],
            ] as const).map(([val, label]) => (
              <label
                key={val}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm transition-colors ${
                  cara === val ? "border-primary bg-primary/10 font-semibold text-primary" : "border-input hover:bg-accent"
                }`}
              >
                <input type="radio" name="cara" value={val} checked={cara === val} onChange={() => setCara(val)} className="accent-current" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {cara === "upload" ? (
          <div className="mt-5">
            <label className={labelCls} htmlFor="bukti">
              Screenshot/foto bukti transfer <span className="text-primary">*</span>
            </label>
            <input
              id="bukti"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground"
            />
            <p className={hintCls}>Format gambar (JPG/PNG) atau PDF, maksimal 5MB. File hanya bisa dilihat admin.</p>
          </div>
        ) : (
          <div className="mt-5 rounded-lg bg-primary/10 p-4 text-sm leading-relaxed text-primary">
            Setelah form ini terkirim, Anda akan diarahkan untuk mengirim bukti transfer langsung ke
            WhatsApp admin.
          </div>
        )}

        <div className="mt-5">
          <label className={labelCls} htmlFor="catatan">Catatan (opsional)</label>
          <textarea
            id="catatan"
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            placeholder="Pesan tambahan, jika ada"
            value={form.catatan}
            onChange={(e) => set("catatan", e.target.value)}
          />
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {sending ? "Mengirim..." : "Kirim Bukti Dukungan"}
        </button>

        <p className={`${hintCls} text-center`}>
          Data Anda hanya dipakai untuk verifikasi. Yang tampil publik hanya nama, angkatan, dan
          nominal — nomor WhatsApp dan bukti transfer tidak ditampilkan.
        </p>
      </form>
    </main>
  );
}
