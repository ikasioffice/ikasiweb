# Fase 1 — Redesign Direktori (Alumni, Angkatan, Profil, Detail)

**Tanggal:** 2026-06-02
**Proyek:** Redesign UI/UX new.ikasipolban.com
**Status:** Spec → implementation plan
**Bergantung pada:** Fase 0 (visual language + komponen base sudah terpasang)

---

## 1. Tujuan

Menerapkan visual language Blueprint (Fase 0) ke halaman direktori, sekaligus memperbaiki temuan audit konkret: casing nama tidak konsisten, field kosong tampil `—` telanjang, filter mobile terpotong, empty state polos, dan emoji sebagai ikon UI.

Halaman dalam scope:
- `/alumni` — direktori alumni (list + filter)
- `/angkatan` — daftar angkatan
- `/angkatan/[tahun]` — alumni per angkatan
- `/me` — profil sendiri (tampilan, BUKAN form edit/upload)
- `/alumni/[id]` — detail profil alumni publik

## 2. Batasan (Hard Constraints)

- **Presentasi-saja.** Tidak menyentuh: query Supabase (`listAlumniPublic`, `getAlumniById`, `getAlumniContact`, `matchesAlumniFilter`), logika auth/verifikasi (`useAuth`, `isVerified`, `isAdmin`), upload foto (`handlePhotoUpload`), simpan form (`handleSave`), gating kontak, atau route.
- **Static-export-safe.** Tidak ada API runtime / server action baru.
- **Tanpa regresi fungsional.** Filter tetap memfilter, edit profil tetap menyimpan, gating kontak tetap berfungsi, semua link tetap benar.
- **Aksesibilitas:** kontras AA, target sentuh ≥44px (penting untuk dropdown filter mobile), fokus keyboard terlihat.

## 3. Komponen bersama baru (deliverable Fase 1)

### 3.1 `components/ui/icons.tsx` — perluas dengan `LineIcon`
Tambah named export `LineIcon` (selain `FeatureIcon` yang sudah ada) untuk ikon utilitas garis, menggantikan emoji. Nama ikon minimal: `pin` (lokasi), `lock`, `check`, `mail`, `warning`, `briefcase`, `cap` (pendidikan/angkatan). SVG stroke, `aria-hidden`, default 16px, `className` untuk warna/ukuran.

### 3.2 `components/ui/info-field.tsx` — `InfoField`
Pengganti pola `Field` (`value || "—"`). Props: `label: string`, `value: string | number | null | undefined`. Memakai `displayOrDash`: bila hasil `null`, **render `null`** (baris hilang). Pemanggil membungkus dalam grid; field kosong otomatis tidak tampil.

### 3.3 `components/domain/alumni-card.tsx` — dibangun ulang
- Basis `Card` (`href={/alumni/${id}}`, corner ticks).
- Foto: bila `foto_url` ada → `<img>` (unoptimized, static-safe); else `Avatar` (pakai `formatName`).
- Nama: `formatName(alumni.nama)`.
- Angkatan/prodi: tetap; prodi via `displayOrDash`.
- Jabatan/tempat kerja: via `displayOrDash` (sembunyikan bila kosong — fix kartu "kosong").
- Tag/badge: `Badge` (bidang pekerjaan, SKA gold; domisili neutral dengan `LineIcon name="pin"` menggantikan 📍).
- Footer: ganti `🔒`/`✓` dengan `LineIcon name="lock"`/`"check"`.
- Prop `isVerified?` tetap.

## 4. Per-halaman

### 4.1 `/alumni` (`app/(public)/alumni/page.tsx`)
- Header ad-hoc → `PageHeader` (title "Direktori {n} Alumni", subtitle, breadcrumb "Beranda / Direktori Alumni").
- Bungkus konten dalam `SectionShell`.
- Grid pakai `AlumniCard` baru. Skeleton loading tetap.
- Data fetching & state filter **tidak diubah**.

