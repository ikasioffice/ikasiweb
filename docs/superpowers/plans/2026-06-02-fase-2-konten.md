# Fase 2 — Redesign Konten — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Goal:** Terapkan Blueprint ke 6 halaman konten + perbaiki kartu bisnis "—", emoji, empty state, berita tanpa visual.

**Architecture:** Tambah ikon ke `LineIcon` + komponen `PosterThumb`, lalu refactor BisnisCard + 6 halaman. Tidak menyentuh data/RSVP/markdown.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Vitest + @testing-library/react (jsdom), Playwright.

---

## File Structure
| File | Aksi |
|---|---|
| `components/ui/icons.tsx` | Modify — tambah ikon phone/link/calendar/store/users |
| `components/ui/poster-thumb.tsx` | Create — `PosterThumb` |
| `components/domain/bisnis-card.tsx` | Modify — rebuild |
| `app/(public)/bisnis/page.tsx` | Modify |
| `app/(public)/bisnis/[id]/bisnis-detail-client.tsx` | Modify |
| `app/(public)/event/page.tsx` | Modify |
| `app/(public)/event/[id]/event-detail-client.tsx` | Modify |
| `app/(public)/news/page.tsx` | Modify |
| `app/(public)/news/[slug]/news-detail-client.tsx` | Modify |
| `tests/unit/ui-components.test.tsx` | Modify — tes PosterThumb |
| `tests/e2e/konten-redesign.spec.ts` | Create |

**Tes:** vitest jsdom, JANGAN `toBeInTheDocument`. `formatName` JANGAN dipakai untuk brand/judul.

---

## Task 1: Tambah ikon LineIcon + `PosterThumb`

**Files:** Modify `components/ui/icons.tsx`, Create `components/ui/poster-thumb.tsx`, Modify `tests/unit/ui-components.test.tsx`

- [ ] **Step 1:** Di `components/ui/icons.tsx`, perluas `LineIconName` & `LINE_PATHS`. Ubah baris tipe menjadi:

```tsx
type LineIconName = "pin" | "lock" | "check" | "mail" | "warning" | "briefcase" | "cap" | "phone" | "link" | "calendar" | "store" | "users";
```

dan tambahkan ke dalam objek `LINE_PATHS` (sebelum penutup `}`):

```tsx
  phone: "M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  link: "M9 15l6-6M10 6l1-1a4 4 0 016 6l-1 1M14 18l-1 1a4 4 0 01-6-6l1-1",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  store: "M4 9l1-4h14l1 4M5 9v10h14V9M9 19v-5h6v5",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 0112 0M17 11a3 3 0 10-2-5.2M21 20a6 6 0 00-4-5.6",
```

- [ ] **Step 2: Tambah tes** ke `tests/unit/ui-components.test.tsx`:

```tsx
import { PosterThumb } from "@/components/ui/poster-thumb";

describe("PosterThumb", () => {
  it("render <img> bila src ada", () => {
    const { container } = render(<PosterThumb src="/x.jpg" alt="Brand" />);
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/x.jpg");
  });
  it("render fallback svg bila src kosong", () => {
    const { container } = render(<PosterThumb src={null} alt="Brand" />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
```

Run `pnpm test:run tests/unit/ui-components.test.tsx` → FAIL.

- [ ] **Step 3: Create `components/ui/poster-thumb.tsx`:**

```tsx
import { LineIcon } from "@/components/ui/icons";

type LineIconName = "pin" | "lock" | "check" | "mail" | "warning" | "briefcase" | "cap" | "phone" | "link" | "calendar" | "store" | "users";

export function PosterThumb({
  src, alt, size = 64, icon = "store", className = "",
}: { src?: string | null; alt: string; size?: number; icon?: LineIconName; className?: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`rounded-xl object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`rounded-xl bg-[#142340] border border-[var(--color-blueprint-line-strong)] flex items-center justify-center flex-shrink-0 text-[#d4a72c] ${className}`}
      style={{ width: size, height: size }}
    >
      <LineIcon name={icon} size={Math.round(size * 0.4)} />
    </div>
  );
}
```

Run → PASS.

- [ ] **Step 4: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add components/ui/icons.tsx components/ui/poster-thumb.tsx tests/unit/ui-components.test.tsx
git commit -m "feat(ui): LineIcon tambahan + PosterThumb (fallback ikon, bukan emoji)"
```

---

## Task 2: Rebuild `BisnisCard`

**Files:** Modify `components/domain/bisnis-card.tsx`

