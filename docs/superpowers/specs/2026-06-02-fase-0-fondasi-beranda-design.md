# Fase 0 — Fondasi Visual "Blueprint Teknik Sipil" + Redesign Beranda

**Tanggal:** 2026-06-02
**Proyek:** Redesign UI/UX new.ikasipolban.com
**Status:** Spec (menunggu review user → implementation plan)

---

## 1. Konteks & Tujuan

Website IKASI Polban (Next.js 16, React 19, Tailwind v4, Supabase, **static export**) berfungsi penuh tetapi lapisan presentasinya terasa seperti template generik. Audit live site menemukan: hero teks-polos tanpa karakter, kartu datar, empty state seadanya, casing nama tidak konsisten, field kosong tampil `-`/`—` telanjang, dan filter mobile terpotong.

Fase 0 adalah **fondasi dari seluruh program redesign per-halaman**. Tujuannya:

1. **Mengunci visual language** bertema *Blueprint Teknik Sipil* — agar semua halaman berikutnya (dikerjakan per-halaman) tetap satu keluarga.
2. **Mengkodekan design system** ke token Tailwind v4 + sekumpulan komponen base reusable.
3. **Membuktikan arah desain di Beranda** sebagai halaman flagship.

Setelah Fase 0, Fase 1–4 me-redesign halaman lain dengan mengonsumsi fondasi ini.

## 2. Batasan (Hard Constraints)

- **Presentasi saja.** Tidak mengubah logika fitur, query Supabase, route, atau data. Beranda tetap menarik `stats` lewat `createClient()` seperti sekarang; hanya markup/styling/UX yang berubah.
- **Static-export-safe.** `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: true`. Tidak boleh ada API route runtime, server action, atau `next/image` optimization. Animasi pakai CSS/Tailwind atau lib client ringan.
- **Tanpa dependensi berat baru** kecuali disepakati. Tekstur blueprint diutamakan via CSS (gradient, background-image SVG inline) bukan aset besar.
- **Tidak ada regresi fungsional.** Semua link, CTA, dan data counter tetap berperilaku sama.
- **Aksesibilitas:** kontras teks ≥ WCAG AA, target sentuh ≥ 44px, fokus keyboard terlihat, `prefers-reduced-motion` dihormati.

## 3. Visual Language: "Blueprint Teknik Sipil"

Karakter: situs terasa seperti **gambar teknik / blueprint** yang hidup — presisi, terstruktur, berwibawa, khas Teknik Sipil. Bukan dark-template generik.

### 3.1 Warna (token)
Memperluas token yang ada di `app/globals.css`:

- `--color-bg-primary: #0a1628` (dipertahankan, base navy)
- `--color-bg-secondary: #142340`
- `--color-accent-gold: #d4a72c` / `--color-accent-gold-dark: #b88a1c` (dipertahankan)
- **Baru** `--color-blueprint-line: rgba(120, 170, 220, 0.12)` — garis grid blueprint cyan tipis (tekstur, bukan warna dominan)
- **Baru** `--color-blueprint-line-strong: rgba(120, 170, 220, 0.22)` — untuk corner ticks / garis dimensi
- Teks: `--color-text-primary/secondary/muted` dipertahankan.

Gold tetap warna aksi/identitas utama; cyan blueprint **hanya tekstur/garis**, tidak pernah jadi tombol/teks penting (hindari pergeseran identitas berlebihan).

### 3.2 Tekstur & motif khas
- **Grid blueprint halus** sebagai background section terpilih (CSS `linear-gradient` grid memakai `--color-blueprint-line`), opacity rendah agar tidak ramai.
- **Corner ticks / crop marks** di sudut kartu & section penting (sudut bersiku seperti gambar teknik).
- **Garis dimensi/anotasi** opsional pada hero (mis. garis dengan ujung tick yang "mengukur" statistik).
- Motif diterapkan **hemat** — aksen, bukan wallpaper.

### 3.3 Tipografi
- **Heading:** font tegas/geometris (kandidat: *Space Grotesk* atau *Archivo* via `next/font/google`) untuk kesan teknis. Dipilih final saat implementasi setelah cek di Stitch.
- **Body:** tetap **Inter** (sudah terpasang).
- Skala tipografi konsisten (mis. display/h1/h2/h3/body/caption) didefinisikan sebagai utilitas/token.

### 3.4 Spasi & bentuk
- Radius kartu `--radius-card: 16px` dipertahankan; opsi sudut tajam + corner tick untuk elemen "teknis".
- Ritme spacing section konsisten (skala 4/8) — diterapkan via `SectionShell`.

## 4. Komponen Base (deliverable Fase 0)

Komponen reusable yang dipakai lintas halaman. Masing-masing punya satu tujuan jelas, props eksplisit, dan dapat diuji terpisah. Lokasi: `components/ui/`.

| Komponen | Tujuan | Props inti | Catatan |
|---|---|---|---|
| `SectionShell` | Wrapper section + ritme spacing + opsi grid blueprint | `children`, `grid?`, `className` | Sumber konsistensi spacing |
| `PageHeader` | Header halaman seragam (judul + sub + breadcrumb) | `title`, `subtitle?`, `breadcrumb?`, `accent?` | Mengganti pola header ad-hoc tiap halaman |
| `Card` | Kartu dasar bergaya blueprint (corner ticks) | `as?`, `href?`, `interactive?`, `children` | Basis untuk alumni/bisnis/berita card nanti |
| `EmptyState` | Empty state berkarakter (ikon/blueprint + pesan + CTA opsional) | `title`, `description?`, `action?`, `icon?` | Ganti "Belum ada..." teks polos |
| `Badge` | Label/tag konsisten | `variant`, `children` | Untuk angkatan, prodi, kategori |
| `Avatar` | Avatar inisial konsisten + **normalisasi casing** | `name`, `size`, `colorSeed?` | Membungkus/menggantikan `AvatarPlaceholder` |
| `StatBlock` | Satu metrik (angka besar + label) | `value`, `label`, `loading?` | Dipakai di hero/stats; fix layout mobile |
| `Button`/`buttonStyles` | Gaya tombol konsisten (gold / outline) | `variant`, `size` | Menstandarkan `.btn-gold` & outline yang sekarang inline |

