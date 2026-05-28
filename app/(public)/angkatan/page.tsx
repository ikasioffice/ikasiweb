"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listAlumniPublic, type AlumniPublic } from "@/lib/data/alumni";

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
    <main className="px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        Per <span className="gradient-text">Angkatan</span>
      </h1>
      <p className="text-slate-400 mb-10">Daftar alumni berdasarkan tahun masuk</p>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {groups.map((g) => (
            <Link
              key={g.tahun}
              href={`/angkatan/${g.tahun}`}
              className="glass-card rounded-2xl p-5 hover:border-[#d4a72c]/40 transition-colors"
            >
              <div className="text-2xl font-extrabold text-[#d4a72c]">{g.tahun}</div>
              <div className="text-sm text-slate-400 mt-1">{g.count} alumni</div>
              {g.prodiSet.size > 0 && (
                <div className="text-xs text-slate-500 mt-1 truncate">
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
