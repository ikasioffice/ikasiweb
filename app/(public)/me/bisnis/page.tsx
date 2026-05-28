"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { AuthGuard } from "@/components/auth/auth-guard";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import Link from "next/link";

type Bisnis = Database["public"]["Tables"]["bisnis"]["Row"];
type BisnisInsert = Database["public"]["Tables"]["bisnis"]["Insert"];

const EMPTY: Partial<BisnisInsert> = {
  nama_brand: "",
  bidang: "",
  lokasi: "",
  detail: "",
  no_kontak: "",
  link_medsos: "",
};

function MeBisnisContent() {
  const { user } = useAuth();
  const [list, setList] = useState<Bisnis[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<BisnisInsert>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [alumniId, setAlumniId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!user) return;
    // Get alumni_id for current user
    supabase
      .from("alumni")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setAlumniId(data?.id ?? null);
        if (data?.id) {
          supabase
            .from("bisnis")
            .select("*")
            .eq("alumni_id", data.id)
            .order("created_at", { ascending: false })
            .then(({ data: items }) => {
              setList(items ?? []);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleSave() {
    if (!alumniId) return;
    setSaving(true);
    if (editing) {
      await supabase.from("bisnis").update({ ...form }).eq("id", editing);
      setList((prev) => prev.map((b) => (b.id === editing ? { ...b, ...form } as Bisnis : b)));
    } else {
      const { data } = await supabase
        .from("bisnis")
        .insert({ ...form, alumni_id: alumniId })
        .select()
        .single();
      if (data) setList((prev) => [data, ...prev]);
    }
    setForm(EMPTY);
    setEditing(null);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await supabase.from("bisnis").delete().eq("id", id);
    setList((prev) => prev.filter((b) => b.id !== id));
  }

  function startEdit(b: Bisnis) {
    setEditing(b.id);
    setForm({
      nama_brand: b.nama_brand ?? "",
      bidang: b.bidang ?? "",
      lokasi: b.lokasi ?? "",
      detail: b.detail ?? "",
      no_kontak: b.no_kontak ?? "",
      link_medsos: b.link_medsos ?? "",
    });
  }

  if (!alumniId && !loading) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-slate-400 text-sm mb-4">
          Akun belum terhubung ke data alumni. Bisnis hanya bisa didaftarkan setelah verifikasi.
        </p>
        <Link href="/me" className="btn-gold px-5 py-2 rounded-full text-xs">
          Kembali ke Profil
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Form */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-white mb-4">
          {editing ? "Edit Bisnis" : "Tambah Bisnis Baru"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["nama_brand", "bidang", "lokasi", "no_kontak", "link_medsos"] as const).map((field) => (
            <input
              key={field}
              placeholder={{
                nama_brand: "Nama brand / usaha",
                bidang: "Bidang (misal: Kontraktor, Kuliner)",
                lokasi: "Lokasi / kota",
                no_kontak: "Nomor kontak / WhatsApp",
                link_medsos: "Link Instagram / website",
              }[field]}
              value={(form[field] as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d4a72c]/50"
            />
          ))}
          <textarea
            placeholder="Deskripsi singkat bisnis"
            value={(form.detail as string) ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, detail: e.target.value }))}
            rows={3}
            className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d4a72c]/50 resize-none"
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving || !form.nama_brand}
            className="btn-gold px-6 py-2 rounded-full text-sm disabled:opacity-50"
          >
            {saving ? "Menyimpan…" : editing ? "Simpan Perubahan" : "Tambahkan"}
          </button>
          {editing && (
            <button
              onClick={() => { setEditing(null); setForm(EMPTY); }}
              className="px-6 py-2 rounded-full text-sm border border-white/20 text-slate-300 hover:border-white/40"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid gap-3">
          {[1, 2].map((i) => <div key={i} className="glass-card rounded-2xl h-20 animate-pulse" />)}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center text-slate-500 py-10">Belum ada bisnis yang didaftarkan.</div>
      ) : (
        <div className="grid gap-3">
          {list.map((b) => (
            <div key={b.id} className="glass-card rounded-2xl p-5 flex justify-between items-start gap-4">
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">{b.nama_brand}</div>
                {b.bidang && <div className="text-xs text-[#d4a72c]">{b.bidang}</div>}
                {b.lokasi && <div className="text-xs text-slate-400">{b.lokasi}</div>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(b)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:border-[#d4a72c]/50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:border-red-500/60 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function MeBisnisPage() {
  return (
    <AuthGuard>
      <main className="px-6 py-12 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/me" className="text-slate-400 hover:text-white text-sm">← Profil</Link>
          <h1 className="text-2xl font-extrabold tracking-tight">Bisnis Saya</h1>
        </div>
        <MeBisnisContent />
      </main>
    </AuthGuard>
  );
}
