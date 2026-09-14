"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BIAYA,
  KATEGORI_LABEL,
  formatRupiah,
  kirimPendaftaran,
  unggahBukti,
  type Kategori,
  type UkuranJersey,
} from "@/lib/data/salurun";

const MAX_BUKTI_BYTES = 5 * 1024 * 1024;

// Rekening resmi IKASI — sama dengan yang dipakai Program Beasiswa Alumni.
const REKENING_BANK = "BSI a.n. IKASI POLBAN";
const REKENING_NOMOR = "1982320247";
const WA_NUMBER = "6281234681730";

type Langkah = 1 | 2 | 3;
type CaraBukti = "upload" | "whatsapp";

const LANGKAH: { no: Langkah; label: string }[] = [
  { no: 1, label: "Data Peserta" },
  { no: 2, label: "Transfer" },
  { no: 3, label: "Bukti" },
];

const UKURAN: UkuranJersey[] = ["S", "M", "L", "XL", "XXL"];

const inputCls =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring";
const labelCls = "mb-1.5 block text-sm font-medium text-foreground";
const hintCls = "mt-1.5 text-xs text-muted-foreground";
const ctaPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50";
const ctaSecondary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-semibold transition-colors hover:bg-accent";

function Stepper({ aktif }: { aktif: Langkah }) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {LANGKAH.map((l, i) => {
        const selesai = aktif > l.no;
        const kini = aktif === l.no;
        return (
          <li key={l.no} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  kini || selesai
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-muted-foreground"
                }`}
                aria-current={kini ? "step" : undefined}
              >
                {selesai ? (
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10l4 4 8-9" />
                  </svg>
                ) : (
                  l.no
                )}
              </span>
              <span className={`hidden text-xs font-medium sm:inline ${kini ? "text-foreground" : "text-muted-foreground"}`}>
                {l.label}
              </span>
            </div>
            {i < LANGKAH.length - 1 && <span className="h-px flex-1 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

function Salin({ nilai, label }: { nilai: string; label: string }) {
  const [tersalin, setTersalin] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(nilai);
          setTersalin(true);
          setTimeout(() => setTersalin(false), 1800);
        } catch {
          setTersalin(false);
        }
      }}
      className="rounded-md border border-input px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent"
      aria-label={`Salin ${label}`}
    >
      {tersalin ? "Tersalin" : "Salin"}
    </button>
  );
}

export default function DaftarSalurunPage() {
  const [langkah, setLangkah] = useState<Langkah>(1);

  // Langkah 1
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState<Kategori>("mahasiswa");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [ukuranJersey, setUkuranJersey] = useState<UkuranJersey>("M");
  const [honeypot, setHoneypot] = useState(""); // anti-spam: harus tetap kosong

  // Langkah 3
  const [cara, setCara] = useState<CaraBukti>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [catatan, setCatatan] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const nominal = BIAYA[kategori];

  function lanjutKeTransfer(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (!whatsapp.trim()) {
      setError("Nomor WhatsApp wajib diisi agar panitia bisa mengonfirmasi pendaftaran Anda.");
      return;
    }
    setLangkah(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function lanjutKeBukti() {
    setError(null);
    setLangkah(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function kembali(ke: Langkah) {
    setError(null);
    setLangkah(ke);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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

    const { error: insErr } = await kirimPendaftaran({
      nama: nama.trim(),
      kategori,
      whatsapp: whatsapp.trim(),
      email: email.trim() || null,
      ukuran_jersey: ukuranJersey,
      nominal,
      catatan: catatan.trim() || null,
      bukti_path: buktiPath,
    });

    setSending(false);
    if (insErr) {
      setError(`Gagal mengirim data: ${insErr}`);
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- Selesai ----------
  if (done) {
    const pesan =
      cara === "whatsapp"
        ? `Halo Panitia SALURUN, saya ${nama.trim()} (${KATEGORI_LABEL[kategori]}) sudah mendaftar dan transfer ${formatRupiah(nominal)}. Bukti transfernya saya kirimkan di chat ini.`
        : `Halo Panitia SALURUN, saya ${nama.trim()} (${KATEGORI_LABEL[kategori]}) sudah mendaftar dan transfer ${formatRupiah(nominal)} beserta bukti transfernya lewat form di website. Mohon dicek, terima kasih.`;

    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="font-heading mt-5 text-2xl font-extrabold tracking-tight">
            Terima kasih, {nama.trim().split(" ")[0]}!
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {cara === "whatsapp"
              ? "Pendaftaran Anda sudah kami terima. Klik tombol di bawah untuk membuka WhatsApp, lalu lampirkan foto bukti transfer di chat yang sama."
              : "Pendaftaran dan bukti transfer Anda sudah kami terima. Status akan diverifikasi oleh panitia."}
          </p>

          <div className="mx-auto mt-6 max-w-xs rounded-xl bg-primary/10 p-4">
            <div className="text-xs text-muted-foreground">Kategori · Nominal</div>
            <div className="font-heading text-lg font-extrabold text-foreground">{KATEGORI_LABEL[kategori]}</div>
            <div className="font-heading mt-1 text-2xl font-extrabold tabular-nums text-primary">
              {formatRupiah(nominal)}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaPrimary}
            >
              {cara === "whatsapp" ? "Kirim Bukti via WhatsApp" : "Konfirmasi ke WhatsApp Panitia"}
            </a>
            <Link href="/salurun" className={ctaSecondary}>
              Kembali ke Halaman SALURUN
            </Link>
          </div>

          {cara === "upload" && (
            <p className={hintCls}>Langkah WhatsApp ini opsional — bukti Anda sudah tercatat.</p>
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
        <Link href="/salurun" className="hover:text-foreground">SALURUN 2026</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Daftar</span>
      </nav>

      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        Daftar <span className="text-primary">SALURUN 2026</span>
      </h1>
      <p className="mb-8 mt-2 text-muted-foreground">
        {langkah === 1 && "Isi data Anda dulu, lalu kami tampilkan panduan transfernya."}
        {langkah === 2 && "Silakan transfer sesuai nominal di bawah, lalu lanjut ke pengiriman bukti."}
        {langkah === 3 && "Terakhir, kirimkan bukti transfer Anda agar bisa diverifikasi panitia."}
      </p>

      <Stepper aktif={langkah} />

      {/* ============ Langkah 1: data peserta ============ */}
      {langkah === 1 && (
        <form onSubmit={lanjutKeTransfer} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
            <label>Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="nama">Nama lengkap <span className="text-primary">*</span></label>
              <input id="nama" className={inputCls} placeholder="Nama sesuai identitas" value={nama} onChange={(e) => setNama(e.target.value)} />
            </div>

            <div>
              <label className={labelCls} htmlFor="kategori">Kategori <span className="text-primary">*</span></label>
              <select
                id="kategori"
                className={inputCls}
                value={kategori}
                onChange={(e) => setKategori(e.target.value as Kategori)}
              >
                <option value="mahasiswa">Mahasiswa — {formatRupiah(BIAYA.mahasiswa)}</option>
                <option value="alumni">Alumni — {formatRupiah(BIAYA.alumni)}</option>
              </select>
              <p className={hintCls}>Biaya sudah termasuk jersey + refreshment.</p>
            </div>

            <div>
              <label className={labelCls} htmlFor="ukuran">Ukuran jersey <span className="text-primary">*</span></label>
              <select
                id="ukuran"
                className={inputCls}
                value={ukuranJersey}
                onChange={(e) => setUkuranJersey(e.target.value as UkuranJersey)}
              >
                {UKURAN.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls} htmlFor="wa">Nomor WhatsApp <span className="text-primary">*</span></label>
              <input id="wa" className={inputCls} inputMode="tel" placeholder="08xxxxxxxxxx" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              <p className={hintCls}>Dipakai panitia untuk konfirmasi. Tidak ditampilkan publik.</p>
            </div>

            <div>
              <label className={labelCls} htmlFor="email">Email <span className="text-muted-foreground">(opsional)</span></label>
              <input id="email" type="email" className={inputCls} placeholder="email@aktif.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button type="submit" className={`${ctaPrimary} mt-6 w-full`}>Lanjut ke Pembayaran</button>
        </form>
      )}

      {/* ============ Langkah 2: panduan transfer ============ */}
      {langkah === 2 && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Nominal yang perlu ditransfer
            </div>
            <div className="font-heading mt-2 text-4xl font-extrabold tabular-nums text-primary">
              {formatRupiah(nominal)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Kategori {KATEGORI_LABEL[kategori]} · Jersey {ukuranJersey}
            </p>
            <div className="mt-3 flex justify-center">
              <Salin nilai={String(nominal)} label="nominal" />
            </div>
            <p className={hintCls}>
              Transfer tepat sejumlah ini agar panitia mudah mencocokkan pendaftaran Anda.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="font-heading font-bold text-foreground">Rekening Resmi IKASI</div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Bank &amp; atas nama</dt>
                  <dd className="font-semibold text-foreground">{REKENING_BANK}</dd>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Nomor rekening</dt>
                  <dd className="font-mono text-lg font-bold tracking-wide text-primary">{REKENING_NOMOR}</dd>
                </div>
                <Salin nilai={REKENING_NOMOR} label="nomor rekening" />
              </div>
            </dl>
            <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
              Rekening resmi IKASI POLBAN — dana pendaftaran SALURUN dikelola bersama dana program
              beasiswa alumni secara transparan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button type="button" onClick={lanjutKeBukti} className={`${ctaPrimary} sm:flex-1`}>
              Saya Sudah Transfer
            </button>
            <button type="button" onClick={() => kembali(1)} className={ctaSecondary}>
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* ============ Langkah 3: upload bukti ============ */}
      {langkah === 3 && (
        <form onSubmit={kirim} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {/* Ringkasan */}
          <div className="mb-6 rounded-xl bg-primary/10 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Pendaftaran atas nama</div>
                <div className="font-semibold text-foreground">
                  {nama.trim()} <span className="font-normal text-muted-foreground">· {KATEGORI_LABEL[kategori]}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Jersey {ukuranJersey}</div>
                <div className="font-heading text-xl font-extrabold tabular-nums text-primary">
                  {formatRupiah(nominal)}
                </div>
              </div>
            </div>
          </div>

          <fieldset className="mb-5">
            <legend className={labelCls}>Cara kirim bukti transfer <span className="text-primary">*</span></legend>
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
            <div className="mb-5">
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
              <p className={hintCls}>Format gambar (JPG/PNG) atau PDF, maksimal 5MB. Hanya panitia yang bisa melihatnya.</p>
            </div>
          ) : (
            <div className="mb-5 rounded-lg bg-primary/10 p-4 text-sm leading-relaxed text-primary">
              Setelah dikirim, Anda akan diarahkan ke WhatsApp panitia untuk melampirkan bukti transfer.
            </div>
          )}

          <div className="mb-5">
            <label className={labelCls} htmlFor="catatan">Catatan (opsional)</label>
            <textarea
              id="catatan"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              placeholder="Pesan tambahan, jika ada"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button type="submit" disabled={sending} className={`${ctaPrimary} sm:flex-1`}>
              {sending ? "Mengirim..." : "Kirim Bukti Pendaftaran"}
            </button>
            <button type="button" onClick={() => kembali(2)} className={ctaSecondary} disabled={sending}>
              Kembali
            </button>
          </div>

          <p className={`${hintCls} text-center`}>
            Data pribadi Anda (WhatsApp, email, bukti transfer) hanya bisa dilihat panitia — tidak ditampilkan publik.
          </p>
        </form>
      )}
    </main>
  );
}
