"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listAlumniPublic, matchesAlumniFilter, type AlumniPublic } from "@/lib/data/alumni";
import { AlumniCard } from "@/components/domain/alumni-card";
import { SearchFilterBar } from "@/components/domain/search-filter-bar";
import { Pagination } from "@/components/ui/pagination";
import { useAuth } from "@/lib/auth/use-auth";

const PER_PAGE = 20;

export default function AlumniDirectoryPage() {
  const { isVerified } = useAuth();
  const [all, setAll] = useState<AlumniPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [angkatan, setAngkatan] = useState<number | null>(null);
  const [prodi, setProdi] = useState<string | null>(null);
  const [domisili, setDomisili] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    listAlumniPublic()
      .then(setAll)
      .finally(() => setLoading(false));
  }, []);

  const opts = useMemo(() => ({
    angkatan: Array.from(new Set(all.map((a) => a.angkatan).filter(Boolean))).sort((a, b) => b! - a!) as number[],
    prodi: Array.from(new Set(all.map((a) => a.prodi).filter(Boolean))) as string[],
    domisili: Array.from(new Set(all.map((a) => a.domisili).filter(Boolean))).sort() as string[],
  }), [all]);

  const filtered = useMemo(() => {
    return all.filter((a) =>
      matchesAlumniFilter(a, {
        query: query || undefined,
        angkatan: angkatan ?? undefined,
        prodi: prodi ?? undefined,
        domisili: domisili ?? undefined,
      }),
    );
  }, [all, query, angkatan, prodi, domisili]);

  // reset ke halaman 1 setiap kali filter berubah
  useEffect(() => { setPage(1); }, [query, angkatan, prodi, domisili]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goPage = (p: number) => {
    setPage(p);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Direktori Alumni</span>
      </nav>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        Direktori <span className="text-primary">{all.length.toLocaleString("id-ID")} Alumni</span>
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Cari rekan kerja, mentor, atau partner bisnis dari alumni Teknik Sipil Polban — terverifikasi.
      </p>

      <div className="mt-8">
        <SearchFilterBar
          query={query} onQuery={setQuery}
          angkatan={angkatan} onAngkatan={setAngkatan}
          prodi={prodi} onProdi={setProdi}
          domisili={domisili} onDomisili={setDomisili}
          optionsAngkatan={opts.angkatan}
          optionsProdi={opts.prodi}
          optionsDomisili={opts.domisili}
          onReset={() => { setQuery(""); setAngkatan(null); setProdi(null); setDomisili(null); }}
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="text-base font-bold text-primary">{filtered.length.toLocaleString("id-ID")}</span> alumni
          {!loading && filtered.length > 0 && (
            <span className="ml-1">· halaman {page} dari {totalPages}</span>
          )}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-60 animate-pulse rounded-lg border border-border bg-muted" />
            ))
          : pageItems.map((a) => <AlumniCard key={a.id} alumni={a} isVerified={isVerified} />)}
      </div>

      {!loading && filtered.length > 0 && (
        <div className="mt-10 pb-16">
          <Pagination page={page} totalPages={totalPages} onPage={goPage} />
        </div>
      )}
    </main>
  );
}
