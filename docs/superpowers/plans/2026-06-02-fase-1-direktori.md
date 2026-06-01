# Fase 1 — Redesign Direktori — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Terapkan visual language Blueprint ke 5 halaman direktori + perbaiki temuan audit (casing, field kosong, filter mobile, empty state, emoji).

**Architecture:** Tambah `LineIcon` & `InfoField` ke `components/ui/`, bangun ulang `AlumniCard` di atas komponen base, perbaiki `SearchFilterBar` mobile, lalu refactor markup 5 halaman. Tidak menyentuh data/auth/upload/edit.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Vitest + @testing-library/react (jsdom), Playwright.

---

## File Structure

| File | Aksi |
|---|---|
| `components/ui/icons.tsx` | Modify — tambah `LineIcon` |
| `components/ui/info-field.tsx` | Create — `InfoField` |
| `components/domain/alumni-card.tsx` | Modify — bangun ulang di atas Card/Avatar/Badge |
| `components/domain/search-filter-bar.tsx` | Modify — fix mobile truncation |
| `components/domain/login-prompt.tsx` | Modify — 💼 → LineIcon (kecil) |
| `app/(public)/alumni/page.tsx` | Modify — PageHeader + SectionShell |
| `app/(public)/angkatan/page.tsx` | Modify — PageHeader + Card |
| `app/(public)/angkatan/[tahun]/angkatan-detail-client.tsx` | Modify — PageHeader + EmptyState |
| `app/(public)/me/page.tsx` | Modify — InfoField + Card sections + ikon (mode tampil saja) |
| `app/(public)/alumni/[id]/alumni-detail-client.tsx` | Modify — InfoField + Avatar + ikon |
| `tests/unit/ui-components.test.tsx` | Modify — tes LineIcon + InfoField |
| `tests/e2e/direktori-redesign.spec.ts` | Create — regresi direktori |

**Catatan tes:** vitest jsdom, `globals: true`. JANGAN pakai `toBeInTheDocument`. Pakai `container.querySelector`/`.textContent`.

---

## Task 1: `LineIcon` utility icons

**Files:** Modify `components/ui/icons.tsx`, Modify `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tambah tes gagal** ke akhir `tests/unit/ui-components.test.tsx`:

```tsx
import { LineIcon } from "@/components/ui/icons";

