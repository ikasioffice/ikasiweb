"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getBisnisById, type Bisnis } from "@/lib/data/bisnis";
import { Badge } from "@/components/ui/badge";
import { LineIcon } from "@/components/ui/icons";

export function BisnisDetailClient({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const [bisnis, setBisnis] = useState<Bisnis | null>(null);

  useEffect(() => {
    if (!id) return;
    getBisnisById(id).then(setBisnis);
  }, [id]);

  if (!bisnis) return <div className="mx-auto max-w-4xl px-4 py-16 text-muted-foreground sm:px-6">Memuat…</div>;

  const nama = bisnis.nama_brand ?? "Bisnis";

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <Link href="/bisnis" className="hover:text-foreground">Bisnis</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{nama}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              {bisnis.poster_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bisnis.poster_url} alt={nama} className="h-16 w-16 shrink-0 rounded-xl object-cover" style={{ width: 64, height: 64 }} />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <LineIcon name="store" size={28} />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="font-heading text-2xl font-extrabold tracking-tight">{nama}</h1>
                {bisnis.bidang && <p className="text-muted-foreground">{bisnis.bidang}</p>}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {bisnis.bidang && <Badge variant="neutral">{bisnis.bidang}</Badge>}
                  {bisnis.lokasi && <Badge variant="neutral"><LineIcon name="pin" size={12} /> {bisnis.lokasi}</Badge>}
                </div>
              </div>
            </div>
            {bisnis.detail && (
              <p className="mt-5 leading-relaxed text-muted-foreground">{bisnis.detail}</p>
            )}
          </div>

          {bisnis.poster_url && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Galeri</h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bisnis.poster_url} alt={nama} className="w-full rounded-lg object-cover" />
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">
          {(bisnis.no_kontak || bisnis.link_medsos) && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Kontak &amp; Tautan</h2>
              <div className="space-y-2">
                {bisnis.no_kontak && (
                  <a href={`tel:${bisnis.no_kontak}`} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium transition-colors hover:bg-accent">
                    <LineIcon name="phone" size={16} className="text-primary" /> {bisnis.no_kontak}
                  </a>
                )}
                {bisnis.link_medsos && (
                  <a href={bisnis.link_medsos} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium transition-colors hover:bg-accent">
                    <LineIcon name="link" size={16} className="text-primary" /> <span className="truncate">{bisnis.link_medsos}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <Link href="/bisnis" className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Kembali ke daftar bisnis
          </Link>
        </div>
      </div>
    </main>
  );
}
