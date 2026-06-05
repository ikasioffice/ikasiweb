"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const CURRENT_YEAR = 2026;
const ANGKATAN_OPTIONS = Array.from(
  { length: CURRENT_YEAR - 1982 + 1 },
  (_, i) => CURRENT_YEAR - i,
);

const PRODI_OPTIONS = [
  "TEKNIK KONSTRUKSI GEDUNG",
  "TEKNIK KONSTRUKSI SIPIL",
  "TEKNIK PERANCANGAN JALAN DAN JEMBATAN",
  "TEKNIK PERAWATAN DAN PERBAIKAN GEDUNG",
];

type FormState = {
  // Data diri
  nama: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  domisili: string;
  email: string;
  no_hp: string;
  // Pendidikan Polban
  angkatan: string;
  prodi: string;
  prodi_lainnya: string;
  tahun_lulus: string;
  // Pekerjaan
  bidang_pekerjaan: string;
  tempat_kerja: string;
  jabatan: string;
  // Pendidikan terakhir
  pendidikan_terakhir: string;
  institusi: string;
  // Kompetensi & partisipasi
  punya_ska: boolean;
  bidang_ska: string;
  ikut_s2_polban: string;
  bersedia_kp: boolean;
  bersedia_dosen_tamu: string;
  bersedia_pengurus: boolean;
  minat_hobi: string;
};

const INITIAL: FormState = {
  nama: "", jenis_kelamin: "", tanggal_lahir: "", domisili: "", email: "", no_hp: "",
  angkatan: "", prodi: "", prodi_lainnya: "", tahun_lulus: "",
  bidang_pekerjaan: "", tempat_kerja: "", jabatan: "",
  pendidikan_terakhir: "", institusi: "",
  punya_ska: false, bidang_ska: "", ikut_s2_polban: "", bersedia_kp: false,
  bersedia_dosen_tamu: "", bersedia_pengurus: false, minat_hobi: "",
};

const inputCls =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring";
const labelCls = "mb-1 block text-xs font-medium text-muted-foreground";

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-input bg-background px-3 py-2.5">
      <span className="text-sm text-foreground">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        aria-pressed={value}
        className={`h-5 w-10 shrink-0 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`mx-0.5 block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading mb-3 mt-2 text-sm font-bold uppercase tracking-widest text-primary">
      {children}
    </h2>
  );
}

