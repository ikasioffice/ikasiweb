"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listAlumniPublic } from "@/lib/data/alumni";

type AngkatanGroup = { tahun: number; count: number; prodiSet: Set<string> };

export default function AngkatanPage() {
  const [groups, setGroups] = useState<AngkatanGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAlumniPublic().then((alumni) => {
      const map = new Map<number, AngkatanGroup>();
      for (const a of alumni) {
        if (!a.angkatan) continue;
        const g = map.get(a.angkatan) ?? { tahun: a.angkatan, count: 0, prodiSet: new Set() };
        g.count++;
        if (a.prodi) g.prodiSet.add(a.prodi);
        map.set(a.angkatan, g);
      }
      setGroups(Array.from(map.values()).sort((a, b) => b.tahun - a.tahun));
      setLoading(false);
    });
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Per Angkatan</span>
      </nav>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        Per <span className="text-primary">Angkatan</span>
      </h1>
      <p className="mt-2 text-muted-foreground">Daftar alumni berdasarkan tahun masuk.</p>

      {loading ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-3 pb-16 sm:grid-cols-2 md:grid-cols-3">
          {groups.map((g) => (
            <Link
              key={g.tahun}
              href={`/angkatan/${g.tahun}`}
              className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="font-heading text-2xl font-extrabold text-primary">{g.tahun}</div>
                <svg className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10M7 17 17 7" /></svg>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{g.count} alumni</div>
              {g.prodiSet.size > 0 && (
                <div className="mt-1 truncate text-xs text-muted-foreground">
                  {Array.from(g.prodiSet).join(" · ")}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
