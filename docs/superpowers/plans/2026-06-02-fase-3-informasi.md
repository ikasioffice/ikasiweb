# Fase 3 — Informasi — Implementation Plan

> REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** Selaraskan 5 halaman informasi dengan Blueprint (PageHeader, Card, EmptyState) tanpa ubah konten/fungsi.

**Tech:** Next.js 16, Tailwind v4, Playwright. Low-risk, mostly mechanical.

---

## Task 1: Sejarah + Pengurus + AD/ART

**Files:** Modify `app/(public)/sejarah/page.tsx`, `app/(public)/pengurus/page.tsx`, `app/(public)/ad-art/page.tsx`

### /sejarah
- [ ] Import `import { PageHeader } from "@/components/ui/page-header";`
- [ ] Ganti `<h1>Tentang IKASI Polban</h1>` + `<p>` dengan:
```tsx
      <PageHeader
        title={<>Tentang <span className="gradient-text">IKASI Polban</span></>}
        subtitle="Ikatan Alumni Teknik Sipil Politeknik Negeri Bandung"
        className="mb-10"
      />
```

### /pengurus
- [ ] Import `PageHeader` + `import { Card } from "@/components/ui/card";`
- [ ] Ganti `<h1>Struktur Pengurus</h1>` + `<p>` dengan:
```tsx
      <PageHeader
        title={<>Struktur <span className="gradient-text">Pengurus</span></>}
        subtitle="Berdasarkan AD/ART IKASI BAB IV–V, struktur organisasi terdiri dari Pengurus Pusat, Komisariat (Angkatan & Daerah), dan Dewan Penasihat. Masa jabatan 4 tahun."
        className="mb-10"
      />
```
- [ ] Di `RoleCard`, ganti `<div className="glass-card rounded-xl p-4">` jadi `<Card className="p-4">` dan tutup `</div>` jadi `</Card>`.

### /ad-art
- [ ] Import `PageHeader`.
- [ ] Ganti `<h1>AD/ART</h1>` + `<p>` dengan:
```tsx
      <PageHeader
        title={<span className="gradient-text">AD/ART</span>}
        subtitle="Anggaran Dasar dan Anggaran Rumah Tangga IKASI Polban — disahkan 6 Desember 2020"
        className="mb-10"
      />
```

- [ ] **Build:** `cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web" && pnpm build 2>&1 | grep -iE "compiled successfully|error" | head` (bila ENOTEMPTY → `rm -rf .next` lalu ulang).
- [ ] **Commit:** `git add "app/(public)/sejarah/page.tsx" "app/(public)/pengurus/page.tsx" "app/(public)/ad-art/page.tsx" && git commit -m "feat(info): PageHeader + Card untuk sejarah/pengurus/ad-art"`

---

## Task 2: Cara Bergabung + Grup WA

**Files:** Modify `app/(public)/cara-bergabung/page.tsx`, `app/(public)/grup-wa/page.tsx`

### /cara-bergabung
- [ ] Import `import { PageHeader } from "@/components/ui/page-header";` dan `import { Card } from "@/components/ui/card";`
- [ ] Ganti `<h1>Cara Bergabung</h1>` + `<p>` (header atas) dengan:
```tsx
      <PageHeader
        title={<>Cara <span className="gradient-text">Bergabung</span></>}
        subtitle="Gratis. Hanya butuh akun Google dan status alumni Teknik Sipil Polban."
        className="mb-12"
      />
```
- [ ] Kartu benefit: ganti `<div key={b.brand} className="glass-card rounded-xl p-5">` jadi `<Card key={b.brand} className="p-5">` (+ tutup `</Card>`).

### /grup-wa
- [ ] Import `PageHeader`, `Card`, `EmptyState`.
- [ ] Ganti `<h1>Grup WhatsApp IKASI</h1>` + `<p>` dengan:
```tsx
      <PageHeader
        title={<>Grup <span className="gradient-text">WhatsApp</span> IKASI</>}
        subtitle="Kumpulan grup WhatsApp resmi IKASI — silaturahmi, info lowongan, diskusi bidang, dan lainnya"
        className="mb-8"
      />
```
- [ ] Tambah `min-h-11` ke className input search.
- [ ] `WaCard`: ganti `<div className="glass-card rounded-2xl p-5 flex flex-col gap-3 hover:border-[#d4a72c]/40 transition-colors">` jadi `<Card className="flex flex-col gap-3 p-5">` (+ tutup `</Card>`). Internal SVG & logika copy TIDAK diubah.
- [ ] Empty state: ganti `<div className="text-center text-slate-500 py-16">Tidak ada grup WhatsApp yang ditemukan.</div>` dengan:
```tsx
        <EmptyState
          title="Belum ada grup ditemukan"
          description="Coba ubah kata kunci pencarian."
        />
```

- [ ] **Build** → compiled successfully.
- [ ] **Commit:** `git add "app/(public)/cara-bergabung/page.tsx" "app/(public)/grup-wa/page.tsx" && git commit -m "feat(info): PageHeader + Card + EmptyState (cara-bergabung, grup-wa)"`

---

## Task 3: QA + build
- [ ] `pnpm test:run` → PASS (48).
- [ ] `rm -rf .next && pnpm build` → sukses.
- [ ] Visual QA `pnpm dev`: screenshot `/sejarah`, `/pengurus`, `/cara-bergabung`, `/grup-wa` desktop+mobile. Verifikasi PageHeader, Card corner ticks, tanpa horizontal scroll. Grup WA copy link tetap berfungsi.
- [ ] Lapor Fase 3 selesai.

## Self-Review
- Coverage: sejarah/pengurus/ad-art (T1), cara-bergabung/grup-wa (T2), QA (T3). Lengkap.
- Konten & fungsi (iframe, copy link, 14 benefit, daftar pengurus) tidak diubah.