Catatan: `Bisnis` punya `id, nama_brand, bidang, lokasi, detail, poster_url, no_kontak, link_medsos`.

- [ ] **Step 1: Ganti seluruh isi `components/domain/bisnis-card.tsx`:**

```tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineIcon } from "@/components/ui/icons";
import { PosterThumb } from "@/components/ui/poster-thumb";
import { displayOrDash } from "@/lib/format";
import type { Bisnis } from "@/lib/data/bisnis";

export function BisnisCard({ bisnis }: { bisnis: Bisnis }) {
  const nama = bisnis.nama_brand || "Bisnis Alumni";
  const bidang = displayOrDash(bisnis.bidang);
  const lokasi = displayOrDash(bisnis.lokasi);
  const detail = displayOrDash(bisnis.detail);

  return (
    <Card href={`/bisnis/${bisnis.id}`} className="flex gap-4 p-5">
      <PosterThumb src={bisnis.poster_url} alt={nama} size={64} icon="store" />
      <div className="min-w-0">
        <div className="font-semibold text-white truncate">{nama}</div>
        {bidang && <div className="mt-1"><Badge variant="gold">{bidang}</Badge></div>}
        {lokasi && (
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1.5 truncate">
            <LineIcon name="pin" size={12} /> {lokasi}
          </div>
        )}
        {detail && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{detail}</p>}
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Build** `pnpm build 2>&1 | grep -iE "error|compiled successfully" | head`.
- [ ] **Step 3: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add components/domain/bisnis-card.tsx
git commit -m "feat(bisnis): BisnisCard di atas Card/PosterThumb (fix nama —, badge, ikon)"
```

---

## Task 3: `/bisnis` list

**Files:** Modify `app/(public)/bisnis/page.tsx`

- [ ] **Step 1: Tambah import:**

```tsx
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
```

- [ ] **Step 2:** Ganti `<h1>Direktori Bisnis</h1>` + `<p>` dengan:

```tsx
      <PageHeader
        title={<>Direktori <span className="gradient-text">Bisnis</span></>}
        subtitle="Usaha dan bisnis alumni IKASI Polban"
        className="mb-8"
      />
```

- [ ] **Step 3:** Tambah `min-h-11` ke className input search (sisanya tetap).

- [ ] **Step 4:** Ganti `<div className="text-center text-slate-500 py-16">Tidak ada bisnis yang ditemukan.</div>` dengan:

```tsx
        <EmptyState
          title="Belum ada bisnis ditemukan"
          description="Coba ubah kata kunci pencarian, atau daftarkan bisnismu sendiri."
          action={<a href="/me/bisnis" className="btn-gold px-6 py-2.5 rounded-full text-sm font-semibold">Daftarkan Bisnis</a>}
        />
```

- [ ] **Step 5: Build** → compiled successfully.
- [ ] **Step 6: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/bisnis/page.tsx"
git commit -m "feat(bisnis): PageHeader + EmptyState di direktori bisnis"
```

---

## Task 4: `/bisnis/[id]` detail

**Files:** Modify `app/(public)/bisnis/[id]/bisnis-detail-client.tsx`

- [ ] **Step 1: Tambah import:**

```tsx
import { PosterThumb } from "@/components/ui/poster-thumb";
import { LineIcon } from "@/components/ui/icons";
```

- [ ] **Step 2:** Ganti blok poster header (img / emoji 🏪 `<div ...>🏪</div>`) dengan:

```tsx
        <PosterThumb src={bisnis.poster_url} alt={bisnis.nama_brand ?? "Bisnis"} size={96} icon="store" className="rounded-2xl" />
```

Dan tambahkan `font-heading` ke `<h1>`: `<h1 className="font-heading text-4xl font-extrabold tracking-tight">`.

- [ ] **Step 3:** Pada Section Kontak, ganti emoji:
  - `📱 {bisnis.no_kontak}` → `<span className="inline-flex items-center gap-1.5 text-slate-300"><LineIcon name="phone" /> {bisnis.no_kontak}</span>`
  - `🔗 {bisnis.link_medsos}` → `<span className="inline-flex items-center gap-1.5"><LineIcon name="link" /> {bisnis.link_medsos}</span>` (di dalam `<a>` yang sudah ada).

- [ ] **Step 4: Build** → compiled successfully.
- [ ] **Step 5: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/bisnis/[id]/bisnis-detail-client.tsx"
git commit -m "feat(bisnis): detail pakai PosterThumb + ikon kontak"
```

---

## Task 5: `/event` list

**Files:** Modify `app/(public)/event/page.tsx`

- [ ] **Step 1: Tambah import:**