### 4.2 `SearchFilterBar` (`components/domain/search-filter-bar.tsx`) — FIX MOBILE
- **Masalah:** di mobile, `<Select>` pakai `flex-1 min-w-0` → label "Angkatan"/"Domisili" terpotong jadi "Angka"/"Domis".
- **Perbaikan:** mobile = dropdown **full-width stack** (grid 1 kolom atau 2 kolom dengan lebar cukup), label tidak terpotong, tinggi ≥44px. Desktop tetap layout grid `[2fr_1fr_1fr_1fr_auto]`.
- Styling selaras blueprint (border, glass) tapi **props & callback tidak berubah**.

### 4.3 `/angkatan` (`app/(public)/angkatan/page.tsx`)
- `PageHeader` ("Per Angkatan").
- Kartu angkatan pakai `Card` (corner ticks, hover). Konten (tahun, count, prodi) tetap.

### 4.4 `/angkatan/[tahun]` (`angkatan-detail-client.tsx`)
- `PageHeader` ("Angkatan {tahun}", subtitle "{n} alumni terdaftar").
- `AlumniCard` baru.
- Empty state ("Tidak ada alumni ditemukan.") → `EmptyState` berkarakter.

### 4.5 `/me` (`app/(public)/me/page.tsx`)
- Header profil: avatar (tetap pakai foto upload existing; fallback inisial pakai `formatName`), nama ter-normalisasi.
- Section "Data Diri" (mode tampil), "Kontak", "Nomor Anggota", quick actions → bungkus `Card`.
- Mode tampil: ganti helper `Field` lokal (`value || "—"`) dengan `InfoField` (sembunyikan kosong).
- Emoji `⚠` → `LineIcon name="warning"`.
- **JANGAN ubah:** `EditForm`, `handleSave`, `handlePhotoUpload`, toggle SKA, state editing, `AuthGuard`. Mode edit tetap apa adanya (boleh selaras styling minor, tapi tidak mengubah perilaku/field).

### 4.6 `/alumni/[id]` (`alumni-detail-client.tsx`)
- Header pakai `Avatar` (fallback) + `formatName(nama)`.
- Section/Field lokal → `InfoField` (sembunyikan kosong) di dalam `Card` per-section.
- Emoji `📧`/`⚠` → `LineIcon`.
- `LoginPrompt` tetap dipakai untuk gating kontak (komponennya sendiri boleh ganti 💼 → `LineIcon` di Fase 1 sebagai bonus kecil).

## 5. Definition of Done

- [ ] `LineIcon` + `InfoField` ter-implement & teruji (kontrak).
- [ ] `AlumniCard` baru pakai `Card`/`Avatar`/`Badge`/`formatName`/`displayOrDash`; tanpa emoji.
- [ ] `SearchFilterBar` mobile: label dropdown TIDAK terpotong, target ≥44px.
- [ ] Semua 5 halaman pakai `PageHeader`; empty state pakai `EmptyState`.
- [ ] Tidak ada emoji sebagai ikon UI di halaman direktori.
- [ ] Nama ter-normalisasi (`formatName`) di kartu & detail.
- [ ] Field kosong tidak tampil `—` di `/me` & detail.
- [ ] Semua unit test + e2e lama tetap PASS; tambah e2e regresi direktori.
- [ ] `pnpm build` sukses.
- [ ] QA desktop+mobile: filter mobile terbaca penuh, tidak ada horizontal scroll.

## 6. Di luar scope
- Form edit profil & upload foto (logika) — hanya styling minor diizinkan, perilaku tetap.
- Halaman Bisnis/Event/Berita/Info/Admin (Fase 2–4).
- Perubahan skema/normalisasi casing di database.

## 7. Risiko & Mitigasi
- **`/me` kompleks (348 baris)** → hanya sentuh mode tampil + section wrapper + ikon; e2e/QA memastikan edit & upload tetap jalan.
- **Filter fix merusak desktop** → uji kedua viewport; props tak berubah.
- **AlumniCard dipakai di 2 tempat** (`/alumni`, `/angkatan/[tahun]`) → satu perubahan, uji keduanya.
