"use client";

import { useEffect, useState, use } from "react";
import { getAlumniById, getAlumniContact, type AlumniPublic } from "@/lib/data/alumni";
import { AvatarPlaceholder } from "@/components/domain/avatar-placeholder";
import { LoginPrompt } from "@/components/domain/login-prompt";
import { useAuth } from "@/lib/auth/use-auth";

export function AlumniDetailClient({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const [alumni, setAlumni] = useState<AlumniPublic | null>(null);
  const [contact, setContact] = useState<{ email: string | null; no_hp: string | null } | null>(null);
  const auth = useAuth();

  useEffect(() => {
    if (!id) return;
    getAlumniById(id).then(setAlumni);
  }, [id]);

  useEffect(() => {
    if (!id || !auth.isVerified) return;
    getAlumniContact(id).then(setContact);
  }, [id, auth.isVerified]);

  if (!alumni) return <div className="p-12 text-slate-300">Loading…</div>;

  return (
    <main className="px-12 py-16 max-w-4xl mx-auto">
      <div className="flex gap-6 mb-8">
        <AvatarPlaceholder name={alumni.nama ?? "?"} size={96} />
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{alumni.nama}</h1>
          <div className="text-slate-400 mt-2">
            Angkatan <span className="text-[#d4a72c]">{alumni.angkatan}</span> · {alumni.prodi}
          </div>
        </div>
      </div>

      <Section label="Profesi">
        <div className="text-base">{alumni.jabatan}</div>
        <div className="text-sm text-slate-400">{alumni.tempat_kerja}</div>
        {alumni.bidang_pekerjaan && (
          <div className="text-xs text-slate-400 mt-2">Bidang: {alumni.bidang_pekerjaan}</div>
        )}
      </Section>

      <Section label="Domisili">{alumni.domisili}</Section>

      {alumni.punya_ska && (
        <Section label="Sertifikat Keahlian">
          SKA: {alumni.bidang_ska}
        </Section>
      )}

      <Section label="Kontak">
        {auth.isVerified && contact ? (
          <div className="text-sm space-y-1">
            {contact.email && <div>📧 {contact.email}</div>}
            {contact.no_hp && <div>📱 {contact.no_hp}</div>}
          </div>
        ) : (
          <LoginPrompt message="Login + verifikasi alumni — gratis, untuk lihat kontak." />
        )}
      </Section>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 pb-6 border-b border-white/[0.06]">
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">{label}</div>
      {children}
    </section>
  );
}
