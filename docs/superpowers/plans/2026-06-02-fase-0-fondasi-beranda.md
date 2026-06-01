# Fase 0 — Fondasi Blueprint + Redesign Beranda — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengunci visual language "Blueprint Teknik Sipil" sebagai token Tailwind + komponen base reusable, lalu me-redesign Beranda memakainya — tanpa mengubah fungsi/konten.

**Architecture:** Lapisan presentasi murni di atas Next.js 16 static export. Tambah token warna/tipografi di `app/globals.css`, utilitas presentasi di `lib/format.ts`, dan komponen base di `components/ui/`. Beranda (`app/(public)/page.tsx`) di-refactor agar memakai komponen base; data fetching Supabase tidak disentuh. Tes: vitest (unit, jsdom) untuk logika & kontrak komponen, Playwright untuk regresi e2e, `pnpm build` untuk validasi static export.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript, Vitest + @testing-library/react (jsdom), Playwright. Tools desain: Stitch MCP, ui-ux-pro-max skill, Magic 21st.dev MCP.

---

## File Structure

| File | Tanggung jawab | Aksi |
|---|---|---|
| `app/globals.css` | Token warna blueprint + util grid + skala tipografi | Modify |
| `app/layout.tsx` | Daftarkan font heading (`next/font`) | Modify |
| `lib/format.ts` | Utilitas presentasi: `formatName`, `displayOrDash` | Create |
| `components/ui/button.tsx` | Gaya tombol konsisten (gold/outline) | Create |
| `components/ui/avatar.tsx` | Avatar inisial + normalisasi casing | Create |
| `components/ui/badge.tsx` | Label/tag konsisten | Create |
| `components/ui/card.tsx` | Kartu blueprint (corner ticks), as link/div | Create |
| `components/ui/section-shell.tsx` | Wrapper section + opsi grid blueprint | Create |
| `components/ui/page-header.tsx` | Header halaman seragam | Create |
| `components/ui/empty-state.tsx` | Empty state berkarakter | Create |
| `components/ui/stat-block.tsx` | Satu metrik + count-up + reduced-motion | Create |
| `components/ui/icons.tsx` | Set ikon garis ringan untuk grid fitur | Create |
| `app/(public)/page.tsx` | Beranda memakai komponen base | Modify |
| `components/layout/nav.tsx` | Selaraskan border/tekstur (struktur tetap) | Modify |
| `components/layout/footer.tsx` | Selaraskan border/tekstur (struktur tetap) | Modify |
| `tests/unit/format.test.ts` | Tes `formatName`, `displayOrDash` | Create |
| `tests/unit/ui-components.test.tsx` | Tes kontrak komponen base | Create |
| `tests/e2e/home-redesign.spec.ts` | Regresi fungsi beranda | Create |

**Catatan tes komponen:** vitest.config sudah `environment: "jsdom"`, `globals: true`, plugin React, dan meng-include `tests/unit/**/*.test.tsx`. **Tidak ada** setupFiles jest-dom, jadi **jangan pakai matcher `toBeInTheDocument`**. Pakai `render()` dari `@testing-library/react` lalu assert lewat `container.querySelector` / `.textContent` / atribut dengan `expect` bawaan vitest.

---

## Task 1: Design exploration di Stitch (referensi visual) — CHECKPOINT

Tujuan: hasilkan acuan visual Blueprint + mockup Beranda yang disetujui user sebelum koding. Dilakukan di sesi utama (bukan subagent) karena butuh approval. Token default sudah ada di spec, jadi Task 2+ tidak terblok bila Stitch hanya mempertajam.

- [ ] **Step 1: Buat/ambil project Stitch**

Gunakan `mcp__stitch__list_projects` lalu `mcp__stitch__create_project` (atau `get_project`) untuk project "IKASI Blueprint". Catat `projectId`.

- [ ] **Step 2: Buat design system blueprint**

`mcp__stitch__create_design_system` dengan: base navy `#0a1628`/`#142340`, aksen gold `#d4a72c`, garis blueprint cyan `rgba(120,170,220,0.12)`, motif grid + corner ticks, heading geometris (kandidat Space Grotesk), body Inter.

- [ ] **Step 3: Generate mockup Beranda (desktop + mobile)**

`mcp__stitch__generate_screen_from_text` untuk Beranda: hero blueprint + garis dimensi, 3 statistik, grid 6 fitur (kartu corner-tick), CTA banner. Minta varian via `mcp__stitch__generate_variants` bila perlu.

