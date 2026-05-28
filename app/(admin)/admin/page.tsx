"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Stats = {
  alumni: number | null;
  unverified: number | null;
  bisnis: number | null;
  news: number | null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    alumni: null,
    unverified: null,
    bisnis: null,
    news: null,
  });

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("alumni").select("*", { count: "exact", head: true }),
      supabase.from("alumni").select("*", { count: "exact", head: true }).eq("is_verified", false),
      supabase.from("bisnis").select("*", { count: "exact", head: true }),
      supabase.from("posts").select("*", { count: "exact", head: true }),
    ]).then(([a, u, b, n]) => {
      setStats({ alumni: a.count, unverified: u.count, bisnis: b.count, news: n.count });
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Alumni", value: stats.alumni, href: "/admin/alumni" },
          { label: "Belum Terverifikasi", value: stats.unverified, href: "/admin/alumni?filter=unverified", urgent: (stats.unverified ?? 0) > 0 },
          { label: "Bisnis Terdaftar", value: stats.bisnis, href: "/bisnis" },
          { label: "Artikel Berita", value: stats.news, href: "/admin/news" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`glass-card rounded-2xl p-5 hover:border-[#d4a72c]/40 transition-colors ${
              s.urgent ? "border-orange-500/30" : ""
            }`}
          >
            <div className={`text-3xl font-extrabold ${s.urgent ? "text-orange-400" : "gradient-text"}`}>
              {s.value ?? "—"}
            </div>
            <div className="text-sm text-slate-400 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: "/admin/alumni", label: "Verifikasi Alumni", desc: "Approve atau reject permintaan verifikasi" },
          { href: "/admin/alumni/duplicates", label: "Duplikat Alumni", desc: "Review dan hapus data alumni duplikat" },
          { href: "/admin/alumni/deletions", label: "Riwayat Hapus", desc: "Lihat dan restore alumni yang dihapus" },
          { href: "/admin/news", label: "Kelola Berita", desc: "Tulis dan publish artikel" },
          { href: "/admin/events", label: "Kelola Acara", desc: "Buat dan manage event IKASI" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="glass-card rounded-2xl p-5 hover:border-[#d4a72c]/40 transition-colors"
          >
            <div className="font-semibold text-white mb-1">{a.label}</div>
            <div className="text-xs text-slate-400">{a.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
