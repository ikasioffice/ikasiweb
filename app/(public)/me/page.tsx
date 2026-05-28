"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AvatarPlaceholder } from "@/components/domain/avatar-placeholder";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import Link from "next/link";

type AlumniRow = Database["public"]["Tables"]["alumni"]["Row"];

function MeContent() {
  const { user, isVerified, isAdmin, signOut } = useAuth();
  const [alumni, setAlumni] = useState<AlumniRow | null | "not-linked">(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("alumni")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setAlumni(data ?? "not-linked");
        setLoading(false);
      });
  }, [user]);

  if (!user) return null;

  const name = user.user_metadata?.full_name ?? user.email ?? "Alumni";

  return (
    <main className="px-6 py-12 max-w-3xl mx-auto">
      {/* Profile header */}
      <div className="flex gap-5 items-center mb-10">
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={name}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <AvatarPlaceholder name={name} size={80} />
        )}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{name}</h1>
          <div className="text-sm text-slate-400 mt-1">{user.email}</div>
          <div className="flex gap-2 mt-2">
            {isVerified && (
              <span className="px-2 py-0.5 rounded-full bg-[#d4a72c]/20 text-[#d4a72c] text-xs font-semibold">
                Alumni Terverifikasi
              </span>
            )}
            {isAdmin && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Alumni link status */}
      {loading ? (
        <div className="glass-card rounded-2xl h-24 animate-pulse mb-6" />
      ) : alumni === "not-linked" ? (
        <div className="glass-card rounded-2xl p-6 mb-6 border-[#d4a72c]/20">
          <div className="font-semibold text-white mb-2">Akun belum terhubung ke data alumni</div>
          <p className="text-sm text-slate-400 mb-4">
            Email kamu belum terdaftar di database IKASI. Hubungi pengurus untuk verifikasi.
          </p>
          <a
            href="mailto:ikasioffice@gmail.com?subject=Verifikasi Alumni IKASI"
            className="btn-gold px-5 py-2 rounded-full text-xs inline-block"
          >
            Hubungi Pengurus
          </a>
        </div>
      ) : alumni ? (
        <section className="mb-6 pb-6 border-b border-white/[0.06]">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Data Alumni</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-400 text-xs mb-1">Angkatan</div>
              <div className="text-[#d4a72c] font-semibold">{alumni.angkatan ?? "—"}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Program Studi</div>
              <div>{alumni.prodi ?? "—"}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Jabatan</div>
              <div>{alumni.jabatan ?? "—"}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Tempat Kerja</div>
              <div>{alumni.tempat_kerja ?? "—"}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Domisili</div>
              <div>{alumni.domisili ?? "—"}</div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/me/bisnis" className="glass-card rounded-2xl p-5 hover:border-[#d4a72c]/40 transition-colors">
          <div className="font-semibold mb-1">Bisnis Saya</div>
          <div className="text-xs text-slate-400">Kelola bisnis atau usaha yang kamu daftarkan</div>
        </Link>
        {isAdmin && (
          <Link href="/admin" className="glass-card rounded-2xl p-5 hover:border-blue-400/40 transition-colors">
            <div className="font-semibold mb-1">Dashboard Admin</div>
            <div className="text-xs text-slate-400">Kelola konten dan verifikasi alumni</div>
          </Link>
        )}
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="mt-10 text-sm text-slate-500 hover:text-red-400 transition-colors"
      >
        Keluar dari akun
      </button>
    </main>
  );
}

export default function MePage() {
  return (
    <AuthGuard>
      <MeContent />
    </AuthGuard>
  );
}
