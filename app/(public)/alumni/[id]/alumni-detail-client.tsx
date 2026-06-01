"use client";

import { useEffect, useState, use } from "react";
import { getAlumniById, getAlumniContact, type AlumniPublic } from "@/lib/data/alumni";
import { LoginPrompt } from "@/components/domain/login-prompt";
import { useAuth } from "@/lib/auth/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { InfoField } from "@/components/ui/info-field";
import { LineIcon } from "@/components/ui/icons";
import { formatName } from "@/lib/format";

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

  const displayName = formatName(alumni.nama) || "Alumni";

  return (
    <main className="px-6 py-12 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex gap-5 items-start mb-8">
        <div className="flex-shrink-0">
          {alumni.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={alumni.foto_url} alt={displayName} className="w-20 h-20 rounded-[14px] object-cover" />
          ) : (
            <Avatar name={displayName} size={80} />
          )}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">{displayName}</h1>
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
            <InfoField label="Jabatan" value={alumni.jabatan} />
            <InfoField label="Tempat Kerja" value={alumni.tempat_kerja} />
            <InfoField label="Bidang Pekerjaan" value={alumni.bidang_pekerjaan} />
          </div>
        </Section>
      )}

      {/* Info Pribadi — tanggal lahir TIDAK ditampilkan di publik (privasi) */}
      <Section label="Info Pribadi">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoField label="Domisili" value={alumni.domisili} />
        </div>
      </Section>

      {/* Keahlian */}
      <Section label="Keahlian">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoField label="SKA/SKK" value={alumni.punya_ska ? (alumni.bidang_ska || "Ya") : "Tidak"} />
        </div>
      </Section>

      {/* Pendidikan */}
      <Section label="Pendidikan">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoField label="Jenjang" value={alumni.pendidikan_terakhir} />
          <InfoField label="Institusi" value={alumni.institusi} />
          <InfoField label="Tahun Lulus" value={alumni.tahun_lulus} />
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
          <span className="text-sm text-amber-400/80"><span className="inline-flex items-center gap-1.5"><LineIcon name="warning" /> Harap Registrasi ke Admin untuk mendapat Kartu Anggota</span></span>
        )}
      </Section>

      {/* Kontak — email only, untuk verified */}
      <Section label="Kontak">
        {auth.isVerified && contact ? (
          <div className="text-sm">
            {contact.email && <div><span className="inline-flex items-center gap-1.5"><LineIcon name="mail" /> {contact.email}</span></div>}
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

