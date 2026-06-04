"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getAlumniById, getAlumniContact, type AlumniPublic } from "@/lib/data/alumni";
import { useAuth } from "@/lib/auth/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

  if (!alumni) return <div className="mx-auto max-w-4xl px-4 py-16 text-muted-foreground sm:px-6">Memuat profil…</div>;

  const displayName = formatName(alumni.nama) || "Alumni";

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <Link href="/alumni" className="hover:text-foreground">Direktori</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{displayName}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header card */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="relative h-24 bg-gradient-to-r from-primary/20 to-primary/5">
              <div className="bp-grid absolute inset-0" />
            </div>
            <div className="px-6 pb-6">
              <div className="-mt-10 flex items-end gap-4">
                <div className="rounded-xl border-4 border-card">
                  {alumni.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={alumni.foto_url} alt={displayName} className="h-20 w-20 rounded-lg object-cover" style={{ width: 80, height: 80 }} />
                  ) : (
                    <Avatar name={displayName} size={80} />
                  )}
                </div>
                {auth.isVerified && (
                  <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <LineIcon name="check" size={14} /> Terverifikasi
                  </span>
                )}
              </div>
              <h1 className="font-heading mt-4 text-2xl font-extrabold tracking-tight">{displayName}</h1>
              <p className="mt-1 text-muted-foreground">
                {[alumni.jabatan, alumni.tempat_kerja].filter(Boolean).join(" · ") || "Alumni Teknik Sipil Polban"}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge variant="neutral">Angkatan {alumni.angkatan}</Badge>
                {alumni.prodi && <Badge variant="neutral">{alumni.prodi}</Badge>}
                {alumni.punya_ska && <Badge variant="gold">SKA{alumni.bidang_ska ? ` · ${alumni.bidang_ska}` : ""}</Badge>}
                {alumni.domisili && (
                  <Badge variant="neutral"><LineIcon name="pin" size={12} /> {alumni.domisili}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Profesi */}
          {(alumni.jabatan || alumni.tempat_kerja || alumni.bidang_pekerjaan) && (
            <Card label="Profesi">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <InfoField label="Jabatan" value={alumni.jabatan} />
                <InfoField label="Tempat Kerja" value={alumni.tempat_kerja} />
                <InfoField label="Bidang Pekerjaan" value={alumni.bidang_pekerjaan} />
              </dl>
            </Card>
          )}

          {/* Pendidikan */}
          <Card label="Pendidikan">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <InfoField label="Jenjang" value={alumni.pendidikan_terakhir} />
              <InfoField label="Institusi" value={alumni.institusi} />
              <InfoField label="Tahun Lulus" value={alumni.tahun_lulus} />
              <InfoField label="Domisili" value={alumni.domisili} />
            </dl>
          </Card>

          {/* Minat / Hobi */}
          {alumni.minat_hobi?.length ? (
            <Card label="Minat / Hobi">
              <div className="flex flex-wrap gap-1.5">
                {alumni.minat_hobi.map((h) => (
                  <Badge key={h} variant="neutral">{h}</Badge>
                ))}
              </div>
            </Card>
          ) : null}
        </div>

        {/* Right: contact + member no */}
        <div className="space-y-6">
          <Card label="Kontak">
            {auth.isVerified && contact ? (
              <div className="space-y-3">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium transition-colors hover:bg-accent">
                    <LineIcon name="mail" size={16} className="text-primary" /> {contact.email}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Kontak belum diisi oleh alumni ini.</p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-5 text-center">
                <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
                  <LineIcon name="lock" size={20} />
                </div>
                <p className="text-sm font-medium">Kontak terkunci</p>
                <p className="mt-1 text-xs text-muted-foreground">Masuk &amp; verifikasi sebagai alumni untuk melihat email.</p>
                <Link href="/login" className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  Masuk untuk lihat
                </Link>
              </div>
            )}
          </Card>

          <Card label="Nomor Anggota">
            {alumni.nomor_anggota ? (
              <span className="font-mono font-semibold text-primary">{alumni.nomor_anggota}</span>
            ) : (
              <span className="flex items-start gap-1.5 text-sm text-amber-600 dark:text-amber-400">
                <LineIcon name="warning" size={16} /> Harap registrasi ke admin untuk mendapat Kartu Anggota.
              </span>
            )}
          </Card>

          <Link href="/alumni" className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Kembali ke direktori
          </Link>
        </div>
      </div>
    </main>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-heading mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">{label}</h2>
      {children}
    </section>
  );
}
