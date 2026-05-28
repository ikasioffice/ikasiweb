"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StatsCounter } from "@/components/domain/stats-counter";

type Stats = { alumni: number | null; bisnis: number | null; angkatan: number | null };

export default function Home() {
  const [stats, setStats] = useState<Stats>({ alumni: null, bisnis: null, angkatan: null });

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("alumni_public").select("*", { count: "exact", head: true }),
      supabase.from("bisnis").select("*", { count: "exact", head: true }),
      supabase.from("alumni_public").select("angkatan"),
    ]).then(([alumniRes, bisnisRes, angkatanRes]) => {
      const tahunSet = new Set(
        (angkatanRes.data ?? []).map((r) => r.angkatan).filter(Boolean)
      );
      setStats({
        alumni: alumniRes.count,
        bisnis: bisnisRes.count,
        angkatan: tahunSet.size,
      });
    });
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full border border-[#d4a72c]/30 bg-[#d4a72c]/10 text-[#d4a72c] text-xs font-semibold tracking-wider mb-6">
          IKATAN ALUMNI TEKNIK SIPIL · POLBAN
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          Satu Platform,{" "}
          <span className="gradient-text">Ribuan Alumni</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Terhubung dengan alumni Teknik Sipil Polban dari seluruh Indonesia.
          Temukan kolega, kolaborasi bisnis, dan peluang karier.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/alumni" className="btn-gold px-8 py-3 rounded-full font-semibold">
            Jelajahi Direktori
          </Link>
          <Link
            href="/daftar"
            className="px-8 py-3 rounded-full border border-white/20 text-white font-semibold hover:border-[#d4a72c]/50 transition-colors"
          >
            Bergabung Gratis
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 border-y border-white/[0.06]">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8">
          <StatsCounter value={stats.alumni} label="Alumni Terdaftar" />
          <StatsCounter value={stats.angkatan} label="Angkatan" />
          <StatsCounter value={stats.bisnis} label="Bisnis Alumni" />
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-center mb-12">
          Semua yang kamu butuhkan
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="glass-card rounded-2xl p-6 hover:border-[#d4a72c]/40 transition-colors group"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <div className="font-semibold text-white mb-1">{f.title}</div>
              <div className="text-sm text-slate-400">{f.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-10 text-center border-[#d4a72c]/20">
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            Sudah lulus? <span className="gradient-text">Daftarkan dirimu.</span>
          </h2>
          <p className="text-slate-400 mb-8">
            Bergabung gratis. Verifikasi alumni untuk akses kontak dan fitur lengkap.
          </p>
          <Link href="/daftar" className="btn-gold px-10 py-3 rounded-full font-semibold">
            Mulai Sekarang
          </Link>
        </div>
      </section>

    </main>
  );
}

const features = [
  {
    href: "/alumni",
    icon: "👤",
    title: "Direktori Alumni",
    desc: "Cari alumni berdasarkan nama, angkatan, atau bidang pekerjaan.",
  },
  {
    href: "/angkatan",
    icon: "🎓",
    title: "Per Angkatan",
    desc: "Lihat semua alumni dari angkatan yang sama.",
  },
  {
    href: "/bisnis",
    icon: "🏪",
    title: "Bisnis Alumni",
    desc: "Temukan produk dan jasa dari sesama alumni.",
  },
  {
    href: "/event",
    icon: "📅",
    title: "Acara",
    desc: "Reuni, seminar, dan gathering alumni IKASI.",
  },
  {
    href: "/news",
    icon: "📰",
    title: "Berita",
    desc: "Informasi terkini dari keluarga besar IKASI.",
  },
  {
    href: "/sejarah",
    icon: "🏛️",
    title: "Tentang IKASI",
    desc: "Sejarah, visi misi, dan struktur pengurus.",
  },
];
