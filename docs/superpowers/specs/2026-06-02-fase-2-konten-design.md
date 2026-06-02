# Fase 2 — Redesign Konten (Bisnis, Event, Berita)

**Tanggal:** 2026-06-02
**Proyek:** Redesign UI/UX new.ikasipolban.com
**Status:** Spec → implementation plan
**Bergantung pada:** Fase 0 (komponen base) + Fase 1 (LineIcon, InfoField)

---

## 1. Tujuan
Terapkan visual language Blueprint ke halaman konten + perbaiki temuan audit: kartu bisnis nama `—`, emoji sebagai ikon, empty state polos, berita tanpa visual.

Scope: `/bisnis`, `/bisnis/[id]`, `/event`, `/event/[id]`, `/news`, `/news/[slug]`.

## 2. Batasan (Hard Constraints)
- **Presentasi-saja.** Tidak menyentuh: query Supabase (`listBisnis`, `getBisnisById`, `listPublishedEvents`, `getEventById`, `rsvpEvent`, `hasRsvped`, `listPublishedPosts`, `getPostBySlug`), logika RSVP, `renderMarkdown`, auth, route.
- **Static-export-safe**, tanpa regresi fungsional.
- **`formatName` HANYA untuk nama orang.** Nama brand, judul event, judul berita TIDAK dinormalisasi (mis. "CV Ananta Putra" harus tetap, bukan "Cv Ananta Putra").
- Aksesibilitas: kontras AA, target sentuh ≥44px, fokus terlihat.

## 3. Komponen bersama baru

### 3.1 `components/ui/icons.tsx` — tambah ikon ke `LineIcon`
Tambah nama: `phone`, `link`, `calendar`, `store`, `users` (untuk RSVP count). (Selain pin/lock/check/mail/warning/briefcase/cap yang sudah ada.)

### 3.2 `components/ui/poster-thumb.tsx` — `PosterThumb`
Thumbnail gambar dengan fallback `LineIcon` (bukan emoji). Props: `src?: string | null`, `alt: string`, `size?: number` (default 64), `icon?: LineIconName` (default "store"), `className?`. Bila `src` ada → `<img>` (static-safe, eslint-disable). Else → kotak glass dengan `LineIcon` gold di tengah.

## 4. Per-halaman

### 4.1 `/bisnis` (`app/(public)/bisnis/page.tsx`)
- `PageHeader` ("Direktori Bisnis", subtitle). Bungkus `SectionShell` / pertahankan layout `max-w-5xl`.
- Search input: styling selaras (min-h-11), state & filter logic tidak diubah.
- Empty → `EmptyState` ("Belum ada bisnis", deskripsi, action opsional "Daftarkan bisnismu" → `/me/bisnis`).
- Grid pakai `BisnisCard` baru.

### 4.2 `BisnisCard` (`components/domain/bisnis-card.tsx`)
- Basis `Card` (href `/bisnis/${id}`).
- Thumbnail: `PosterThumb` (icon "store") ganti emoji 🏪.
- Nama: `bisnis.nama_brand || "Bisnis Alumni"` (fallback bermakna, **bukan** `—`; **tanpa** formatName).
- Bidang → `Badge` gold. Lokasi & detail → `displayOrDash` (sembunyikan bila kosong); lokasi dengan `LineIcon name="pin"`.

### 4.3 `/bisnis/[id]` (`bisnis-detail-client.tsx`)
- Header pakai `PosterThumb` (size 96) ganti emoji 🏪; nama brand apa adanya.
- Section pakai `Card` per blok. Kontak: emoji 📱→`LineIcon name="phone"`, 🔗→`LineIcon name="link"`.
- Loading state tetap.

### 4.4 `/event` (`app/(public)/event/page.tsx`)
- `PageHeader` ("Acara IKASI").
- Kartu event: `Card` + `PosterThumb` (icon "calendar") ganti emoji 📅; tanggal gold; 📍→`LineIcon name="pin"`; RSVP count dengan `LineIcon name="users"`.
- Empty → `EmptyState` ("Belum ada acara", deskripsi).

### 4.5 `/event/[id]` (`event-detail-client.tsx`)
- Back link tetap. Poster besar tetap. 📍→`LineIcon name="pin"`. "Sudah RSVP ✓" → `LineIcon name="check"`. Tombol RSVP & **semua logika RSVP tidak disentuh**.

### 4.6 `/news` (`app/(public)/news/page.tsx`)
- `PageHeader` ("Berita IKASI").
- Kartu: `Card`; bila `post.cover_image` ada → tampilkan thumbnail (kartu jadi punya visual). Tanggal·author tetap.
- Empty → `EmptyState`.

### 4.7 `/news/[slug]` (`news-detail-client.tsx`)
- Back link & header rapi (font-heading pada h1). Cover image tetap. **`renderMarkdown` tidak disentuh.**
- Not-found → `EmptyState` ("Artikel tidak ditemukan", action "Kembali ke Berita").

## 5. Definition of Done
- [ ] `PosterThumb` + ikon LineIcon baru teruji.
- [ ] BisnisCard: tanpa emoji, tanpa nama `—`, badge bidang, displayOrDash.
- [ ] Semua 6 halaman pakai `PageHeader`/`EmptyState` sesuai; tanpa emoji UI.
- [ ] Berita menampilkan thumbnail cover bila ada.
- [ ] RSVP & markdown tetap berfungsi (e2e/QA).
- [ ] Unit + e2e lama tetap PASS; tambah e2e regresi konten.
- [ ] `pnpm build` sukses; QA desktop+mobile tanpa horizontal scroll.

## 6. Di luar scope
- Halaman info & admin (Fase 3–4). Form daftar bisnis (`/me/bisnis`) — di luar (bagian admin/me-write).

## 7. Risiko & Mitigasi
- **Salah pakai formatName ke brand/judul** → spec eksplisit: jangan. Reviewer cek.
- **PosterThumb dipakai 4 tempat** → satu komponen, uji semua.
- **Event RSVP & markdown** → jangan sentuh; e2e RSVP/markdown + QA.