```tsx
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { PosterThumb } from "@/components/ui/poster-thumb";
import { LineIcon } from "@/components/ui/icons";
```

- [ ] **Step 2:** Ganti `<h1>Acara IKASI</h1>` + `<p>` dengan:

```tsx
      <PageHeader
        title={<><span className="gradient-text">Acara</span> IKASI</>}
        subtitle="Reuni, seminar, dan gathering alumni"
        className="mb-10"
      />
```

- [ ] **Step 3:** Ganti empty (`Belum ada acara yang akan datang.`) dengan:

```tsx
        <EmptyState
          title="Belum ada acara mendatang"
          description="Nantikan reuni, seminar, dan gathering alumni berikutnya."
          icon={<LineIcon name="calendar" size={24} />}
        />
```

- [ ] **Step 4:** Ganti kartu event `<Link ... className="glass-card ...">...</Link>` dengan:

```tsx
            <Card key={event.id} href={`/event/${event.id}`} className="flex gap-5 p-6">
              <PosterThumb src={event.poster_url} alt={event.title} size={80} icon="calendar" />
              <div className="min-w-0">
                <div className="text-xs text-[#d4a72c] mb-1">{formatDate(event.date)}</div>
                <h2 className="font-heading font-extrabold text-white truncate">{event.title}</h2>
                {event.location && (
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <LineIcon name="pin" size={12} /> {event.location}
                  </div>
                )}
                {event.description && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{event.description}</p>}
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                  <LineIcon name="users" size={12} /> {event.rsvp_count ?? 0} RSVP
                </div>
              </div>
            </Card>
```

(Hapus `import Link` bila tak lagi dipakai.)

- [ ] **Step 5: Build** → compiled successfully.
- [ ] **Step 6: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/event/page.tsx"
git commit -m "feat(event): PageHeader + Card/PosterThumb + EmptyState"
```

---

## Task 6: `/event/[id]` detail

**Files:** Modify `app/(public)/event/[id]/event-detail-client.tsx`

JANGAN ubah logika RSVP (`handleRsvp`, `rsvpEvent`, `hasRsvped`, state).

- [ ] **Step 1: Tambah import** `import { LineIcon } from "@/components/ui/icons";`

- [ ] **Step 2:** `<h1 className="text-4xl ...">` → tambah `font-heading`.

- [ ] **Step 3:** Ganti `📍 {event.location}` dengan:

```tsx
        <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-6">
          <LineIcon name="pin" /> {event.location}
        </div>
```

(ganti seluruh `<div ...>📍 {event.location}</div>` lama.)

- [ ] **Step 4:** Ganti `Sudah RSVP ✓` dengan `<span className="inline-flex items-center gap-1.5">Sudah RSVP <LineIcon name="check" size={14} /></span>`.

- [ ] **Step 5: Build** → compiled successfully.
- [ ] **Step 6: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/event/[id]/event-detail-client.tsx"
git commit -m "feat(event): detail ikon (RSVP logic tetap)"
```

---

## Task 7: `/news` list

**Files:** Modify `app/(public)/news/page.tsx`

- [ ] **Step 1: Tambah import:**

```tsx
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
```

- [ ] **Step 2:** Ganti `<h1>Berita IKASI</h1>` + `<p>` dengan:

```tsx
      <PageHeader
        title={<><span className="gradient-text">Berita</span> IKASI</>}
        subtitle="Informasi terkini dari keluarga besar alumni"
        className="mb-10"
      />
```

- [ ] **Step 3:** Ganti empty (`Belum ada artikel yang dipublish.`) dengan:

```tsx
        <EmptyState
          title="Belum ada artikel"
          description="Berita & informasi terbaru dari IKASI akan tampil di sini."
        />
```

- [ ] **Step 4:** Ganti kartu berita `<Link ... className="glass-card ...">...</Link>` dengan versi `Card` + thumbnail cover bila ada:

```tsx
            <Card key={post.id} href={`/news/${post.slug}`} className="flex gap-5 p-6">
              {post.cover_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.cover_image} alt={post.title} className="hidden sm:block w-28 h-20 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-xs text-slate-500 mb-2">
                  {formatDate(post.published_at)} {post.author && `· ${post.author}`}
                </div>
                <h2 className="font-heading font-extrabold text-lg text-white mb-2">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-slate-400 line-clamp-2">{post.excerpt}</p>}
              </div>
            </Card>
```

(Hapus `import Link` bila tak dipakai lagi.)

