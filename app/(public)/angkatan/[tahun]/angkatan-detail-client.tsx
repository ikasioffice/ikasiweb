"use client";

import { useEffect, useState, use } from "react";
import { listAlumniPublic, type AlumniPublic } from "@/lib/data/alumni";
import { AlumniCard } from "@/components/domain/alumni-card";

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
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        Angkatan <span className="gradient-text">{tahun}</span>
      </h1>
      <p className="text-slate-400 mb-8">{alumni.length} alumni terdaftar</p>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : alumni.length === 0 ? (
        <div className="text-center text-slate-500 py-16">Tidak ada alumni ditemukan.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.map((a) => (
            <AlumniCard key={a.id} alumni={a} />
          ))}
        </div>
      )}
    </main>
  );
}