**Utilitas pendukung:**
- `formatName(name)` — normalisasi casing (Title Case) untuk mengatasi `AJENG MELIANA RIZKY` vs `Heni Nuraeni`.
- `displayOrDash(value, fallback)` / pola "graceful empty" — field kosong tidak ditampilkan sebagai `-`/`—` telanjang; baris disembunyikan atau diberi placeholder bermakna.

Komponen base tidak mengandung logika data — murni presentasi, menerima data via props.

## 5. Redesign Beranda (`app/(public)/page.tsx`)

Mempertahankan **semua konten & fungsi**: badge "IKATAN ALUMNI…", judul "Satu Platform, Ribuan Alumni", deskripsi, 2 CTA (`/alumni`, `/daftar`), 3 statistik live (alumni/angkatan/bisnis), grid 6 fitur, CTA banner "Sudah lulus?". Yang berubah hanya tampilan & micro-UX.

### 5.1 Hero
- Latar **grid blueprint** halus + garis dimensi/anotasi yang "mengukur" hero (motif teknik).
- Tipografi heading baru, hierarki lebih kuat; CTA pakai `Button`.
- Tetap responsif; perbaiki ritme spacing.

### 5.2 Statistik
- Pakai `StatBlock`. **Fix mobile**: dari 3-kolom berjejal → grid yang nyaman (mis. tetap 3 kolom tapi dengan ukuran/garis pemisah blueprint, atau 1–3 adaptif) sehingga angka terbaca.
- Sambungkan ke garis dimensi blueprint (angka seolah hasil "pengukuran").

### 5.3 Grid Fitur
- Pakai `Card` bergaya blueprint dengan corner ticks dan ikon yang lebih bermakna (ganti emoji generik dengan ikon garis/teknis konsisten — set ikon SVG ringan, static-safe).
- Hover state lebih hidup namun halus.

### 5.4 CTA Banner
- Panel bergaya blueprint (border gold + grid halus), `Button` konsisten.

### 5.5 Nav & Footer (penyesuaian minimal)
- Nav (`components/layout/nav.tsx`) & footer disesuaikan agar selaras visual language **tanpa** mengubah struktur menu/auth. Detail penuh nav/footer bisa difinalkan di fase berikut; Fase 0 cukup menyelaraskan border/tekstur agar beranda tampak utuh.

## 6. Alur Kerja (toolchain) untuk Fase 0

1. **Stitch** — buat/`get` project, definisikan design system (warna+tipografi+motif blueprint), generate mockup **Beranda** (desktop+mobile) bergaya blueprint; iterasi via `edit_screens`/`generate_variants`.
2. **ui-ux-pro-max** — validasi pola layout, aksesibilitas, spacing, hierarki sebelum & saat implement.
3. **Magic 21st.dev** — bila perlu komponen kompleks (hero blueprint animatif, StatBlock dengan garis dimensi) sebagai titik awal, lalu disesuaikan ke token kita.
4. **Implementasi** — token di `globals.css` + komponen base di `components/ui/` + refactor `page.tsx` memakainya.
5. **QA** — jalankan dev, screenshot desktop (1440) + mobile (390), bandingkan dengan mockup, cek tidak ada regresi fungsi (counter live, semua link).

## 7. Definition of Done (Fase 0)

- [ ] Token blueprint + tipografi heading terpasang di `globals.css` (atau config Tailwind v4).
- [ ] Komponen base (`SectionShell`, `PageHeader`, `Card`, `EmptyState`, `Badge`, `Avatar`, `StatBlock`, `Button`) ter-implement di `components/ui/` dengan props jelas.
- [ ] Utilitas `formatName` + pola graceful-empty tersedia & teruji.
- [ ] Beranda di-redesign memakai komponen base; semua konten & fungsi identik (counter live tetap jalan, 8 link tetap benar).
- [ ] Mockup Stitch beranda disetujui sebagai acuan visual language.
- [ ] Lolos QA desktop + mobile; statistik mobile tidak lagi berjejal; tidak ada horizontal scroll.
- [ ] Kontras AA, fokus keyboard, `prefers-reduced-motion` dihormati.
- [ ] `pnpm build` (static export) sukses tanpa error.

## 8. Di Luar Scope Fase 0

- Redesign halaman selain Beranda (Fase 1–4).
- Perubahan skema data / normalisasi casing **di database** (Fase 0 hanya normalisasi di tampilan via `formatName`).
- Redesign penuh Nav/Footer (Fase 0 hanya selaraskan minimal).

## 9. Risiko & Mitigasi

- **Inkonsistensi antar halaman** (konsekuensi per-halaman) → dimitigasi dengan mengunci token + komponen base di Fase 0 sebagai acuan wajib.
- **Tekstur blueprint terlalu ramai** → terapkan hemat, opacity rendah, uji di mobile.
- **Font heading baru menambah berat** → pilih satu font via `next/font` (subset latin), pantau ukuran.
- **Static export membatasi animasi** → andalkan CSS; tidak ada runtime server.