- [ ] **Step 4: Validasi pola dengan ui-ux-pro-max**

Invoke skill `ui-ux-pro-max` (action: review/design) pada arah layout & aksesibilitas hero/stat/grid. Catat rekomendasi.

- [ ] **Step 5: Tampilkan ke user & dapatkan approval**

Tampilkan screenshot mockup. **STOP untuk approval.** Rekam keputusan final (font heading terpilih, nilai warna garis, intensitas motif) — nilai ini dipakai Task 2. Jika user minta revisi, ulang Step 3–5.

- [ ] **Step 6: Commit catatan keputusan**

```bash
# Tambahkan ringkasan keputusan ke dokumen spec atau catatan
git add docs/superpowers/specs/2026-06-02-fase-0-fondasi-beranda-design.md
git commit -m "docs: kunci keputusan visual Stitch untuk Fase 0"
```

---

## Task 2: Token & tipografi blueprint

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Tambah token blueprint di `app/globals.css`**

Sisipkan ke dalam blok `@theme` (di bawah token gold yang ada):

```css
  --color-blueprint-line: rgba(120, 170, 220, 0.12);
  --color-blueprint-line-strong: rgba(120, 170, 220, 0.22);
  --font-heading: "Space Grotesk", "Inter", system-ui, sans-serif;
```

Lalu tambahkan utilitas grid blueprint & heading di luar `@theme` (akhir file):

```css
/* Tekstur grid blueprint — dipakai SectionShell via class .bp-grid */
.bp-grid {
  background-image:
    linear-gradient(var(--color-blueprint-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-blueprint-line) 1px, transparent 1px);
  background-size: 32px 32px;
}

.font-heading {
  font-family: var(--font-heading);
  letter-spacing: -0.02em;
}

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
```

- [ ] **Step 2: Daftarkan font heading di `app/layout.tsx`**

Tambah import & loader di samping `Inter` yang sudah ada:

```tsx
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading-src",
  weight: ["500", "600", "700"],
});
```

Lalu pada `<html ... className={inter.variable}>` ubah menjadi:

```tsx
<html lang="id" className={`${inter.variable} ${spaceGrotesk.variable}`}>
```

Dan di `globals.css` ubah token `--font-heading` agar memakai variabel font Next:

```css
  --font-heading: var(--font-heading-src), "Inter", system-ui, sans-serif;
```

- [ ] **Step 3: Verifikasi build static export**

Run: `pnpm build`
Expected: build sukses, output `export` tidak error, tidak ada warning font fatal.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat(ui): tambah token & tipografi blueprint (Fase 0)"
```

---

## Task 3: Utilitas `formatName` (TDD)

**Files:**
- Create: `lib/format.ts`
- Test: `tests/unit/format.test.ts`

- [ ] **Step 1: Tulis tes gagal**

`tests/unit/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatName } from "@/lib/format";

