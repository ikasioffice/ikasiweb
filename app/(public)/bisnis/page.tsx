"use client";

import { useEffect, useState } from "react";
import { listBisnis, type Bisnis } from "@/lib/data/bisnis";
import { BisnisCard } from "@/components/domain/bisnis-card";

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
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        Direktori <span className="gradient-text">Bisnis</span>
      </h1>
      <p className="text-slate-400 mb-8">Usaha dan bisnis alumni IKASI Polban</p>

      <input
        type="search"
        placeholder="Cari nama bisnis, bidang, atau lokasi…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-8 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4a72c]/50"
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-slate-500 py-16">Tidak ada bisnis yang ditemukan.</div>
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
