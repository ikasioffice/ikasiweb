import Link from "next/link";
import Image from "next/image";
import { AvatarPlaceholder } from "./avatar-placeholder";
import type { AlumniPublic } from "@/lib/data/alumni";

export function AlumniCard({ alumni, isVerified }: { alumni: AlumniPublic; isVerified?: boolean }) {
  return (
    <Link
      href={`/alumni/${alumni.id}`}
      className="glass-card rounded-2xl p-6 block relative overflow-hidden hover:border-[#d4a72c]/30 transition-colors"
    >
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,167,44,0.12), transparent 70%)" }}
      />
      {alumni.foto_url ? (
        <Image
          src={alumni.foto_url}
          alt={alumni.nama ?? "foto"}
          width={56}
          height={56}
          className="rounded-[14px] object-cover"
          style={{ width: 56, height: 56 }}
          unoptimized
        />
      ) : (
        <AvatarPlaceholder name={alumni.nama ?? "?"} />
      )}
      <div className="mt-3 text-base font-bold tracking-tight">{alumni.nama}</div>
      <div className="text-xs text-slate-400 mb-3">
        Angkatan <span className="text-[#d4a72c] font-semibold">{alumni.angkatan}</span>
        {alumni.prodi && <> · {alumni.prodi}</>}
      </div>
      {alumni.jabatan && <div className="text-sm text-slate-200">{alumni.jabatan}</div>}
      {alumni.tempat_kerja && (
        <div className="text-xs text-slate-400 mb-3">{alumni.tempat_kerja}</div>
      )}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {alumni.bidang_pekerjaan && <Tag>{alumni.bidang_pekerjaan}</Tag>}
        {alumni.punya_ska && <Tag>SKA</Tag>}
        {alumni.domisili && <Tag muted>📍 {alumni.domisili}</Tag>}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
        <span className="text-[11px] text-slate-500">
          {isVerified ? "✓ Lihat kontak di profil" : "🔒 Login untuk kontak"}
        </span>
        <span className="bg-[#d4a72c]/10 text-[#d4a72c] px-3 py-1 rounded-lg text-xs font-semibold">
          Lihat Profil →
        </span>
      </div>
    </Link>
  );
}

function Tag({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
        muted
          ? "bg-white/[0.04] border-white/[0.08] text-slate-300"
          : "bg-[#d4a72c]/10 border-[#d4a72c]/20 text-[#d4a72c]"
      }`}
    >
      {children}
    </span>
  );
}