describe("formatName", () => {
  it("mengubah ALL CAPS jadi Title Case", () => {
    expect(formatName("AJENG MELIANA RIZKY")).toBe("Ajeng Meliana Rizky");
  });
  it("mempertahankan Title Case yang sudah benar", () => {
    expect(formatName("Heni Nuraeni")).toBe("Heni Nuraeni");
  });
  it("merapikan spasi berlebih", () => {
    expect(formatName("  budi   santoso ")).toBe("Budi Santoso");
  });
  it("aman untuk string kosong/null", () => {
    expect(formatName("")).toBe("");
    expect(formatName(null)).toBe("");
    expect(formatName(undefined)).toBe("");
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/format.test.ts`
Expected: FAIL — `formatName` belum ada / modul tidak ditemukan.

- [ ] **Step 3: Implementasi minimal**

`lib/format.ts`:

```ts
/** Normalisasi nama ke Title Case, rapikan spasi. Aman untuk null/undefined. */
export function formatName(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\p{L}/gu, (m) => m.toUpperCase());
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/format.test.ts`
Expected: PASS (4 tes).

- [ ] **Step 5: Commit**

```bash
git add lib/format.ts tests/unit/format.test.ts
git commit -m "feat(ui): formatName untuk normalisasi casing nama alumni"
```

---

## Task 4: Utilitas `displayOrDash` (graceful empty) (TDD)

**Files:**
- Modify: `lib/format.ts`
- Modify: `tests/unit/format.test.ts`

- [ ] **Step 1: Tambah tes gagal**

Tambahkan ke `tests/unit/format.test.ts`:

```ts
import { displayOrDash } from "@/lib/format";

describe("displayOrDash", () => {
  it("mengembalikan nilai jika ada isinya", () => {
    expect(displayOrDash("Bandung")).toBe("Bandung");
  });
  it("mengembalikan null untuk nilai kosong (agar pemanggil bisa sembunyikan)", () => {
    expect(displayOrDash("")).toBeNull();
    expect(displayOrDash("   ")).toBeNull();
    expect(displayOrDash(null)).toBeNull();
    expect(displayOrDash(undefined)).toBeNull();
    expect(displayOrDash("-")).toBeNull();
    expect(displayOrDash("—")).toBeNull();
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/format.test.ts`
Expected: FAIL — `displayOrDash` belum ada.

- [ ] **Step 3: Implementasi minimal**

Tambahkan ke `lib/format.ts`:

```ts
/**
 * Mengembalikan teks bersih atau `null` bila kosong/placeholder (`-`, `—`).
 * Pemanggil menyembunyikan baris saat hasilnya null (hindari "-" telanjang).
 */
export function displayOrDash(value: string | null | undefined): string | null {
  if (value == null) return null;
  const t = value.trim();
  if (t === "" || t === "-" || t === "—") return null;
  return t;
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/format.test.ts`
Expected: PASS (semua tes Task 3 + 4).

- [ ] **Step 5: Commit**

```bash
git add lib/format.ts tests/unit/format.test.ts
git commit -m "feat(ui): displayOrDash untuk graceful empty field"
```

---

## Task 5: Komponen `Button`

**Files:**
- Create: `components/ui/button.tsx`
- Test: `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tulis tes gagal**

`tests/unit/ui-components.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("render sebagai <a> bila ada href", () => {
    const { container } = render(<Button href="/x">Klik</Button>);
    const a = container.querySelector("a");
    expect(a).not.toBeNull();
    expect(a?.getAttribute("href")).toBe("/x");
    expect(a?.textContent).toBe("Klik");
  });
  it("render sebagai <button> bila tanpa href", () => {
    const { container } = render(<Button>Kirim</Button>);
    expect(container.querySelector("button")).not.toBeNull();
  });
  it("varian outline memakai kelas berbeda dari gold", () => {
    const { container: gold } = render(<Button variant="gold">a</Button>);
    const { container: out } = render(<Button variant="outline">a</Button>);
    expect(gold.firstElementChild?.className).not.toBe(out.firstElementChild?.className);
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: FAIL — `Button` belum ada.

- [ ] **Step 3: Implementasi minimal**

`components/ui/button.tsx`:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "gold" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a72c]";
const sizes: Record<Size, string> = {
  md: "px-6 py-2.5 text-sm min-h-11",
  lg: "px-8 py-3 text-base min-h-11",
};
const variants: Record<Variant, string> = {
  gold: "btn-gold",
  outline: "border border-white/20 text-white hover:border-[#d4a72c]/60",
};

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function Button({
  children, href, variant = "gold", size = "md", className = "", onClick, type = "button",
}: Props) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: PASS (3 tes Button).

- [ ] **Step 5: Commit**

```bash
git add components/ui/button.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): komponen Button (gold/outline)"
```

---

## Task 6: Komponen `Avatar` (normalisasi casing)

**Files:**
- Create: `components/ui/avatar.tsx`
- Modify: `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tambah tes gagal**

Tambahkan ke `tests/unit/ui-components.test.tsx`:

```tsx
import { Avatar } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("inisial dari nama ALL CAPS tetap 2 huruf Title Case", () => {
    const { container } = render(<Avatar name="AJENG MELIANA RIZKY" />);
    expect(container.textContent).toBe("AM");
  });
  it("aman untuk nama satu kata", () => {
    const { container } = render(<Avatar name="budi" />);
    expect(container.textContent).toBe("B");
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: FAIL — `Avatar` belum ada.

- [ ] **Step 3: Implementasi minimal**

`components/ui/avatar.tsx` (memakai `formatName` agar konsisten dengan tampilan nama):

```tsx
import { formatName } from "@/lib/format";

const PALETTES = [
  ["#d4a72c", "#b88a1c"], ["#3b82f6", "#1e40af"], ["#10b981", "#047857"],
  ["#f59e0b", "#c2410c"], ["#8b5cf6", "#6d28d9"], ["#ec4899", "#be185d"],
] as const;

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = formatName(name).split(" ").filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export function Avatar({ name, size = 56 }: { name: string; size?: number }) {
  const clean = formatName(name) || "?";
  const palette = PALETTES[hashString(clean) % PALETTES.length];
  const isLight = palette[0] === "#d4a72c";
  return (
    <div
      className="rounded-[14px] grid place-items-center font-extrabold tracking-tight"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
        color: isLight ? "#0a1628" : "#fff",
        fontSize: size * 0.4,
      }}
      aria-hidden="true"
    >
      {initials(clean)}
    </div>
  );
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: PASS (Button + Avatar).

- [ ] **Step 5: Commit**

```bash
git add components/ui/avatar.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): komponen Avatar dengan normalisasi casing"
```

---

## Task 7: Komponen `Badge`

**Files:**
- Create: `components/ui/badge.tsx`
- Modify: `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tambah tes gagal**

Tambahkan ke `tests/unit/ui-components.test.tsx`:

```tsx
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("menampilkan children", () => {
    const { container } = render(<Badge>2023</Badge>);
    expect(container.textContent).toContain("2023");
  });
  it("varian gold & neutral berbeda kelas", () => {
    const { container: g } = render(<Badge variant="gold">a</Badge>);
    const { container: n } = render(<Badge variant="neutral">a</Badge>);
    expect(g.firstElementChild?.className).not.toBe(n.firstElementChild?.className);
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: FAIL — `Badge` belum ada.

- [ ] **Step 3: Implementasi minimal**

`components/ui/badge.tsx`:

```tsx
import type { ReactNode } from "react";

type Variant = "gold" | "neutral";
const variants: Record<Variant, string> = {
  gold: "border-[#d4a72c]/30 bg-[#d4a72c]/10 text-[#d4a72c]",
  neutral: "border-white/10 bg-white/5 text-slate-300",
};

export function Badge({
  children, variant = "neutral", className = "",
}: { children: ReactNode; variant?: Variant; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/badge.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): komponen Badge"
```

---

## Task 8: Komponen `Card` (blueprint corner ticks)

**Files:**
- Create: `components/ui/card.tsx`
- Modify: `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tambah tes gagal**

Tambahkan ke `tests/unit/ui-components.test.tsx`:

```tsx
import { Card } from "@/components/ui/card";

describe("Card", () => {
  it("render sebagai <a> bila ada href", () => {
    const { container } = render(<Card href="/y">isi</Card>);
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/y");
  });
  it("render sebagai <div> bila tanpa href", () => {
    const { container } = render(<Card>isi</Card>);
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("div")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: FAIL — `Card` belum ada.

- [ ] **Step 3: Implementasi minimal**

`components/ui/card.tsx` (corner ticks via pseudo-border sudut; tetap glass):

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  interactive?: boolean;
  className?: string;
};

const corner =
  "before:absolute before:left-0 before:top-0 before:h-3 before:w-3 before:border-l before:border-t before:border-[var(--color-blueprint-line-strong)] " +
  "after:absolute after:bottom-0 after:right-0 after:h-3 after:w-3 after:border-b after:border-r after:border-[var(--color-blueprint-line-strong)]";

export function Card({ children, href, interactive, className = "" }: Props) {
  const cls =
    `relative glass-card rounded-2xl p-6 ${corner} ` +
    (interactive || href ? "transition-colors hover:border-[#d4a72c]/40 " : "") +
    className;
  if (href) {
    return (
      <Link href={href} className={`block group ${cls}`}>
        {children}
      </Link>
    );
  }
  return <div className={cls}>{children}</div>;
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/card.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): komponen Card blueprint (corner ticks)"
```

---

## Task 9: Komponen `SectionShell`

**Files:**
- Create: `components/ui/section-shell.tsx`
- Modify: `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tambah tes gagal**

Tambahkan ke `tests/unit/ui-components.test.tsx`:

```tsx
import { SectionShell } from "@/components/ui/section-shell";

describe("SectionShell", () => {
  it("menambahkan kelas bp-grid saat grid=true", () => {
    const { container } = render(<SectionShell grid>x</SectionShell>);
    expect(container.querySelector(".bp-grid")).not.toBeNull();
  });
  it("tanpa grid tidak ada bp-grid", () => {
    const { container } = render(<SectionShell>x</SectionShell>);
    expect(container.querySelector(".bp-grid")).toBeNull();
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: FAIL — `SectionShell` belum ada.

- [ ] **Step 3: Implementasi minimal**

`components/ui/section-shell.tsx`:

```tsx
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  grid?: boolean;
  className?: string;
  innerClassName?: string;
};

export function SectionShell({ children, grid, className = "", innerClassName = "" }: Props) {
  return (
    <section className={`relative px-6 ${grid ? "bp-grid" : ""} ${className}`}>
      <div className={`mx-auto max-w-5xl ${innerClassName}`}>{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/section-shell.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): komponen SectionShell + grid blueprint"
```

---

## Task 10: Komponen `PageHeader`

**Files:**
- Create: `components/ui/page-header.tsx`
- Modify: `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tambah tes gagal**

Tambahkan ke `tests/unit/ui-components.test.tsx`:

```tsx
import { PageHeader } from "@/components/ui/page-header";

describe("PageHeader", () => {
  it("menampilkan title dalam <h1>", () => {
    const { container } = render(<PageHeader title="Direktori" />);
    expect(container.querySelector("h1")?.textContent).toContain("Direktori");
  });
  it("menampilkan subtitle bila ada", () => {
    const { container } = render(<PageHeader title="A" subtitle="Sub" />);
    expect(container.textContent).toContain("Sub");
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: FAIL — `PageHeader` belum ada.

- [ ] **Step 3: Implementasi minimal**

`components/ui/page-header.tsx`:

```tsx
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
};

export function PageHeader({ title, subtitle, breadcrumb, className = "" }: Props) {
  return (
    <header className={`relative ${className}`}>
      {breadcrumb ? (
        <div className="mb-4 text-sm text-slate-500">{breadcrumb}</div>
      ) : null}
      <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-5xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/page-header.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): komponen PageHeader"
```

---

## Task 11: Komponen `EmptyState`

**Files:**
- Create: `components/ui/empty-state.tsx`
- Modify: `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tambah tes gagal**

Tambahkan ke `tests/unit/ui-components.test.tsx`:

```tsx
import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState", () => {
  it("menampilkan title & description", () => {
    const { container } = render(<EmptyState title="Belum ada acara" description="Nantikan." />);
    expect(container.textContent).toContain("Belum ada acara");
    expect(container.textContent).toContain("Nantikan.");
  });
  it("menampilkan action bila diberikan", () => {
    const { container } = render(
      <EmptyState title="x" action={<a href="/daftar">Daftar</a>} />,
    );
    expect(container.querySelector('a[href="/daftar"]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: FAIL — `EmptyState` belum ada.

- [ ] **Step 3: Implementasi minimal**

`components/ui/empty-state.tsx` (motif blueprint: bingkai bertick, bukan teks polos):

```tsx
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, icon, className = "" }: Props) {
  return (
    <div
      className={`relative mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-[var(--color-blueprint-line-strong)] bg-white/[0.02] px-8 py-14 text-center ${className}`}
    >
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl border border-[var(--color-blueprint-line-strong)] text-[#d4a72c]">
        {icon ?? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 9h18M8 4v16" />
          </svg>
        )}
      </div>
      <p className="font-heading text-lg font-semibold text-white">{title}</p>
      {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/empty-state.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): komponen EmptyState berkarakter"
```

---

## Task 12: Komponen `StatBlock` (count-up + reduced-motion)

**Files:**
- Create: `components/ui/stat-block.tsx`
- Modify: `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tambah tes gagal**

Tambahkan ke `tests/unit/ui-components.test.tsx`:

```tsx
import { StatBlock } from "@/components/ui/stat-block";

describe("StatBlock", () => {
  it("menampilkan placeholder saat value null", () => {
    const { container } = render(<StatBlock value={null} label="Alumni" />);
    expect(container.textContent).toContain("—");
    expect(container.textContent).toContain("Alumni");
  });
  it("menampilkan label", () => {
    const { container } = render(<StatBlock value={10} label="Angkatan" />);
    expect(container.textContent).toContain("Angkatan");
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: FAIL — `StatBlock` belum ada.

- [ ] **Step 3: Implementasi minimal**

`components/ui/stat-block.tsx` (count-up dengan rAF; menghormati `prefers-reduced-motion`):

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function StatBlock({ value, label }: { value: number | null; label: string }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === null) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplayed(value); return; }
    const start = Date.now();
    const duration = 1200;
    const animate = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return (
    <div className="relative text-center">
      <div className="font-heading text-4xl font-extrabold gradient-text tabular-nums sm:text-5xl">
        {value === null ? "—" : displayed.toLocaleString("id-ID")}
      </div>
      <div className="mt-2 text-xs text-slate-400 sm:text-sm">{label}</div>
    </div>
  );
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/stat-block.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): komponen StatBlock count-up + reduced-motion"
```

---

## Task 13: Set ikon garis untuk grid fitur

**Files:**
- Create: `components/ui/icons.tsx`
- Modify: `tests/unit/ui-components.test.tsx`

- [ ] **Step 1: Tambah tes gagal**

Tambahkan ke `tests/unit/ui-components.test.tsx`:

```tsx
import { FeatureIcon } from "@/components/ui/icons";

describe("FeatureIcon", () => {
  it("render svg untuk nama ikon dikenal", () => {
    const { container } = render(<FeatureIcon name="directory" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
  it("fallback tetap render svg untuk nama tak dikenal", () => {
    // @ts-expect-error sengaja nama tak dikenal
    const { container } = render(<FeatureIcon name="zzz" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: FAIL — `FeatureIcon` belum ada.

- [ ] **Step 3: Implementasi minimal**

`components/ui/icons.tsx` (ikon garis ringan, static-safe; ganti emoji generik):

```tsx
type IconName = "directory" | "angkatan" | "bisnis" | "acara" | "berita" | "tentang";

const PATHS: Record<IconName, string> = {
  directory: "M4 6h10M4 12h16M4 18h10",
  angkatan: "M12 3l9 5-9 5-9-5 9-5zM5 10v5l7 4 7-4v-5",
  bisnis: "M4 9l1-4h14l1 4M5 9v10h14V9M9 19v-5h6v5",
  acara: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  berita: "M5 4h11v16H5zM16 8h3v9a2 2 0 01-4 0M8 8h5M8 12h5",
  tentang: "M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5",
};

export function FeatureIcon({ name, className = "" }: { name: IconName; className?: string }) {
  const d = PATHS[name] ?? PATHS.tentang;
  return (
    <svg
      width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `pnpm test:run tests/unit/ui-components.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/icons.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): set ikon garis untuk grid fitur"
```

---

## Task 14: Redesign Beranda memakai komponen base

**Files:**
- Modify: `app/(public)/page.tsx`
- Test: `tests/e2e/home-redesign.spec.ts`

Pertahankan fetch stats (`createClient` + 3 query) **persis** seperti sekarang. Hanya markup yang berubah.

- [ ] **Step 1: Tulis e2e regresi gagal**

`tests/e2e/home-redesign.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("beranda: hero, CTA, dan link fitur tetap ada", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Ribuan Alumni/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Jelajahi Direktori/ })).toHaveAttribute("href", /\/alumni/);
  await expect(page.getByRole("link", { name: /Bergabung Gratis/ })).toHaveAttribute("href", /\/daftar/);
  // Grid fitur menuju halaman yang benar
  await expect(page.getByRole("link", { name: /Direktori Alumni/ })).toHaveAttribute("href", /\/alumni/);
  await expect(page.getByRole("link", { name: /Bisnis Alumni/ })).toHaveAttribute("href", /\/bisnis/);
});

test("beranda: statistik tampil (angka atau placeholder)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Alumni Terdaftar/)).toBeVisible();
  await expect(page.getByText(/Angkatan/).first()).toBeVisible();
  await expect(page.getByText(/Bisnis Alumni/).first()).toBeVisible();
});
```

- [ ] **Step 2: Jalankan e2e, pastikan baseline jelas**

Run: `pnpm test:e2e tests/e2e/home-redesign.spec.ts`
Expected: kemungkinan PASS sebagian (konten lama masih ada) — catat sebagai baseline. Tujuan tes ini: menjaga agar setelah refactor markup, kontrak ini tetap PASS.

- [ ] **Step 3: Refactor `app/(public)/page.tsx`**

Ganti seluruh JSX `return (...)` (baris 31–104) dengan versi berbasis komponen base. **Jangan ubah** blok `useEffect`/`stats` (baris 10–29) dan tetap `"use client"`.

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionShell } from "@/components/ui/section-shell";
import { StatBlock } from "@/components/ui/stat-block";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/ui/icons";

type Stats = { alumni: number | null; bisnis: number | null; angkatan: number | null };

export default function Home() {
  const [stats, setStats] = useState<Stats>({ alumni: null, bisnis: null, angkatan: null });

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("alumni_public").select("*", { count: "exact", head: true }),
      supabase.from("bisnis").select("*", { count: "exact", head: true }),
      supabase.from("alumni_public").select("angkatan"),
    ]).then(([alumniRes, bisnisRes, angkatanRes]) => {
      const tahunSet = new Set(
        (angkatanRes.data ?? []).map((r) => r.angkatan).filter(Boolean),
      );
      setStats({ alumni: alumniRes.count, bisnis: bisnisRes.count, angkatan: tahunSet.size });
    });
  }, []);

  return (
    <main>
      {/* Hero */}
      <SectionShell grid className="py-24" innerClassName="max-w-4xl text-center">
        <div className="mb-6 flex justify-center">
          <Badge variant="gold">IKATAN ALUMNI TEKNIK SIPIL · POLBAN</Badge>
        </div>
        <h1 className="font-heading mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Satu Platform, <span className="gradient-text">Ribuan Alumni</span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
          Wadah resmi alumni Teknik Sipil Polban sejak 28 April 2001. Terhubung
          dengan ribuan alumni dari angkatan 1982 hingga sekarang — temukan
          kolega, kolaborasi bisnis, dan peluang karier.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/alumni" size="lg">Jelajahi Direktori</Button>
          <Button href="/daftar" variant="outline" size="lg">Bergabung Gratis</Button>
        </div>
      </SectionShell>

      {/* Stats */}
      <SectionShell className="border-y border-white/[0.06] py-16" innerClassName="max-w-3xl">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          <StatBlock value={stats.alumni} label="Alumni Terdaftar" />
          <StatBlock value={stats.angkatan} label="Angkatan" />
          <StatBlock value={stats.bisnis} label="Bisnis Alumni" />
        </div>
      </SectionShell>

      {/* Feature grid */}
      <SectionShell className="py-20">
        <h2 className="font-heading mb-12 text-center text-3xl font-extrabold tracking-tight">
          Semua yang kamu butuhkan
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.href} href={f.href}>
              <div className="mb-4 text-[#d4a72c]">
                <FeatureIcon name={f.icon} />
              </div>
              <div className="font-heading mb-1 font-semibold text-white">{f.title}</div>
              <div className="text-sm text-slate-400">{f.desc}</div>
            </Card>
          ))}
        </div>
      </SectionShell>

      {/* CTA Banner */}
      <SectionShell className="py-20" innerClassName="max-w-3xl">
        <Card className="border-[#d4a72c]/20 p-10 text-center">
          <h2 className="font-heading mb-4 text-3xl font-extrabold tracking-tight">
            Sudah lulus? <span className="gradient-text">Daftarkan dirimu.</span>
          </h2>
          <p className="mb-8 text-slate-400">
            Bergabung gratis. Verifikasi alumni untuk akses kontak dan fitur lengkap.
          </p>
          <Button href="/daftar" size="lg">Mulai Sekarang</Button>
        </Card>
      </SectionShell>
    </main>
  );
}

const features: { href: string; icon: "directory" | "angkatan" | "bisnis" | "acara" | "berita" | "tentang"; title: string; desc: string }[] = [
  { href: "/alumni", icon: "directory", title: "Direktori Alumni", desc: "Cari alumni berdasarkan nama, angkatan, atau bidang pekerjaan." },
  { href: "/angkatan", icon: "angkatan", title: "Per Angkatan", desc: "Lihat semua alumni dari angkatan yang sama." },
  { href: "/bisnis", icon: "bisnis", title: "Bisnis Alumni", desc: "Temukan produk dan jasa dari sesama alumni." },
  { href: "/event", icon: "acara", title: "Acara", desc: "Reuni, seminar, dan gathering alumni IKASI." },
  { href: "/news", icon: "berita", title: "Berita", desc: "Informasi terkini dari keluarga besar IKASI." },
  { href: "/sejarah", icon: "tentang", title: "Tentang IKASI", desc: "Sejarah, visi misi, dan struktur pengurus." },
];
```

- [ ] **Step 4: Jalankan e2e, pastikan lulus**

Run: `pnpm test:e2e tests/e2e/home-redesign.spec.ts`
Expected: PASS (kedua tes). Jika gagal, sesuaikan nama/teks tanpa mengubah link target.

- [ ] **Step 5: Jalankan smoke lama, pastikan tidak regresi**

Run: `pnpm test:e2e tests/e2e/smoke.spec.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add "app/(public)/page.tsx" tests/e2e/home-redesign.spec.ts
git commit -m "feat(home): redesign Beranda dengan komponen base blueprint"
```

---

## Task 15: Selaraskan Nav & Footer (minimal, struktur tetap)

**Files:**
- Modify: `components/layout/nav.tsx`
- Modify: `components/layout/footer.tsx`

Hanya menyamakan tekstur/typografi merek; **jangan** ubah daftar `links`, logika auth, atau struktur menu mobile.

- [ ] **Step 1: Selaraskan nav brand typografi**

Di `components/layout/nav.tsx`, pada span brand (baris ~49–51) tambahkan `font-heading`:

```tsx
<span className="font-heading text-lg font-extrabold tracking-tight text-[#d4a72c]">
  IKASI<span className="text-white">.</span>
</span>
```

- [ ] **Step 2: Selaraskan footer (cek isi dulu)**

Buka `components/layout/footer.tsx`. Pada judul/brand footer, terapkan `font-heading` agar konsisten. Jangan ubah teks "SK Kemenkumham 2024", link, atau kolom — hanya kelas tipografi/border bila perlu.

- [ ] **Step 3: Verifikasi e2e smoke (nav+footer)**

Run: `pnpm test:e2e tests/e2e/smoke.spec.ts`
Expected: PASS (nav "Direktori" & footer "SK Kemenkumham 2024" tetap terlihat).

- [ ] **Step 4: Commit**

```bash
git add components/layout/nav.tsx components/layout/footer.tsx
git commit -m "style(layout): selaraskan tipografi nav & footer ke blueprint"
```

---

## Task 16: QA penuh + build + visual check

**Files:** (tidak ada perubahan kode kecuali perbaikan temuan)

- [ ] **Step 1: Unit test penuh**

Run: `pnpm test:run`
Expected: semua unit test PASS (format + ui-components).

- [ ] **Step 2: E2E penuh**

Run: `pnpm test:e2e`
Expected: semua PASS (smoke, public-direktori, duplicates, home-redesign).

- [ ] **Step 3: Build static export**

Run: `pnpm build`
Expected: build sukses, folder `out/` ter-generate tanpa error.

- [ ] **Step 4: Visual QA desktop + mobile**

Jalankan `pnpm dev`. Pakai browser MCP (Playwright): screenshot Beranda di 1440px dan 390px. Verifikasi terhadap mockup Stitch:
- Hero punya tekstur blueprint + tipografi heading baru.
- Statistik mobile tidak berjejal (gap memadai, angka terbaca).
- Grid fitur pakai ikon garis (bukan emoji), corner ticks terlihat.
- Tidak ada horizontal scroll di mobile.
Perbaiki temuan inline, lalu ulang Step 1–3 bila ada perubahan kode.

- [ ] **Step 5: Commit perbaikan QA (bila ada)**

```bash
git add -A
git commit -m "fix(home): perbaikan temuan QA visual Fase 0"
```

- [ ] **Step 6: Tandai Fase 0 selesai**

Pastikan seluruh checklist Definition of Done di spec terpenuhi. Lapor ke user dengan ringkasan + screenshot before/after, dan tawarkan lanjut ke Fase 1 (Direktori).

---

## Self-Review Notes

- **Spec coverage:** Visual language (Task 2), 8 komponen base (Task 5–12) + ikon (Task 13) + utilitas formatName/displayOrDash (Task 3–4), redesign Beranda (Task 14), nav/footer minimal (Task 15), DoD/QA (Task 16), Stitch/ui-ux-pro-max/Magic workflow (Task 1 + dirujuk di Task 14/16). Semua bagian spec tercakup.
- **Type consistency:** `FeatureIcon` `IconName` (Task 13) cocok dengan tipe `icon` pada array `features` (Task 14). `StatBlock(value: number|null, label)` cocok dipakai di Beranda. `Card`/`Button` prop `href`/`variant` konsisten antar task.
- **Catatan:** `StatsCounter` & `AvatarPlaceholder` lama dibiarkan (dipakai komponen lain seperti nav). Penggantian penuh ke `StatBlock`/`Avatar` di seluruh situs dilakukan bertahap pada Fase 1+ saat halaman terkait di-redesign — di luar scope Fase 0.
