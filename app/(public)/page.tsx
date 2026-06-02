"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionShell } from "@/components/ui/section-shell";
import { StatBlock } from "@/components/ui/stat-block";
import { Badge } from "@/components/ui/badge";
import { FeatureIcon } from "@/components/ui/icons";

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
        (angkatanRes.data ?? []).map((r) => r.angkatan).filter(Boolean),
      );
      setStats({ alumni: alumniRes.count, bisnis: bisnisRes.count, angkatan: tahunSet.size });
    });
  }, []);

  return (
    <main>
      {/* Hero */}
      <SectionShell grid className="py-24" innerClassName="max-w-4xl text-center">
        <div className="mb-6 flex justify-center">
          <Badge variant="gold">IKATAN ALUMNI TEKNIK SIPIL · POLBAN</Badge>
        </div>
        <h1 className="font-heading mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Satu Platform, <span className="gradient-text">Ribuan Alumni</span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
          Wadah resmi alumni Teknik Sipil Polban sejak 28 April 2001. Terhubung
          dengan ribuan alumni dari angkatan 1982 hingga sekarang — temukan
          kolega, kolaborasi bisnis, dan peluang karier.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/alumni" size="lg">Jelajahi Direktori</Button>
          <Button href="/daftar" variant="outline" size="lg">Bergabung Gratis</Button>
        </div>
      </SectionShell>

      {/* Stats */}
      <SectionShell className="border-y border-white/[0.06] py-16" innerClassName="max-w-3xl">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          <StatBlock value={stats.alumni} label="Alumni Terdaftar" />
          <StatBlock value={stats.angkatan} label="Angkatan" />
          <StatBlock value={stats.bisnis} label="Bisnis Alumni" />
        </div>
      </SectionShell>

      {/* Feature grid */}
      <SectionShell className="py-20">
        <h2 className="font-heading mb-12 text-center text-3xl font-extrabold tracking-tight">
          Semua yang kamu butuhkan
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.href} href={f.href}>
              <div className="mb-4 text-[#d4a72c]">
                <FeatureIcon name={f.icon} />
              </div>
              <div className="font-heading mb-1 font-semibold text-white">{f.title}</div>
              <div className="text-sm text-slate-400">{f.desc}</div>
            </Card>
          ))}
        </div>
      </SectionShell>

      {/* CTA Banner */}
      <SectionShell className="py-20" innerClassName="max-w-3xl">
        <Card className="border-[#d4a72c]/20 p-10 text-center">
          <h2 className="font-heading mb-4 text-3xl font-extrabold tracking-tight">
            Sudah lulus? <span className="gradient-text">Daftarkan dirimu.</span>
          </h2>
          <p className="mb-8 text-slate-400">
            Bergabung gratis. Verifikasi alumni untuk akses kontak dan fitur lengkap.
          </p>
          <Button href="/daftar" size="lg">Mulai Sekarang</Button>
        </Card>
      </SectionShell>
    </main>
  );
}

const features: { href: string; icon: "directory" | "angkatan" | "bisnis" | "acara" | "berita" | "tentang"; title: string; desc: string }[] = [
  { href: "/alumni", icon: "directory", title: "Direktori Alumni", desc: "Cari alumni berdasarkan nama, angkatan, atau bidang pekerjaan." },
  { href: "/angkatan", icon: "angkatan", title: "Per Angkatan", desc: "Lihat semua alumni dari angkatan yang sama." },
  { href: "/bisnis", icon: "bisnis", title: "Bisnis Alumni", desc: "Temukan produk dan jasa dari sesama alumni." },
  { href: "/event", icon: "acara", title: "Acara", desc: "Reuni, seminar, dan gathering alumni IKASI." },
  { href: "/news", icon: "berita", title: "Berita", desc: "Informasi terkini dari keluarga besar IKASI." },
  { href: "/sejarah", icon: "tentang", title: "Tentang IKASI", desc: "Sejarah, visi misi, dan struktur pengurus." },
];
