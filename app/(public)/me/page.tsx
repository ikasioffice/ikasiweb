"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AvatarPlaceholder } from "@/components/domain/avatar-placeholder";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import Link from "next/link";

type AlumniRow = Database["public"]["Tables"]["alumni"]["Row"];

type EditForm = {
  nama: string;
  domisili: string;
  bidang_pekerjaan: string;
  tempat_kerja: string;
  jabatan: string;
  no_hp: string;
  pendidikan_terakhir: string;
  institusi: string;
};

function MeContent() {
  const { user, isVerified, isAdmin, signOut } = useAuth();
  const [alumni, setAlumni] = useState<AlumniRow | null | "not-linked">(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>({
    nama: "", domisili: "", bidang_pekerjaan: "",
    tempat_kerja: "", jabatan: "", no_hp: "",
    pendidikan_terakhir: "", institusi: "",
  });

  useEffect(() => {
    if (!user) return;
    createClient()
      .from("alumni")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setAlumni(data ?? "not-linked");
        if (data) {
          setForm({
            nama: data.nama ?? "",
            domisili: data.domisili ?? "",
            bidang_pekerjaan: data.bidang_pekerjaan ?? "",
            tempat_kerja: data.tempat_kerja ?? "",
            jabatan: data.jabatan ?? "",
            no_hp: data.no_hp ?? "",
            pendidikan_terakhir: data.pendidikan_terakhir ?? "",
            institusi: data.institusi ?? "",
          });
        }
        setLoading(false);
      });
  }, [user]);

  async function handleSave() {
    if (!user || !alumni || alumni === "not-linked") return;
    setSaving(true);
    setSaveMsg(null);
    const { error } = await createClient()
      .from("alumni")
      .update({
        nama: form.nama || undefined,
        domisili: form.domisili || undefined,
        bidang_pekerjaan: form.bidang_pekerjaan || undefined,
        tempat_kerja: form.tempat_kerja || undefined,
        jabatan: form.jabatan || undefined,
        no_hp: form.no_hp || undefined,
        pendidikan_terakhir: form.pendidikan_terakhir || undefined,
        institusi: form.institusi || undefined,
      })
      .eq("auth_user_id", user.id);
    setSaving(false);
    if (error) {
      setSaveMsg("Gagal menyimpan. Coba lagi.");
    } else {
      setAlumni((prev) => prev && prev !== "not-linked" ? { ...prev, ...form } : prev);
      setEditing(false);
      setSaveMsg("Data berhasil disimpan.");
      setTimeout(() => setSaveMsg(null), 3000);
    }
  }

  if (!user) return null;

  const displayName = (alumni && alumni !== "not-linked" && alumni.nama)
    ? alumni.nama
    : (user.user_metadata?.full_name ?? user.email ?? "Alumni");

  return (
    <main className="px-6 py-12 max-w-3xl mx-auto">
      {/* Profile header */}
      <div className="flex gap-5 items-center mb-10">
        {user.user_metadata?.avatar_url ? (
          <img src={user.user_metadata.avatar_url} alt={displayName} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <AvatarPlaceholder name={displayName} size={80} />
        )}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{displayName}</h1>
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

      {saveMsg && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${saveMsg.includes("Gagal") ? "bg-red-900/30 text-red-300" : "bg-green-900/30 text-green-300"}`}>
          {saveMsg}
        </div>
      )}

      {/* Alumni data */}
      {loading ? (
        <div className="glass-card rounded-2xl h-24 animate-pulse mb-6" />
      ) : alumni === "not-linked" ? (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="font-semibold text-white mb-2">Akun belum terhubung ke data alumni</div>
          <p className="text-sm text-slate-400 mb-4">
            Email kamu belum terdaftar di database IKASI. Hubungi pengurus untuk verifikasi.
          </p>
          <a href="mailto:ikasioffice@gmail.com?subject=Verifikasi Alumni IKASI"
            className="btn-gold px-5 py-2 rounded-full text-xs inline-block">
            Hubungi Pengurus
          </a>
        </div>
      ) : alumni ? (
        <section className="mb-6 pb-6 border-b border-white/[0.06]">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs text-slate-500 uppercase tracking-widest">Data Alumni</div>
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="text-xs text-[#d4a72c] hover:underline">
                Edit Data
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => { setEditing(false); setSaveMsg(null); }}
                  className="text-xs text-slate-400 hover:text-white">
                  Batal
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="text-xs btn-gold px-4 py-1.5 rounded-full disabled:opacity-50">
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ["nama", "Nama Lengkap"],
                ["domisili", "Domisili"],
                ["bidang_pekerjaan", "Bidang Pekerjaan"],
                ["tempat_kerja", "Tempat Kerja"],
                ["jabatan", "Jabatan"],
                ["no_hp", "No. HP (private)"],
                ["pendidikan_terakhir", "Pendidikan Terakhir"],
                ["institusi", "Institusi Pendidikan"],
              ] as [keyof EditForm, string][]).map(([key, label]) => (
                <div key={key} className={key === "nama" ? "sm:col-span-2" : ""}>
                  <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4a72c]/50"
                    placeholder={label}
                  />
                </div>
              ))}
              <div className="sm:col-span-2 text-xs text-slate-500">
                Angkatan dan Program Studi tidak bisa diubah sendiri — hubungi pengurus jika ada kesalahan.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-400 text-xs mb-1">Nama Lengkap</div>
                <div className="font-medium">{alumni.nama ?? "—"}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">Angkatan</div>
                <div className="text-[#d4a72c] font-semibold">{alumni.angkatan ?? "—"}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">Program Studi</div>
                <div>{alumni.prodi ?? "—"}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">Domisili</div>
                <div>{alumni.domisili ?? "—"}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">Bidang Pekerjaan</div>
                <div>{alumni.bidang_pekerjaan ?? "—"}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">Tempat Kerja</div>
                <div>{alumni.tempat_kerja ?? "—"}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">Jabatan</div>
                <div>{alumni.jabatan ?? "—"}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs mb-1">Pendidikan Terakhir</div>
                <div>{alumni.pendidikan_terakhir ?? "—"}</div>
              </div>
            </div>
          )}
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

      <button onClick={signOut} className="mt-10 text-sm text-slate-500 hover:text-red-400 transition-colors">
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
