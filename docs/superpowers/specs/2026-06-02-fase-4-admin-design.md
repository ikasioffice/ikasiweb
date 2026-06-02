# Fase 4 — Redesign Admin Dashboard

**Tanggal:** 2026-06-02 · **Status:** Spec → plan · **Bergantung:** Fase 0–3

## Tujuan
Selaraskan admin panel (`app/(admin)`) dengan visual language Blueprint secara **konservatif**: header `font-heading`, container `glass-card` → `Card`, empty state polos → `EmptyState`. Admin hanya diakses pengurus, jadi prioritas konsistensi visual ringan — **keamanan fungsi di atas estetika**.

## Batasan (KETAT)
- **Presentasi-saja, zero logic change.** TIDAK menyentuh: `createClient`/fetch/pagination, `toggleVerify` & mutation lain, form editor (news, wa-group), `AdminGuard`, `useSearchParams`/`Suspense`, handler tombol, state, route, nav logic.
- **Nama alumni di admin TIDAK di-`formatName`** — admin perlu melihat casing data asli untuk verifikasi.
- Static-export-safe; tanpa regresi. `pnpm build` harus tetap sukses (admin pages adalah client components yang di-prerender).

## Perubahan yang diizinkan (mekanis)
1. **`app/(admin)/admin/layout.tsx`** — brand "IKASI Admin" dapat `font-heading`. Sidebar nav logic tetap.
2. **`app/(admin)/admin/page.tsx`** (dashboard) — `<h1>` `font-heading`; stat cards & action cards `glass-card` → `Card`. Angka & href tetap.
3. **List pages** (`alumni`, `alumni/duplicates`, `alumni/deletions`, `news`, `events`, `wa-groups`) — `<h1>` `font-heading`; container baris/kartu `glass-card` → `Card` (non-interaktif → div; tombol di dalam tetap); empty state teks polos ("Tidak ada…") → `EmptyState`.
4. **Editor pages** (`news/[id]`, `news/[id]/news-editor-client`, `wa-groups/[id]`, `wa-groups/[id]/wa-group-editor-client`) — hanya `<h1>`/judul dapat `font-heading`. **Form & logika tidak disentuh.**

## Definition of Done
- [ ] Header admin pakai `font-heading`.
- [ ] Dashboard & list cards pakai `Card`.
- [ ] Empty state admin pakai `EmptyState`.
- [ ] Semua fungsi admin (verifikasi, edit, hapus, restore, fetch) **tidak berubah** — build sukses, unit pass.
- [ ] QA: dashboard & 1 list page render benar desktop.

## Di luar scope
Refactor logika/data admin, perubahan UX form.
