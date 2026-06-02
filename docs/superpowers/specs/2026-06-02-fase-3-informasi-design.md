# Fase 3 — Redesign Informasi (Sejarah, Pengurus, AD/ART, Cara Bergabung, Grup WA)

**Tanggal:** 2026-06-02 · **Status:** Spec → plan · **Bergantung:** Fase 0–2

## Tujuan
Selaraskan 5 halaman informasi/statis dengan visual language Blueprint: `PageHeader` seragam, kartu pakai `Card` (corner ticks), empty state pakai `EmptyState`. Konten teks/data **tidak diubah**.

## Batasan
- Presentasi-saja. Tidak menyentuh: konten teks (sejarah, tujuan, AD/ART TOC, 14 benefit, daftar pengurus), iframe Google Drive AD/ART, logika copy-link & fetch di Grup WA, route.
- Static-export-safe; tanpa regresi.
- Grup WA sudah punya ikon SVG WhatsApp/copy sendiri — **tidak diganti**.

## Per-halaman
1. **`/sejarah`** — h1/p → `PageHeader`. Section helper lokal tetap (gaya divider konsisten). h1 dapat `font-heading` via PageHeader.
2. **`/pengurus`** — `PageHeader`; `RoleCard` glass-card → `Card`.
3. **`/ad-art`** — `PageHeader`; iframe & link Drive tetap.
4. **`/cara-bergabung`** — `PageHeader`; kartu benefit glass-card → `Card`; step box tetap.
5. **`/grup-wa`** — `PageHeader`; empty state polos → `EmptyState`; `WaCard` glass-card → `Card` (internal SVG & copy logic tetap).

## Definition of Done
- [ ] 5 halaman pakai `PageHeader`.
- [ ] Kartu (pengurus, benefit, wa) pakai `Card`.
- [ ] Grup WA empty → `EmptyState`.
- [ ] Konten & fungsi (copy link, iframe) tetap.
- [ ] Build sukses; QA desktop+mobile tanpa horizontal scroll.

## Di luar scope
Admin (Fase 4).