- [ ] **Step 5: Build** → compiled successfully.
- [ ] **Step 6: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/news/page.tsx"
git commit -m "feat(berita): PageHeader + Card + thumbnail cover + EmptyState"
```

---

## Task 8: `/news/[slug]` detail

**Files:** Modify `app/(public)/news/[slug]/news-detail-client.tsx`

JANGAN ubah `renderMarkdown`.

- [ ] **Step 1: Tambah import** `import { EmptyState } from "@/components/ui/empty-state";`

- [ ] **Step 2:** Ganti blok not-found:

```tsx
  if (post === "not-found") {
    return (
      <main className="px-6 py-16 max-w-3xl mx-auto">
        <EmptyState
          title="Artikel tidak ditemukan"
          description="Artikel yang kamu cari mungkin sudah dipindah atau dihapus."
          action={<Link href="/news" className="btn-gold px-6 py-2.5 rounded-full text-sm font-semibold">Kembali ke Berita</Link>}
        />
      </main>
    );
  }
```

- [ ] **Step 3:** `<h1 className="text-4xl ...">` → tambah `font-heading`.

- [ ] **Step 4: Build** → compiled successfully.
- [ ] **Step 5: Commit**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add "app/(public)/news/[slug]/news-detail-client.tsx"
git commit -m "feat(berita): detail font-heading + EmptyState not-found"
```

---

## Task 9: E2E regresi + QA penuh

**Files:** Create `tests/e2e/konten-redesign.spec.ts`

- [ ] **Step 1: Create `tests/e2e/konten-redesign.spec.ts`:**

```ts
import { expect, test } from "@playwright/test";

test("bisnis: header & search tampil", async ({ page }) => {
  await page.goto("/bisnis");
  await expect(page.getByRole("heading", { name: /Direktori/ })).toBeVisible();
  await expect(page.getByPlaceholder(/Cari nama bisnis/)).toBeVisible();
});

test("event: header tampil", async ({ page }) => {
  await page.goto("/event");
  await expect(page.getByRole("heading", { name: /Acara/ })).toBeVisible();
});

test("berita: header tampil", async ({ page }) => {
  await page.goto("/news");
  await expect(page.getByRole("heading", { name: /Berita/ })).toBeVisible();
});

test("berita detail: artikel pertama bisa dibuka & markdown ter-render", async ({ page }) => {
  await page.goto("/news");
  const first = page.locator("a[href^='/news/']").first();
  await first.click();
  await page.waitForURL(/\/news\/.+/);
  await expect(page.locator("article")).toBeVisible();
});
```

- [ ] **Step 2: Run**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web" && pnpm test:e2e tests/e2e/konten-redesign.spec.ts 2>&1 | tail -15
```

Expected: PASS. Bila berita kosong (tanpa Supabase) test ke-4 bisa gagal klik — bila begitu, longgarkan jadi cek heading saja & catat.

- [ ] **Step 3: Suite penuh + build:**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web" && pnpm test:run 2>&1 | tail -5 && rm -rf .next && pnpm build 2>&1 | grep -iE "compiled successfully|error" | head
```

Expected: unit PASS, build sukses.

- [ ] **Step 4: Visual QA** — `pnpm dev`, screenshot desktop(1440)+mobile(390) `/bisnis`, `/event`, `/news`. Verifikasi: tanpa emoji, kartu bisnis tanpa nama "—", EmptyState berkarakter (bila kosong), thumbnail berita, tidak ada horizontal scroll. Perbaiki temuan inline; ulang Step 3.

- [ ] **Step 5: Commit e2e + perbaikan**

```bash
cd "/Volumes/Bukan OS/Projects/ikasi/ikasi-web"
git add tests/e2e/konten-redesign.spec.ts
git commit -m "test(konten): e2e regresi bisnis/event/berita"
```

Lapor Fase 2 selesai + tawarkan Fase 3.

---

## Self-Review Notes
- **Spec coverage:** PosterThumb+ikon (T1), BisnisCard (T2), /bisnis (T3), /bisnis/[id] (T4), /event (T5), /event/[id] (T6), /news (T7), /news/[slug] (T8), e2e+QA (T9). Lengkap.
- **Type consistency:** `PosterThumb` props (`src,alt,size,icon`) konsisten dipakai BisnisCard/EventCard/detail. `LineIcon` nama baru (phone/link/calendar/store/users) dipakai sesuai. `LineIconName` di poster-thumb.tsx harus cocok dengan yang di icons.tsx.
- **Penting:** `formatName` TIDAK dipakai di Fase 2 (brand/judul bukan nama orang). Hanya `displayOrDash` untuk field opsional.