export default function DaftarPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [honeypot, setHoneypot] = useState(""); // anti-spam: harus tetap kosong
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nama = form.nama.trim();
    const email = form.email.trim().toLowerCase();
    if (!nama || !form.angkatan || !email) {
      setError("Nama, angkatan, dan email wajib diisi.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    // Honeypot terisi → kemungkinan bot. Pura-pura sukses, tidak menyimpan.
    if (honeypot) { setDone(true); return; }

    setSending(true);
    const prodi = form.prodi === "__lain__" ? form.prodi_lainnya.trim() : form.prodi;
    const minatArr = form.minat_hobi
      ? form.minat_hobi.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const { error: insErr } = await createClient().from("alumni").insert({
      nama,
      angkatan: parseInt(form.angkatan, 10),
      prodi: prodi || null,
      jenis_kelamin: form.jenis_kelamin || null,
      tanggal_lahir: form.tanggal_lahir || null,
      domisili: form.domisili.trim() || null,
      email,
      no_hp: form.no_hp.trim() || null,
      tahun_lulus: form.tahun_lulus ? parseInt(form.tahun_lulus, 10) : null,
      bidang_pekerjaan: form.bidang_pekerjaan.trim() || null,
      tempat_kerja: form.tempat_kerja.trim() || null,
      jabatan: form.jabatan.trim() || null,
      pendidikan_terakhir: form.pendidikan_terakhir.trim() || null,
      institusi: form.institusi.trim() || null,
      punya_ska: form.punya_ska,
      bidang_ska: form.punya_ska ? (form.bidang_ska.trim() || null) : null,
      ikut_s2_polban: form.ikut_s2_polban || null,
      bersedia_kp: form.bersedia_kp,
      bersedia_dosen_tamu: form.bersedia_dosen_tamu || null,
      bersedia_pengurus: form.bersedia_pengurus,
      minat_hobi: minatArr.length ? minatArr : null,
      is_verified: false,
      is_form_filled: true,
      auth_user_id: null,
      source_layer: "pendaftaran_mandiri",
    });
    setSending(false);

    if (insErr) {
      setError("Gagal mengirim pendaftaran. Coba lagi sebentar.");
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <main className="relative mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="bp-grid bp-grid-fade absolute inset-0" />
        <div className="relative rounded-2xl border border-primary/30 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight">Pendaftaran terkirim 🎉</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Terima kasih, <strong className="text-foreground">{form.nama.trim()}</strong>. Data kamu kami terima dan sedang
            menunggu <strong className="text-foreground">verifikasi pengurus</strong>.
          </p>
          <div className="mt-5 rounded-xl bg-primary/10 p-4 text-left text-sm text-foreground">
            <div className="font-semibold text-primary">Langkah selanjutnya</div>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-muted-foreground">
              <li>Pengurus memverifikasi data kamu (biasanya 1–3 hari).</li>
              <li>Setelah disetujui, buka halaman <strong className="text-foreground">Masuk</strong>.</li>
              <li>Pilih <strong className="text-foreground">Magic Link</strong> dan masukkan email <strong className="text-foreground">{form.email.trim().toLowerCase()}</strong> — link masuk dikirim ke email itu.</li>
            </ol>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex h-10 items-center rounded-md border border-input bg-background px-5 text-sm font-semibold transition-colors hover:bg-accent">Ke Beranda</Link>
            <a href="https://wa.me/6281234681730?text=Halo%20IKASI%2C%20saya%20baru%20mendaftar%20sebagai%20alumni%20dan%20ingin%20menanyakan%20verifikasi." target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Hubungi Pengurus</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="bp-grid bp-grid-fade absolute inset-0" />
      <div className="relative">
        <nav className="mb-3 text-xs text-muted-foreground">
          <Link href="/cara-bergabung" className="hover:text-foreground">Cara Bergabung</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Formulir Pendaftaran</span>
        </nav>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Formulir <span className="text-primary">Pendaftaran</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Isi data alumni Teknik Sipil Polban. Field bertanda <span className="text-primary">*</span> wajib diisi.
          Data dikirim ke pengurus untuk diverifikasi. Sudah terdaftar?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">Cukup login di sini.</Link>
        </p>

        <form onSubmit={handleSubmit} className="relative mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {/* Honeypot anti-spam (disembunyikan dari user) */}
          <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
            <label>Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
          </div>

          {/* Data diri */}
          <GroupTitle>Data Diri</GroupTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Nama Lengkap <span className="text-primary">*</span></label>
              <input className={inputCls} value={form.nama} onChange={(e) => set("nama", e.target.value)} placeholder="Nama sesuai ijazah" required />
            </div>
            <div>
              <label className={labelCls}>Jenis Kelamin</label>
              <select className={inputCls} value={form.jenis_kelamin} onChange={(e) => set("jenis_kelamin", e.target.value)}>
                <option value="">— Pilih —</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Tanggal Lahir</label>
              <input type="date" className={inputCls} value={form.tanggal_lahir} onChange={(e) => set("tanggal_lahir", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Email <span className="text-primary">*</span></label>
              <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@aktif.com" required />
            </div>
            <div>
              <label className={labelCls}>No. HP / WhatsApp</label>
              <input type="tel" className={inputCls} value={form.no_hp} onChange={(e) => set("no_hp", e.target.value)} placeholder="08xxxxxxxxxx" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Domisili</label>
              <input className={inputCls} value={form.domisili} onChange={(e) => set("domisili", e.target.value)} placeholder="Kota / Kabupaten" />
            </div>
          </div>

          {/* Pendidikan Polban */}
          <div className="mt-6 border-t border-border pt-5">
            <GroupTitle>Pendidikan di Polban</GroupTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Angkatan <span className="text-primary">*</span></label>
                <select className={inputCls} value={form.angkatan} onChange={(e) => set("angkatan", e.target.value)} required>
                  <option value="">— Pilih tahun —</option>
                  {ANGKATAN_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Tahun Lulus</label>
                <input type="number" min={1985} max={CURRENT_YEAR} className={inputCls} value={form.tahun_lulus} onChange={(e) => set("tahun_lulus", e.target.value)} placeholder="mis. 2015" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Program Studi</label>
                <select className={inputCls} value={form.prodi} onChange={(e) => set("prodi", e.target.value)}>
                  <option value="">— Pilih prodi —</option>
                  {PRODI_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  <option value="__lain__">Lainnya…</option>
                </select>
              </div>
              {form.prodi === "__lain__" && (
                <div className="sm:col-span-2">
                  <label className={labelCls}>Tulis Program Studi</label>
                  <input className={inputCls} value={form.prodi_lainnya} onChange={(e) => set("prodi_lainnya", e.target.value)} placeholder="Nama program studi" />
                </div>
              )}
            </div>
          </div>

          {/* Pekerjaan */}
          <div className="mt-6 border-t border-border pt-5">
            <GroupTitle>Pekerjaan</GroupTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Bidang Pekerjaan</label>
                <input className={inputCls} value={form.bidang_pekerjaan} onChange={(e) => set("bidang_pekerjaan", e.target.value)} placeholder="mis. Konstruksi, Konsultan" />
              </div>
              <div>
                <label className={labelCls}>Jabatan</label>
                <input className={inputCls} value={form.jabatan} onChange={(e) => set("jabatan", e.target.value)} placeholder="mis. Site Engineer" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Tempat Kerja / Perusahaan</label>
                <input className={inputCls} value={form.tempat_kerja} onChange={(e) => set("tempat_kerja", e.target.value)} placeholder="Nama perusahaan / instansi" />
              </div>
            </div>
          </div>

          {/* Pendidikan terakhir */}
          <div className="mt-6 border-t border-border pt-5">
            <GroupTitle>Pendidikan Terakhir</GroupTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Jenjang / Pendidikan Terakhir</label>
                <input className={inputCls} value={form.pendidikan_terakhir} onChange={(e) => set("pendidikan_terakhir", e.target.value)} placeholder="mis. D3, D4/S1, S2" />
              </div>
              <div>
                <label className={labelCls}>Institusi</label>
                <input className={inputCls} value={form.institusi} onChange={(e) => set("institusi", e.target.value)} placeholder="Nama kampus" />
              </div>
            </div>
          </div>

          {/* Kompetensi & partisipasi */}
          <div className="mt-6 border-t border-border pt-5">
            <GroupTitle>Kompetensi & Partisipasi</GroupTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Toggle label="Punya SKA / SKK" value={form.punya_ska} onChange={(v) => set("punya_ska", v)} /></div>
              {form.punya_ska && (
                <div className="sm:col-span-2">
                  <label className={labelCls}>Bidang SKA / SKK</label>
                  <input className={inputCls} value={form.bidang_ska} onChange={(e) => set("bidang_ska", e.target.value)} placeholder="mis. Ahli Teknik Bangunan Gedung" />
                </div>
              )}
              <div>
                <label className={labelCls}>Ikut S2 Polban?</label>
                <select className={inputCls} value={form.ikut_s2_polban} onChange={(e) => set("ikut_s2_polban", e.target.value)}>
                  <option value="">— Pilih —</option>
                  <option value="Ya">Ya</option>
                  <option value="Tidak">Tidak</option>
                  <option value="Berminat">Berminat</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Bersedia jadi Dosen Tamu?</label>
                <select className={inputCls} value={form.bersedia_dosen_tamu} onChange={(e) => set("bersedia_dosen_tamu", e.target.value)}>
                  <option value="">— Pilih —</option>
                  <option value="Ya">Ya</option>
                  <option value="Tidak">Tidak</option>
                </select>
              </div>
              <div><Toggle label="Bersedia menerima mahasiswa KP/magang" value={form.bersedia_kp} onChange={(v) => set("bersedia_kp", v)} /></div>
              <div><Toggle label="Bersedia jadi pengurus IKASI" value={form.bersedia_pengurus} onChange={(v) => set("bersedia_pengurus", v)} /></div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Minat / Hobi <span className="text-muted-foreground">(pisahkan dengan koma)</span></label>
                <input className={inputCls} value={form.minat_hobi} onChange={(e) => set("minat_hobi", e.target.value)} placeholder="mis. Sepak bola, Fotografi, Mendaki" />
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Mengirim…" : "Kirim Pendaftaran"}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Data kamu hanya terlihat pengurus sampai diverifikasi. No. HP & email tidak ditampilkan publik.
          </p>
        </form>
      </div>
    </main>
  );
}
