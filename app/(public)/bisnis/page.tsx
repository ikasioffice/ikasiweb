"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listBisnis, type Bisnis } from "@/lib/data/bisnis";
import { BisnisCard } from "@/components/domain/bisnis-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";

const PER_PAGE = 20;

export default function BisnisPage() {
  const [list, setList] = useState<Bisnis[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    listBisnis().then((data) => {
      setList(data);
      setLoading(false);
    });
  }, []);

  const filtered = list.filter((b) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      b.nama_brand?.toLowerCase().includes(q) ||
      b.bidang?.toLowerCase().includes(q) ||
      b.lokasi?.toLowerCase().includes(q)
    );
  });

  useEffect(() => { setPage(1); }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const goPage = (p: number) => {
    setPage(p);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <nav className="mb-3 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Beranda</Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Bisnis</span>
          </nav>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Direktori <span className="text-primary">Bisnis</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Usaha dan bisnis alumni IKASI Polban.</p>
        </div>
        <Link
          href="/me/bisnis"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5v14" /></svg>
          Daftarkan Bisnis
        </Link>
      </div>

      <div className="relative mt-8">
        <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <input
          type="search"
          placeholder="Cari nama bisnis, bidang, atau lokasi…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="mt-8">
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg border border-border bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Belum ada bisnis ditemukan"
          description="Coba ubah kata kunci pencarian, atau daftarkan bisnismu sendiri."
          action={<Link href="/me/bisnis" className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Daftarkan Bisnis</Link>}
        />
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="font-bold text-primary">{filtered.length.toLocaleString("id-ID")}</span> bisnis · halaman {page} dari {totalPages}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pageItems.map((b) => (
              <BisnisCard key={b.id} bisnis={b} />
            ))}
          </div>
          <div className="mt-10 pb-16">
            <Pagination page={page} totalPages={totalPages} onPage={goPage} />
          </div>
        </>
      )}
      </div>
    </main>
  );
}
