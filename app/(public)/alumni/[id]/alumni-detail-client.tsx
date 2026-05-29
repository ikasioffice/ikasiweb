"use client";

import { useEffect, useState, use } from "react";
import { getAlumniById, getAlumniContact, type AlumniPublic } from "@/lib/data/alumni";
import { LoginPrompt } from "@/components/domain/login-prompt";
import { useAuth } from "@/lib/auth/use-auth";

export function AlumniDetailClient({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const [alumni, setAlumni] = useState<AlumniPublic | null>(null);
  const [contact, setContact] = useState<{ email: string | null } | null>(null);
  const auth = useAuth();

  useEffect(() => {
    if (!id) return;
    getAlumniById(id).then(setAlumni);
  }, [id]);

  useEffect(() => {
    if (!id || !auth.isVerified) return;
    getAlumniContact(id).then((c) => setContact(c ? { email: c.email } : null));
  }, [id, auth.isVerified]);

  if (!alumni) return <div className="p-12 text-slate-400">Memuat profil…</div>;

  const displayName = alumni.nama ?? "Alumni";

  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex gap-5 items-start mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
          {alumni.foto_url ? (
            <img src={alumni.foto_url} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#d4a72c]">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{displayName}</h1>
          <div className="text-sm text-slate-400 mt-1">
            Angkatan <span className="text-[#d4a72c] font-semibold">{alumni.angkatan}</span>
            {alumni.prodi && <> · {alumni.prodi}</>}
          </div>
          {alumni.nomor_anggota && (
            <div className="mt-1 text-xs font-mono text-[#d4a72c]/70">{alumni.nomor_anggota}</div>
          )}
        </div>
      </div>

      {/* Profesi */}
      {(alumni.jabatan || alumni.tempat_kerja || alumni.bidang_pekerjaan) && (
        <Section label="Profesi">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Jabatan" value={alumni.jabatan} />
            <Field label="Tempat Kerja" value={alumni.tempat_kerja} />
            <Field label="Bidang Pekerjaan" value={alumni.bidang_pekerjaan} />
          </div>
        </Section>
      )}

      {/* Info Pribadi — tanggal lahir TIDAK ditampilkan di publik (privasi) */}
      <Section label="Info Pribadi">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Domisili" value={alumni.domisili} />
        </div>
      </Section>

      {/* Keahlian */}
      <Section label="Keahlian">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="SKA/SKK" value={alumni.punya_ska ? (alumni.bidang_ska || "Ya") : "Tidak"} />
        </div>
      </Section>

      {/* Pendidikan */}
      <Section label="Pendidikan">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Jenjang" value={alumni.pendidikan_terakhir} />
          <Field label="Institusi" value={alumni.institusi} />
          <Field label="Tahun Lulus" value={alumni.tahun_lulus} />
        </div>
      </Section>

      {/* Minat / Hobi */}
      {alumni.minat_hobi?.length ? (
        <Section label="Minat / Hobi">
          <div className="flex flex-wrap gap-1.5">
            {alumni.minat_hobi.map((h) => (
              <span key={h} className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">{h}</span>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Nomor Anggota */}
      <Section label="Nomor Anggota">
        {alumni.nomor_anggota ? (
          <span className="font-mono text-[#d4a72c] font-semibold">{alumni.nomor_anggota}</span>
        ) : (
          <span className="text-sm text-amber-400/80">⚠ Harap Registrasi ke Admin untuk mendapat Kartu Anggota</span>
        )}
      </Section>

      {/* Kontak — email only, untuk verified */}
      <Section label="Kontak">
        {auth.isVerified && contact ? (
          <div className="text-sm">
            {contact.email && <div>📧 {contact.email}</div>}
          </div>
        ) : (
          <LoginPrompt message="Login sebagai alumni terverifikasi untuk melihat email." />
        )}
      </Section>

    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 pb-5 border-b border-white/[0.06]">
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">{label}</div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      <div className="text-slate-200">{value || "—"}</div>
    </div>
  );
}
