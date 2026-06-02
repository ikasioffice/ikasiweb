"use client";

import { useEffect, useState } from "react";
import { listBisnis, type Bisnis } from "@/lib/data/bisnis";
import { BisnisCard } from "@/components/domain/bisnis-card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function BisnisPage() {
  const [list, setList] = useState<Bisnis[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <PageHeader
        title={<>Direktori <span className="gradient-text">Bisnis</span></>}
        subtitle="Usaha dan bisnis alumni IKASI Polban"
        className="mb-8"
      />

      <input
        type="search"
        placeholder="Cari nama bisnis, bidang, atau lokasi…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-8 px-4 py-3 min-h-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4a72c]/50"
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Belum ada bisnis ditemukan"
          description="Coba ubah kata kunci pencarian, atau daftarkan bisnismu sendiri."
          action={<a href="/me/bisnis" className="btn-gold px-6 py-2.5 rounded-full text-sm font-semibold">Daftarkan Bisnis</a>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((b) => (
            <BisnisCard key={b.id} bisnis={b} />
          ))}
        </div>
      )}
    </main>
  );
}
