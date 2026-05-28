"use client";

import { useEffect, useMemo, useState } from "react";
import { listAlumniPublic, matchesAlumniFilter, type AlumniPublic } from "@/lib/data/alumni";
import { AlumniCard } from "@/components/domain/alumni-card";
import { SearchFilterBar } from "@/components/domain/search-filter-bar";
import { useAuth } from "@/lib/auth/use-auth";

export default function AlumniDirectoryPage() {
  const { isVerified } = useAuth();
  const [all, setAll] = useState<AlumniPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [angkatan, setAngkatan] = useState<number | null>(null);
  const [prodi, setProdi] = useState<string | null>(null);
  const [domisili, setDomisili] = useState<string | null>(null);

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

  return (
    <>
      <header className="px-12 py-14">
        <div className="text-xs text-slate-400 mb-4 tracking-wide">
          Beranda <span className="text-slate-600 mx-2">/</span> Direktori Alumni
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-3">
          Direktori <span className="gradient-text">{all.length} Alumni</span>
        </h1>
        <p className="text-slate-300 max-w-xl">
          Cari rekan kerja, mentor, atau partner bisnis dari alumni Teknik Sipil Polban — terverifikasi.
        </p>
      </header>

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

      <div className="px-12 pt-6 pb-2 flex justify-between text-sm text-slate-400">
        <div><strong className="text-[#d4a72c] text-base">{filtered.length}</strong> alumni</div>
      </div>

      <div className="px-12 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl h-60 animate-pulse" />
            ))
          : filtered.map((a) => <AlumniCard key={a.id} alumni={a} isVerified={isVerified} />)}
      </div>
    </>
  );
}
