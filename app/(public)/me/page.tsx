"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { AuthGuard } from "@/components/auth/auth-guard";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import Link from "next/link";

type AlumniRow = Database["public"]["Tables"]["alumni"]["Row"];

type EditForm = {
  nama: string;
  tanggal_lahir: string;
  domisili: string;
  bidang_pekerjaan: string;
  tempat_kerja: string;
  jabatan: string;
  no_hp: string;
  punya_ska: boolean;
  bidang_ska: string;
  pendidikan_terakhir: string;
  institusi: string;
  tahun_lulus: string;
  minat_hobi: string;
};

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      <div className="text-sm text-slate-200">{value || "—"}</div>
    </div>
  );
}

function MeContent() {
  const { user, isVerified, isAdmin, signOut } = useAuth();
  const [alumni, setAlumni] = useState<AlumniRow | null | "not-linked">(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<EditForm>({
    nama: "", tanggal_lahir: "", domisili: "", bidang_pekerjaan: "",
    tempat_kerja: "", jabatan: "", no_hp: "", punya_ska: false,
    bidang_ska: "", pendidikan_terakhir: "", institusi: "",
    tahun_lulus: "", minat_hobi: "",
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
          setPhotoUrl(data.foto_url);
          setForm({
            nama: data.nama ?? "",
            tanggal_lahir: data.tanggal_lahir ?? "",
            domisili: data.domisili ?? "",
            bidang_pekerjaan: data.bidang_pekerjaan ?? "",
            tempat_kerja: data.tempat_kerja ?? "",
            jabatan: data.jabatan ?? "",
            no_hp: data.no_hp ?? "",
            punya_ska: data.punya_ska ?? false,
            bidang_ska: data.bidang_ska ?? "",
            pendidikan_terakhir: data.pendidikan_terakhir ?? "",
            institusi: data.institusi ?? "",
            tahun_lulus: data.tahun_lulus?.toString() ?? "",
            minat_hobi: (data.minat_hobi ?? []).join(", "),
          });
        }
        setLoading(false);
      });
  }, [user]);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingPhoto(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage
      .from("alumni-photos")
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage
        .from("alumni-photos")
        .getPublicUrl(path);
      await supabase.from("alumni").update({ foto_url: publicUrl }).eq("auth_user_id", user.id);
      setPhotoUrl(publicUrl + "?t=" + Date.now());
    }
    setUploadingPhoto(false);
  }

  async function handleSave() {
    if (!user || !alumni || alumni === "not-linked") return;
    setSaving(true);
    setSaveMsg(null);
    const minatArr = form.minat_hobi
      ? form.minat_hobi.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const { error } = await createClient()
      .from("alumni")
      .update({
        nama: form.nama || undefined,
        tanggal_lahir: form.tanggal_lahir || undefined,
        domisili: form.domisili || undefined,
        bidang_pekerjaan: form.bidang_pekerjaan || undefined,
        tempat_kerja: form.tempat_kerja || undefined,
        jabatan: form.jabatan || undefined,
        no_hp: form.no_hp || undefined,
        punya_ska: form.punya_ska,
        bidang_ska: form.bidang_ska || undefined,
        pendidikan_terakhir: form.pendidikan_terakhir || undefined,
        institusi: form.institusi || undefined,
        tahun_lulus: form.tahun_lulus ? parseInt(form.tahun_lulus) : undefined,
        minat_hobi: minatArr.length ? minatArr : undefined,
      })
      .eq("auth_user_id", user.id);
    setSaving(false);
    if (error) {
      setSaveMsg("Gagal menyimpan. Coba lagi.");
    } else {
      setEditing(false);
      setSaveMsg("Data berhasil disimpan.");
      setTimeout(() => setSaveMsg(null), 3000);
    }
  }

  if (!user) return null;
  const a = alumni && alumni !== "not-linked" ? alumni : null;
  const displayName = a?.nama || user.user_metadata?.full_name || user.email || "Alumni";

  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">

      {/* Header: foto + nama */}
      <div className="flex gap-5 items-start mb-8">
        <div className="relative flex-shrink-0">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden bg-white/10 hover:bg-white/20 transition-colors group"
            title="Ganti foto"
          >
            {photoUrl ? (
              <img src={photoUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#d4a72c]">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-xs">{uploadingPhoto ? "..." : "Ubah"}</span>
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{displayName}</h1>
          <div className="text-sm text-slate-400 mt-0.5">{user.email}</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {isVerified && <span className="px-2 py-0.5 rounded-full bg-[#d4a72c]/20 text-[#d4a72c] text-xs font-semibold">Alumni Terverifikasi</span>}
            {isAdmin && <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">Admin</span>}
          </div>
        </div>
      </div>

      {saveMsg && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${saveMsg.includes("Gagal") ? "bg-red-900/30 text-red-300" : "bg-green-900/30 text-green-300"}`}>
          {saveMsg}
        </div>
      )}

      {loading ? (
        <div className="glass-card rounded-2xl h-32 animate-pulse" />
      ) : alumni === "not-linked" ? (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="font-semibold mb-2">Akun belum terhubung ke data alumni</div>
          <p className="text-sm text-slate-400 mb-4">Email kamu belum terdaftar di database IKASI.</p>
          <a href="mailto:ikasioffice@gmail.com?subject=Verifikasi Alumni IKASI" className="btn-gold px-5 py-2 rounded-full text-xs inline-block">Hubungi Pengurus</a>
        </div>
      ) : a ? (
        <>
          {/* Nomor Anggota */}
          <section className="glass-card rounded-2xl p-5 mb-4">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Nomor Anggota</div>
            {a.nomor_anggota ? (
              <div className="text-xl font-mono font-bold text-[#d4a72c]">{a.nomor_anggota}</div>
            ) : (
              <div className="text-sm text-amber-400/80">
                ⚠ Harap Registrasi ke Admin untuk mendapat Kartu Anggota
                <a href="mailto:ikasioffice@gmail.com?subject=Permohonan Kartu Anggota IKASI" className="ml-2 underline text-[#d4a72c]">Hubungi Admin</a>
              </div>
            )}
          </section>

          {/* Data Diri */}
          <section className="glass-card rounded-2xl p-5 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs text-slate-500 uppercase tracking-widest">Data Diri</div>
              {!editing
                ? <button onClick={() => setEditing(true)} className="text-xs text-[#d4a72c] hover:underline">Edit Data</button>
                : <div className="flex gap-3">
                    <button onClick={() => { setEditing(false); setSaveMsg(null); }} className="text-xs text-slate-400 hover:text-white">Batal</button>
                    <button onClick={handleSave} disabled={saving} className="text-xs btn-gold px-4 py-1.5 rounded-full disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan"}</button>
                  </div>
              }
            </div>

            {editing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  ["nama", "Nama Lengkap", "text", true],
                  ["tanggal_lahir", "Tanggal Lahir", "date", false],
                  ["domisili", "Domisili", "text", false],
                  ["bidang_pekerjaan", "Bidang Pekerjaan", "text", false],
                  ["tempat_kerja", "Tempat Kerja / Perusahaan", "text", false],
                  ["jabatan", "Jabatan", "text", false],
                  ["no_hp", "No. HP (hanya kamu yang lihat)", "tel", false],
                  ["pendidikan_terakhir", "Pendidikan Terakhir", "text", false],
                  ["institusi", "Institusi Pendidikan", "text", false],
                  ["tahun_lulus", "Tahun Lulus", "number", false],
                  ["minat_hobi", "Minat / Hobi (pisah koma)", "text", false],
                ] as [keyof EditForm, string, string, boolean][]).map(([key, label, type, full]) => (
                  <div key={key} className={full ? "sm:col-span-2" : ""}>
                    <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                    <input type={type} value={form[key] as string}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4a72c]/50"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2 flex items-center gap-3">
                  <label className="text-xs text-slate-400">Punya SKA/SKK</label>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, punya_ska: !f.punya_ska }))}
                    className={`w-10 h-5 rounded-full transition-colors ${form.punya_ska ? "bg-[#d4a72c]" : "bg-white/10"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white mx-0.5 transition-transform ${form.punya_ska ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                {form.punya_ska && (
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 mb-1 block">Bidang SKA</label>
                    <input type="text" value={form.bidang_ska}
                      onChange={(e) => setForm((f) => ({ ...f, bidang_ska: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4a72c]/50"
                    />
                  </div>
                )}
                <div className="sm:col-span-2 text-xs text-slate-500">Angkatan, Prodi, dan Nomor Anggota tidak bisa diubah sendiri.</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nama Lengkap" value={a.nama} />
                <Field label="Angkatan" value={a.angkatan} />
                <Field label="Program Studi" value={a.prodi} />
                <Field label="Tanggal Lahir" value={a.tanggal_lahir} />
                <Field label="Domisili" value={a.domisili} />
                <Field label="Bidang Pekerjaan" value={a.bidang_pekerjaan} />
                <Field label="Tempat Kerja" value={a.tempat_kerja} />
                <Field label="Jabatan" value={a.jabatan} />
                <Field label="Pendidikan Terakhir" value={a.pendidikan_terakhir} />
                <Field label="Institusi" value={a.institusi} />
                <Field label="Tahun Lulus" value={a.tahun_lulus} />
                <Field label="SKA/SKK" value={a.punya_ska ? (a.bidang_ska || "Ya") : "Tidak"} />
                {a.minat_hobi?.length ? (
                  <div className="col-span-2">
                    <div className="text-xs text-slate-500 mb-1">Minat / Hobi</div>
                    <div className="flex flex-wrap gap-1.5">
                      {a.minat_hobi.map((h) => <span key={h} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">{h}</span>)}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>

          {/* Kontak pribadi */}
          <section className="glass-card rounded-2xl p-5 mb-4">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Kontak <span className="normal-case">(hanya kamu yang lihat)</span></div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" value={a.email} />
              <Field label="No. HP" value={a.no_hp} />
            </div>
          </section>
        </>
      ) : null}

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2 mt-2">
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

      <button onClick={signOut} className="mt-8 text-sm text-slate-500 hover:text-red-400 transition-colors">
        Keluar dari akun
      </button>
    </main>
  );
}

export default function MePage() {
  return <AuthGuard><MeContent /></AuthGuard>;
}
