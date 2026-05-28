"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Alumni = Database["public"]["Tables"]["alumni"]["Row"];

function AdminAlumniContent() {
  const searchParams = useSearchParams();
  const filterUnverified = searchParams.get("filter") === "unverified";

  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(filterUnverified);

  const supabase = createClient();

  useEffect(() => {
    async function fetchAll() {
      const PAGE = 1000;
      let all: Alumni[] = [];
      let from = 0;
      while (true) {
        let q = supabase.from("alumni").select("*").order("angkatan", { ascending: false }).range(from, from + PAGE - 1);
        if (showUnverifiedOnly) q = q.eq("is_verified", false);
        const { data } = await q;
        if (!data || data.length === 0) break;
        all = [...all, ...data];
        if (data.length < PAGE) break;
        from += PAGE;
      }
      setAlumni(all);
      setLoading(false);
    }
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUnverifiedOnly]);

  async function toggleVerify(id: string, current: boolean) {
    const next = !current;
    await supabase.from("alumni").update({ is_verified: next }).eq("id", id);
    setAlumni((prev) => prev.map((a) => a.id === id ? { ...a, is_verified: next } : a));
  }

  const filtered = alumni.filter((a) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return [a.nama, a.email, a.prodi].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight mb-6">Verifikasi Alumni</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="search"
          placeholder="Cari nama, email, prodi…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d4a72c]/50"
        />
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={showUnverifiedOnly}
            onChange={(e) => setShowUnverifiedOnly(e.target.checked)}
            className="accent-[#d4a72c]"
          />
          Belum terverifikasi saja
        </label>
      </div>

      <div className="text-xs text-slate-500 mb-4">{filtered.length} alumni</div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="glass-card rounded-xl h-14 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-slate-500 text-center py-12">Tidak ada alumni ditemukan.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <div key={a.id} className="glass-card rounded-xl px-5 py-3.5 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm truncate">{a.nama ?? "—"}</span>
                  {a.is_verified ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 flex-shrink-0">Verified</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-900/30 text-orange-400 flex-shrink-0">Unverified</span>
                  )}
                </div>
                <div className="text-xs text-slate-400">
                  {a.angkatan} · {a.prodi} · {a.email ?? "no email"}
                  {a.auth_user_id && " · linked"}
                </div>
              </div>
              <button
                onClick={() => toggleVerify(a.id, a.is_verified ?? false)}
                className={`text-xs px-4 py-1.5 rounded-lg border transition-colors flex-shrink-0 ${
                  a.is_verified
                    ? "border-red-500/30 text-red-400 hover:border-red-500/60"
                    : "border-green-500/30 text-green-400 hover:border-green-500/60"
                }`}
              >
                {a.is_verified ? "Batalkan" : "Verifikasi"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminAlumniPage() {
  return (
    <Suspense>
      <AdminAlumniContent />
    </Suspense>
  );
}
