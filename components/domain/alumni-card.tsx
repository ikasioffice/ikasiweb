import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LineIcon } from "@/components/ui/icons";
import { formatName, displayOrDash } from "@/lib/format";
import type { AlumniPublic } from "@/lib/data/alumni";

export function AlumniCard({ alumni, isVerified }: { alumni: AlumniPublic; isVerified?: boolean }) {
  const nama = formatName(alumni.nama) || "Alumni";
  const jabatan = displayOrDash(alumni.jabatan);
  const tempatKerja = displayOrDash(alumni.tempat_kerja);
  const prodi = displayOrDash(alumni.prodi);
  const bidang = displayOrDash(alumni.bidang_pekerjaan);
  const domisili = displayOrDash(alumni.domisili);

  return (
    <Card href={`/alumni/${alumni.id}`} className="overflow-hidden">
      {alumni.foto_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={alumni.foto_url}
          alt={nama}
          width={56}
          height={56}
          className="rounded-[14px] object-cover"
          style={{ width: 56, height: 56 }}
        />
      ) : (
        <Avatar name={nama} />
      )}
      <div className="mt-3 text-base font-bold tracking-tight">{nama}</div>
      <div className="text-xs text-slate-400 mb-3">
        Angkatan <span className="text-[#d4a72c] font-semibold">{alumni.angkatan}</span>
        {prodi && <> · {prodi}</>}
      </div>
      {jabatan && <div className="text-sm text-slate-200">{jabatan}</div>}
      {tempatKerja && <div className="text-xs text-slate-400 mb-3">{tempatKerja}</div>}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {bidang && <Badge variant="gold">{bidang}</Badge>}
        {alumni.punya_ska && <Badge variant="gold">SKA</Badge>}
        {domisili && (
          <Badge variant="neutral">
            <LineIcon name="pin" /> {domisili}
          </Badge>
        )}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <LineIcon name={isVerified ? "check" : "lock"} size={12} />
          {isVerified ? "Lihat kontak di profil" : "Login untuk kontak"}
        </span>
        <span className="bg-[#d4a72c]/10 text-[#d4a72c] px-3 py-1 rounded-lg text-xs font-semibold">
          Lihat Profil →
        </span>
      </div>
    </Card>
  );
}
