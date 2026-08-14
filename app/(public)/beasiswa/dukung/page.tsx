"use client";

import { useState } from "react";
import Link from "next/link";
import { kirimDonasi, unggahBukti, formatRupiah } from "@/lib/data/beasiswa";
import { REKENING_BANK, REKENING_NOMOR, WA_NUMBER, teks } from "../_content";
import { useBeasiswa } from "../_use-beasiswa";

const MAX_BUKTI_BYTES = 5 * 1024 * 1024;

type Langkah = 1 | 2 | 3;
type Metode = "Transfer Bank BSI" | "QRIS";
type CaraBukti = "upload" | "whatsapp";

const LANGKAH: { no: Langkah; label: string }[] = [
  { no: 1, label: "Data Donatur" },
  { no: 2, label: "Transfer" },
  { no: 3, label: "Bukti" },
];

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

export default function DukungPage() {
  const { data } = useBeasiswa();
  const c = data?.content ?? {};

  const [langkah, setLangkah] = useState<Langkah>(1);

  // Langkah 1
  const [nama, setNama] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nominal, setNominal] = useState("");
  const [honeypot, setHoneypot] = useState(""); // anti-spam: harus tetap kosong

  // Langkah 2
  const [metode, setMetode] = useState<Metode>("Transfer Bank BSI");

  // Langkah 3
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 10));
  const [cara, setCara] = useState<CaraBukti>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [catatan, setCatatan] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const nominalAngka = Number(nominal.replace(/\D/g, "")) || 0;

  function lanjutKeTransfer(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nama.trim() || !angkatan.trim()) {
      setError("Nama lengkap dan angkatan wajib diisi.");
      return;
    }
    if (!whatsapp.trim()) {
      setError("Nomor WhatsApp wajib diisi agar admin bisa mengonfirmasi dukungan Anda.");
      return;
    }
    if (nominalAngka <= 0) {
      setError("Jumlah donasi wajib diisi dan harus lebih dari nol.");
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

    const { error: insErr } = await kirimDonasi({
      nama: nama.trim(),
      angkatan: angkatan.trim(),
      whatsapp: whatsapp.trim() || null,
      nominal: nominalAngka,
      tanggal_transfer: tanggal || null,
      metode,
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
        ? `Halo IKASI, saya ${nama.trim()} (angkatan ${angkatan.trim()}) sudah berdonasi ${formatRupiah(nominalAngka)} untuk Program Beasiswa Alumni lewat ${metode}. Bukti transfernya saya kirimkan di chat ini.`
        : `Halo IKASI, saya ${nama.trim()} (angkatan ${angkatan.trim()}) sudah berdonasi ${formatRupiah(nominalAngka)} untuk Program Beasiswa Alumni beserta bukti transfernya lewat form di website. Mohon dicek, terima kasih.`;

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
              ? "Data dukungan Anda sudah kami terima. Klik tombol di bawah untuk membuka WhatsApp, lalu lampirkan foto bukti transfer di chat yang sama."
              : "Data dan bukti transfer Anda sudah kami terima. Dukungan akan tampil di halaman Beasiswa setelah diverifikasi admin."}
          </p>

          <div className="mx-auto mt-6 max-w-xs rounded-xl bg-primary/10 p-4">
            <div className="text-xs text-muted-foreground">Nominal dukungan</div>
            <div className="font-heading text-2xl font-extrabold tabular-nums text-primary">
              {formatRupiah(nominalAngka)}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaPrimary}
            >
              {cara === "whatsapp" ? "Kirim Bukti via WhatsApp" : "Konfirmasi ke WhatsApp Admin"}
            </a>
            <Link href="/beasiswa" className={ctaSecondary}>
              Kembali ke Halaman Beasiswa
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
        <Link href="/beasiswa" className="hover:text-foreground">Beasiswa Alumni</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Donasi</span>
      </nav>

      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        Dukung <span className="text-primary">Beasiswa Alumni</span>
      </h1>
      <p className="mb-8 mt-2 text-muted-foreground">
        {langkah === 1 && "Isi data Anda dulu, lalu kami tampilkan panduan transfernya."}
        {langkah === 2 && "Silakan transfer sesuai nominal di bawah, lalu lanjut ke pengiriman bukti."}
        {langkah === 3 && "Terakhir, kirimkan bukti transfer Anda agar bisa diverifikasi admin."}
      </p>

      <Stepper aktif={langkah} />

      {/* ============ Langkah 1: data donatur ============ */}
      {langkah === 1 && (
        <form onSubmit={lanjutKeTransfer} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
            <label>Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="nama">Nama lengkap <span className="text-primary">*</span></label>
              <input id="nama" className={inputCls} placeholder="Nama sesuai identitas" value={nama} onChange={(e) => setNama(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="angkatan">Angkatan <span className="text-primary">*</span></label>
              <input id="angkatan" className={inputCls} inputMode="numeric" placeholder="Contoh: 2015" value={angkatan} onChange={(e) => setAngkatan(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="wa">Nomor WhatsApp <span className="text-primary">*</span></label>
              <input id="wa" className={inputCls} inputMode="tel" placeholder="08xxxxxxxxxx" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              <p className={hintCls}>Dipakai admin untuk konfirmasi. Tidak ditampilkan publik.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="nominal">Jumlah donasi <span className="text-primary">*</span></label>
              <input
                id="nominal"
                className={inputCls}
                inputMode="numeric"
                placeholder="500.000"
                value={nominal}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, "");
                  setNominal(d ? Number(d).toLocaleString("id-ID") : "");
                }}
              />
              {nominalAngka > 0 && <p className={hintCls}>{formatRupiah(nominalAngka)}</p>}
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button type="submit" className={`${ctaPrimary} mt-6 w-full`}>Proses Donasi</button>
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
              {formatRupiah(nominalAngka)}
            </div>
            <div className="mt-3 flex justify-center">
              <Salin nilai={String(nominalAngka)} label="nominal" />
            </div>
            <p className={hintCls}>
              Transfer tepat sejumlah ini agar admin mudah mencocokkan dukungan Anda.
            </p>
          </div>

          {/* Pilih metode */}
          <div className="grid gap-3 sm:grid-cols-2">
            {(["Transfer Bank BSI", "QRIS"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetode(m)}
                className={`rounded-xl border p-4 text-left text-sm transition-colors ${
                  metode === m
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-border bg-card hover:bg-accent"
                }`}
                aria-pressed={metode === m}
              >
                {m === "Transfer Bank BSI" ? "Transfer Bank" : "Scan QRIS"}
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  {m === "Transfer Bank BSI" ? "Lewat m-banking atau ATM" : "Semua e-wallet & m-banking"}
                </span>
              </button>
            ))}
          </div>

          {/* Detail metode terpilih */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {metode === "Transfer Bank BSI" ? (
              <>
                <div className="font-heading font-bold text-foreground">{teks(c, "rekening_judul")}</div>
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
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="font-heading mb-4 font-bold text-foreground">Scan QRIS</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/beasiswa-qris.png"
                  alt="Kode QRIS untuk donasi Beasiswa Alumni IKASI"
                  className="w-full max-w-[260px] rounded-lg"
                />
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Satu QRIS untuk semua e-wallet dan m-banking
                </p>
              </div>
            )}

            <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
              {teks(c, "rekening_desc")}
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
                <div className="text-xs text-muted-foreground">Donasi atas nama</div>
                <div className="font-semibold text-foreground">
                  {nama.trim()} <span className="font-normal text-muted-foreground">· {angkatan.trim()}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{metode}</div>
                <div className="font-heading text-xl font-extrabold tabular-nums text-primary">
                  {formatRupiah(nominalAngka)}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className={labelCls} htmlFor="tanggal">Tanggal transfer</label>
            <input id="tanggal" type="date" className={inputCls} value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
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
              <p className={hintCls}>Format gambar (JPG/PNG) atau PDF, maksimal 5MB. Hanya admin yang bisa melihatnya.</p>
            </div>
          ) : (
            <div className="mb-5 rounded-lg bg-primary/10 p-4 text-sm leading-relaxed text-primary">
              Setelah dikirim, Anda akan diarahkan ke WhatsApp admin untuk melampirkan bukti transfer.
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
              {sending ? "Mengirim..." : "Kirim Bukti Dukungan"}
            </button>
            <button type="button" onClick={() => kembali(2)} className={ctaSecondary} disabled={sending}>
              Kembali
            </button>
          </div>

          <p className={`${hintCls} text-center`}>
            Yang tampil publik hanya nama, angkatan, dan nominal — nomor WhatsApp dan bukti transfer tidak ditampilkan.
          </p>
        </form>
      )}
    </main>
  );
}
