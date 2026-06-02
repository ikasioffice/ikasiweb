"use client";

import { useEffect, useState, use } from "react";
import { listAlumniPublic, type AlumniPublic } from "@/lib/data/alumni";
import { AlumniCard } from "@/components/domain/alumni-card";
import { PageHeader } from "@/components/ui/page-header";
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
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <PageHeader
        title={<>Angkatan <span className="gradient-text">{tahun}</span></>}
        subtitle={`${alumni.length} alumni terdaftar`}
        className="mb-8"
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : alumni.length === 0 ? (
        <EmptyState
          title="Belum ada alumni di angkatan ini"
          description="Data alumni angkatan ini belum tersedia. Cek angkatan lain atau hubungi pengurus."
        />
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
