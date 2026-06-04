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
    <Card href={`/alumni/${alumni.id}`} className="p-5">
      <div className="flex items-start gap-3">
        {alumni.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={alumni.foto_url}
            alt={nama}
            className="h-12 w-12 shrink-0 rounded-lg object-cover"
            style={{ width: 48, height: 48 }}
          />
        ) : (
          <Avatar name={nama} size={48} />
        )}
        <div className="min-w-0">
          <div className="truncate font-semibold text-foreground">{nama}</div>
          <div className="text-xs text-muted-foreground">
            Angkatan <span className="font-semibold text-primary">{alumni.angkatan}</span>
            {prodi && <> · {prodi}</>}
          </div>
        </div>
      </div>

      {jabatan && <div className="mt-3 text-sm text-foreground">{jabatan}</div>}
      {tempatKerja && <div className="text-xs text-muted-foreground">{tempatKerja}</div>}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {bidang && <Badge variant="neutral">{bidang}</Badge>}
        {alumni.punya_ska && <Badge variant="gold">SKA</Badge>}
        {domisili && (
          <Badge variant="neutral">
            <LineIcon name="pin" size={12} /> {domisili}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className={`flex items-center gap-1 text-[11px] ${isVerified ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
          <LineIcon name={isVerified ? "check" : "lock"} size={12} />
          {isVerified ? "Lihat kontak di profil" : "Login untuk kontak"}
        </span>
        <span className="text-xs font-semibold text-primary">Lihat Profil →</span>
      </div>
    </Card>
  );
}