describe("LineIcon", () => {
  it("render svg untuk nama dikenal", () => {
    const { container } = render(<LineIcon name="pin" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
  it("fallback render svg untuk nama tak dikenal", () => {
    // @ts-expect-error sengaja
    const { container } = render(<LineIcon name="zzz" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run** `pnpm test:run tests/unit/ui-components.test.tsx` → FAIL (`LineIcon` belum ada).

- [ ] **Step 3: Tambah ke `components/ui/icons.tsx`** (setelah `FeatureIcon`):

```tsx
type LineIconName = "pin" | "lock" | "check" | "mail" | "warning" | "briefcase" | "cap";

const LINE_PATHS: Record<LineIconName, string> = {
  pin: "M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10zM12 11a2 2 0 100-4 2 2 0 000 4z",
  lock: "M6 10V8a6 6 0 0112 0v2M5 10h14v10H5zM12 14v3",
  check: "M20 6L9 17l-5-5",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  warning: "M12 3l10 18H2zM12 10v5M12 18h.01",
  briefcase: "M4 8h16v12H4zM9 8V6a2 2 0 012-2h2a2 2 0 012 2v2",
  cap: "M12 4l10 5-10 5L2 9l10-5zM6 11v5l6 3 6-3v-5",
};

export function LineIcon({ name, className = "", size = 16 }: { name: LineIconName; className?: string; size?: number }) {
  const d = LINE_PATHS[name] ?? LINE_PATHS.check;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
```

- [ ] **Step 4: Run** test → PASS.

- [ ] **Step 5: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add components/ui/icons.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): LineIcon set untuk menggantikan emoji"
```

---

## Task 2: `InfoField` component

**Files:** Create `components/ui/info-field.tsx`, Modify `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tambah tes gagal** ke `tests/unit/ui-components.test.tsx`:

```tsx
import { InfoField } from "@/components/ui/info-field";

describe("InfoField", () => {
  it("menampilkan label & value bila ada isinya", () => {
    const { container } = render(<InfoField label="Domisili" value="Bandung" />);
    expect(container.textContent).toContain("Domisili");
    expect(container.textContent).toContain("Bandung");
  });
  it("render null (tidak ada output) bila value kosong", () => {
    const { container } = render(<InfoField label="Domisili" value="" />);
    expect(container.firstChild).toBeNull();
  });
  it("render null bila value placeholder dash", () => {
    const { container } = render(<InfoField label="X" value="—" />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Create `components/ui/info-field.tsx`:**

```tsx
import { displayOrDash } from "@/lib/format";

export function InfoField({
  label, value, className = "",
}: { label: string; value: string | number | null | undefined; className?: string }) {
  const shown = displayOrDash(value == null ? null : String(value));
  if (shown === null) return null;
  return (
    <div className={className}>
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      <div className="text-sm text-slate-200">{shown}</div>
    </div>
  );
}
```

- [ ] **Step 4: Run** → PASS.

- [ ] **Step 5: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add components/ui/info-field.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): InfoField (graceful empty) pengganti pola Field"
```

---

## Task 3: Bangun ulang `AlumniCard`

**Files:** Modify `components/domain/alumni-card.tsx`

Catatan: `AlumniPublic` punya field: `id, nama, angkatan, prodi, jabatan, tempat_kerja, bidang_pekerjaan, domisili, punya_ska, foto_url`, dll.

- [ ] **Step 1: Ganti seluruh isi `components/domain/alumni-card.tsx`:**

```tsx
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LineIcon } from "@/components/ui/icons";
import { formatName, displayOrDash } from "@/lib/format";
import type { AlumniPublic } from "@/lib/data/alumni";

export function AlumniCard({ alumni, isVerified }: { alumni: AlumniPublic; isVerified?: boolean }) {
  const nama = formatName(alumni.nama) || "Alumni";
  const jabatan = displayOrDash(alumni.jabatan);
  const tempatKerja = displayOrDash(alumni.tempat_kerja);
  const prodi = displayOrDash(alumni.prodi);
  const bidang = displayOrDash(alumni.bidang_pekerjaan);
  const domisili = displayOrDash(alumni.domisili);

  return (
    <Card href={`/alumni/${alumni.id}`} className="overflow-hidden">
      {alumni.foto_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={alumni.foto_url}
          alt={nama}
          width={56}
          height={56}
          className="rounded-[14px] object-cover"
          style={{ width: 56, height: 56 }}
        />
      ) : (
        <Avatar name={nama} />
      )}
      <div className="mt-3 text-base font-bold tracking-tight">{nama}</div>
      <div className="text-xs text-slate-400 mb-3">
        Angkatan <span className="text-[#d4a72c] font-semibold">{alumni.angkatan}</span>
        {prodi && <> · {prodi}</>}
      </div>
      {jabatan && <div className="text-sm text-slate-200">{jabatan}</div>}
      {tempatKerja && <div className="text-xs text-slate-400 mb-3">{tempatKerja}</div>}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {bidang && <Badge variant="gold">{bidang}</Badge>}
        {alumni.punya_ska && <Badge variant="gold">SKA</Badge>}
        {domisili && (
          <Badge variant="neutral">
            <LineIcon name="pin" /> {domisili}
          </Badge>
        )}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <LineIcon name={isVerified ? "check" : "lock"} size={12} />
          {isVerified ? "Lihat kontak di profil" : "Login untuk kontak"}
        </span>
        <span className="bg-[#d4a72c]/10 text-[#d4a72c] px-3 py-1 rounded-lg text-xs font-semibold">
          Lihat Profil →
        </span>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Run e2e direktori lama** untuk pastikan tidak regresi:

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web" && pnpm test:e2e tests/e2e/public-direktori.spec.ts 2>&1 | tail -10
```

Expected: status sama seperti baseline (test `alumni detail kontak masked` sudah pre-existing-fail tanpa Supabase aktif; test list direktori harus tetap PASS).

- [ ] **Step 3: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add components/domain/alumni-card.tsx
git commit -m "feat(direktori): AlumniCard di atas komponen base (casing, badge, ikon)"
```

---

## Task 4: Fix `SearchFilterBar` mobile truncation

**Files:** Modify `components/domain/search-filter-bar.tsx`

- [ ] **Step 1: Ganti isi `components/domain/search-filter-bar.tsx`** (props/callback TIDAK berubah; hanya layout & styling):

```tsx
"use client";

type Props = {
  query: string;
  onQuery: (v: string) => void;
  angkatan: number | null;
  onAngkatan: (v: number | null) => void;
  prodi: string | null;
  onProdi: (v: string | null) => void;
  domisili: string | null;
  onDomisili: (v: string | null) => void;
  optionsAngkatan: number[];
  optionsProdi: string[];
  optionsDomisili: string[];
  onReset: () => void;
};

export function SearchFilterBar(props: Props) {
  return (
    <div className="mx-5 sm:mx-8 lg:mx-12 p-4 glass-card rounded-2xl flex flex-col gap-3 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-center">
      <input
        type="text"
        placeholder="Cari nama, profesi, atau perusahaan..."
        value={props.query}
        onChange={(e) => props.onQuery(e.target.value)}
        className="w-full min-h-11 bg-black/30 border border-white/[0.08] text-white px-4 py-3 rounded-xl text-sm"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:contents">
        <Select
          value={props.angkatan?.toString() ?? ""}
          onChange={(v) => props.onAngkatan(v ? parseInt(v) : null)}
          placeholder="Angkatan"
          options={props.optionsAngkatan.map((y) => ({ value: y.toString(), label: y.toString() }))}
        />
        <Select
          value={props.prodi ?? ""}
          onChange={(v) => props.onProdi(v || null)}
          placeholder="Prodi"
          options={props.optionsProdi.map((p) => ({ value: p, label: p }))}
        />
        <Select
          value={props.domisili ?? ""}
          onChange={(v) => props.onDomisili(v || null)}
          placeholder="Domisili"
          options={props.optionsDomisili.map((d) => ({ value: d, label: d }))}
        />
      </div>
      <button
        onClick={props.onReset}
        className="self-start lg:self-auto text-[#d4a72c] text-xs font-semibold px-2 py-2"
      >
        Reset
      </button>
    </div>
  );
}

function Select({
  value, onChange, placeholder, options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-11 bg-black/30 border border-white/[0.08] text-slate-300 px-3 py-3 rounded-xl text-sm"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
```

Kunci perbaikan: mobile = kolom (`flex-col`); dropdown dalam grid `sm:grid-cols-3` lebar penuh (tidak `flex-1 min-w-0` yang memotong label); `min-h-11` (≥44px). Desktop: `lg:contents` membuat 3 select tetap masuk grid 5-kolom seperti semula.

- [ ] **Step 2: Verifikasi build** `pnpm build 2>&1 | grep -iE "error|compiled"` → compiled successfully.

- [ ] **Step 3: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add components/domain/search-filter-bar.tsx
git commit -m "fix(direktori): filter mobile tidak terpotong + target sentuh 44px"
```

---

## Task 5: `/alumni` list — PageHeader + SectionShell

**Files:** Modify `app/(public)/alumni/page.tsx`

- [ ] **Step 1:** Di `app/(public)/alumni/page.tsx`, tambahkan import:

```tsx
import { PageHeader } from "@/components/ui/page-header";
```

- [ ] **Step 2:** Ganti blok `<header>...</header>` (header ad-hoc) dengan:

```tsx
      <div className="px-5 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-14">
        <PageHeader
          breadcrumb={<>Beranda <span className="text-slate-600 mx-2">/</span> Direktori Alumni</>}
          title={<>Direktori <span className="gradient-text">{all.length} Alumni</span></>}
          subtitle="Cari rekan kerja, mentor, atau partner bisnis dari alumni Teknik Sipil Polban — terverifikasi."
        />
      </div>
```

Sisa file (state, filter, grid) tidak diubah.

- [ ] **Step 3: Verifikasi build** → compiled successfully.

- [ ] **Step 4: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/alumni/page.tsx"
git commit -m "feat(alumni): PageHeader konsisten di direktori"
```

---

## Task 6: `/angkatan` list — PageHeader + Card

**Files:** Modify `app/(public)/angkatan/page.tsx`

- [ ] **Step 1:** Tambah import:

```tsx
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
```

- [ ] **Step 2:** Ganti `<h1>...</h1>` + `<p>...</p>` (header ad-hoc) dengan:

```tsx
      <PageHeader
        title={<>Per <span className="gradient-text">Angkatan</span></>}
        subtitle="Daftar alumni berdasarkan tahun masuk"
        className="mb-10"
      />
```

- [ ] **Step 3:** Ganti tiap `<Link ... className="glass-card ...">` kartu angkatan dengan `Card`:

```tsx
            <Card key={g.tahun} href={`/angkatan/${g.tahun}`} className="p-5">
              <div className="font-heading text-2xl font-extrabold text-[#d4a72c]">{g.tahun}</div>
              <div className="text-sm text-slate-400 mt-1">{g.count} alumni</div>
              {g.prodiSet.size > 0 && (
                <div className="text-xs text-slate-500 mt-1 truncate">
                  {Array.from(g.prodiSet).join(" · ")}
                </div>
              )}
            </Card>
```

(Hapus import `Link` bila tidak lagi dipakai.)

- [ ] **Step 4: Verifikasi build** → compiled successfully.

- [ ] **Step 5: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/angkatan/page.tsx"
git commit -m "feat(angkatan): PageHeader + Card blueprint"
```

---

## Task 7: `/angkatan/[tahun]` — PageHeader + EmptyState

**Files:** Modify `app/(public)/angkatan/[tahun]/angkatan-detail-client.tsx`

- [ ] **Step 1:** Tambah import:

```tsx
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
```

- [ ] **Step 2:** Ganti `<h1>` + `<p>` dengan:

```tsx
      <PageHeader
        title={<>Angkatan <span className="gradient-text">{tahun}</span></>}
        subtitle={`${alumni.length} alumni terdaftar`}
        className="mb-8"
      />
```

- [ ] **Step 3:** Ganti baris empty (`<div className="text-center text-slate-500 py-16">Tidak ada alumni ditemukan.</div>`) dengan:

```tsx
        <EmptyState
          title="Belum ada alumni di angkatan ini"
          description="Data alumni angkatan ini belum tersedia. Cek angkatan lain atau hubungi pengurus."
        />
```

- [ ] **Step 4: Verifikasi build** → compiled successfully.

- [ ] **Step 5: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/angkatan/[tahun]/angkatan-detail-client.tsx"
git commit -m "feat(angkatan): PageHeader + EmptyState pada detail angkatan"
```

---

## Task 8: `/alumni/[id]` detail — Avatar + InfoField + ikon

**Files:** Modify `app/(public)/alumni/[id]/alumni-detail-client.tsx`

- [ ] **Step 1:** Tambah import & ganti helper:

```tsx
import { Avatar } from "@/components/ui/avatar";
import { InfoField } from "@/components/ui/info-field";
import { LineIcon } from "@/components/ui/icons";
import { formatName } from "@/lib/format";
```

- [ ] **Step 2:** Pada header, ganti blok foto+nama:

```tsx
      {/* Header */}
      <div className="flex gap-5 items-start mb-8">
        <div className="flex-shrink-0">
          {alumni.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={alumni.foto_url} alt={displayName} className="w-20 h-20 rounded-[14px] object-cover" />
          ) : (
            <Avatar name={displayName} size={80} />
          )}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">{displayName}</h1>
          <div className="text-sm text-slate-400 mt-1">
            Angkatan <span className="text-[#d4a72c] font-semibold">{alumni.angkatan}</span>
            {alumni.prodi && <> · {alumni.prodi}</>}
          </div>
          {alumni.nomor_anggota && (
            <div className="mt-1 text-xs font-mono text-[#d4a72c]/70">{alumni.nomor_anggota}</div>
          )}
        </div>
      </div>
```

Dan ubah `const displayName = alumni.nama ?? "Alumni";` menjadi `const displayName = formatName(alumni.nama) || "Alumni";`.

- [ ] **Step 3:** Ganti seluruh penggunaan helper lokal `<Field .../>` dengan `<InfoField .../>` (tipe props sama). Hapus definisi `function Field(...)` lokal di bawah file.

- [ ] **Step 4:** Pada section "Nomor Anggota" & "Kontak", ganti emoji:
  - `⚠ Harap Registrasi...` → `<span className="inline-flex items-center gap-1.5 text-amber-400/80"><LineIcon name="warning" /> Harap Registrasi ke Admin untuk mendapat Kartu Anggota</span>`
  - `📧 {contact.email}` → `<span className="inline-flex items-center gap-1.5"><LineIcon name="mail" /> {contact.email}</span>`

- [ ] **Step 5: Verifikasi build** → compiled successfully.

- [ ] **Step 6: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/alumni/[id]/alumni-detail-client.tsx"
git commit -m "feat(alumni): detail pakai Avatar/InfoField, casing & ikon"
```

---

## Task 9: `/me` profil — InfoField + Card + ikon (mode tampil)

**Files:** Modify `app/(public)/me/page.tsx`

JANGAN ubah: `EditForm`, `handleSave`, `handlePhotoUpload`, blok `editing ? (...)` (form edit), toggle SKA, `AuthGuard`.

- [ ] **Step 1:** Tambah import:

```tsx
import { InfoField } from "@/components/ui/info-field";
import { LineIcon } from "@/components/ui/icons";
import { formatName } from "@/lib/format";
```

- [ ] **Step 2:** Hapus helper lokal `function Field({ label, value })` (baris ~26-34) dan ganti seluruh pemakaian `<Field .../>` di **mode tampil** (blok `: (` setelah `editing ?`) dengan `<InfoField .../>` (props sama).

- [ ] **Step 3:** Ubah `displayName`:

```tsx
  const displayName = formatName(a?.nama || user.user_metadata?.full_name || user.email || "Alumni");
```

- [ ] **Step 4:** Ganti emoji `⚠` pada section Nomor Anggota:
  - `⚠ Harap Registrasi ke Admin...` → bungkus dengan `<span className="inline-flex items-center gap-1.5"><LineIcon name="warning" /> Harap Registrasi ke Admin untuk mendapat Kartu Anggota</span>` (pertahankan link "Hubungi Admin" di sebelahnya).

- [ ] **Step 5: Verifikasi build** → compiled successfully.

- [ ] **Step 6: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/me/page.tsx"
git commit -m "feat(me): mode tampil pakai InfoField + casing + ikon (edit tetap)"
```

---

## Task 10: `LoginPrompt` — ganti emoji (bonus kecil)

**Files:** Modify `components/domain/login-prompt.tsx`

- [ ] **Step 1:** Ganti `💼` dengan `LineIcon`:

```tsx
import Link from "next/link";
import { LineIcon } from "@/components/ui/icons";

export function LoginPrompt({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-2xl border border-[#d4a72c]/30 bg-[#d4a72c]/10 flex justify-between items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-[#f4ede0]">
        <LineIcon name="briefcase" className="text-[#d4a72c]" />
        <strong className="text-[#d4a72c]">{message}</strong>
      </div>
      <Link href="/login" className="btn-gold px-5 py-2.5 rounded-full text-xs whitespace-nowrap">
        Masuk dengan Google
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add components/domain/login-prompt.tsx
git commit -m "style(ui): LoginPrompt pakai LineIcon"
```

---

## Task 11: E2E regresi direktori

**Files:** Create `tests/e2e/direktori-redesign.spec.ts`

- [ ] **Step 1: Create `tests/e2e/direktori-redesign.spec.ts`:**

```ts
import { expect, test } from "@playwright/test";

test("direktori alumni: header & filter tampil", async ({ page }) => {
  await page.goto("/alumni");
  await expect(page.getByRole("heading", { name: /Direktori/ })).toBeVisible();
  await expect(page.getByPlaceholder(/Cari nama/)).toBeVisible();
  // Dropdown filter ada (label penuh, tidak terpotong)
  await expect(page.getByRole("combobox").first()).toBeVisible();
});

test("direktori alumni: filter mobile tidak terpotong", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/alumni");
  const firstSelect = page.getByRole("combobox").first();
  await expect(firstSelect).toBeVisible();
  const box = await firstSelect.boundingBox();
  // Tinggi target sentuh memadai (>=40px)
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
});

test("halaman angkatan tampil", async ({ page }) => {
  await page.goto("/angkatan");
  await expect(page.getByRole("heading", { name: /Angkatan/ })).toBeVisible();
});
```

- [ ] **Step 2: Run**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web" && pnpm test:e2e tests/e2e/direktori-redesign.spec.ts 2>&1 | tail -15
```

Expected: PASS (3 tes). Bila gagal karena selector, sesuaikan selector (bukan logika).

- [ ] **Step 3: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add tests/e2e/direktori-redesign.spec.ts
git commit -m "test(direktori): e2e regresi header & filter mobile"
```

---

## Task 12: QA penuh + build + visual check

- [ ] **Step 1: Unit** `pnpm test:run` → semua PASS (format + ui-components termasuk LineIcon + InfoField).
- [ ] **Step 2: E2E** `pnpm test:e2e` → smoke, home-redesign, direktori-redesign PASS. (`public-direktori.spec` test `alumni detail kontak masked` tetap pre-existing-fail tanpa Supabase aktif — catat, bukan regresi.)
- [ ] **Step 3: Build** `pnpm build` → sukses.
- [ ] **Step 4: Visual QA** — `pnpm dev`, screenshot desktop(1440)+mobile(390) untuk `/alumni`, `/angkatan`, `/angkatan/2020` (atau tahun yang ada), `/me` (perlu login — minimal cek tidak crash), `/alumni/[id]`. Verifikasi:
  - Filter mobile: label "Angkatan"/"Prodi"/"Domisili" penuh, tidak terpotong.
  - AlumniCard: nama Title Case, badge rapi, tanpa emoji, corner ticks.
  - Empty state angkatan kosong berkarakter.
  - Tidak ada horizontal scroll.
  Perbaiki temuan inline; ulang Step 1–3 bila ada perubahan kode.
- [ ] **Step 5: Commit perbaikan QA (bila ada)** lalu lapor Fase 1 selesai + tawarkan Fase 2.

---

## Self-Review Notes
- **Spec coverage:** LineIcon (T1), InfoField (T2), AlumniCard (T3), filter fix (T4), /alumni (T5), /angkatan (T6), /angkatan/[tahun] (T7), /alumni/[id] (T8), /me (T9), LoginPrompt (T10), e2e (T11), QA (T12). Semua poin spec tercakup.
- **Type consistency:** `LineIcon` `LineIconName` dipakai konsisten di AlumniCard/detail/me/LoginPrompt. `InfoField` props `(label, value)` cocok menggantikan `Field` lama. `Avatar`/`Card`/`Badge` dari Fase 0.
- **Catatan:** `AvatarPlaceholder` lama tetap ada (dipakai nav). AlumniCard kini pakai `Avatar` baru. Penggantian penuh di tempat lain menyusul saat halaman terkait di-redesign.
