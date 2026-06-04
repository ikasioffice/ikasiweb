"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { listAlumniPublic, type AlumniPublic } from "@/lib/data/alumni";
import { AlumniCard } from "@/components/domain/alumni-card";
import { EmptyState } from "@/components/ui/empty-state";

export function AngkatanDetailClient({ paramsPromise }: { paramsPromise: Promise<{ tahun: string }> }) {
  const { tahun } = use(paramsPromise);
  const tahunNum = Number(tahun);
  const [alumni, setAlumni] = useState<AlumniPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAlumniPublic().then((all) => {
      setAlumni(all.filter((a) => a.angkatan === tahunNum));
      setLoading(false);
    });
  }, [tahunNum]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <Link href="/angkatan" className="hover:text-foreground">Per Angkatan</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{tahun}</span>
      </nav>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        Angkatan <span className="text-primary">{tahun}</span>
      </h1>
      <p className="mt-2 text-muted-foreground">{alumni.length} alumni terdaftar.</p>

      <div className="mt-8">
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-lg border border-border bg-muted" />
          ))}
        </div>
      ) : alumni.length === 0 ? (
        <EmptyState
          title="Belum ada alumni di angkatan ini"
          description="Data alumni angkatan ini belum tersedia. Cek angkatan lain atau hubungi pengurus."
        />
      ) : (
        <div className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.map((a) => (
            <AlumniCard key={a.id} alumni={a} />
          ))}
        </div>
      )}
      </div>
    </main>
  );
}
