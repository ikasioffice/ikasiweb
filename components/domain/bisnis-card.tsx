import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineIcon } from "@/components/ui/icons";
import { PosterThumb } from "@/components/ui/poster-thumb";
import { displayOrDash } from "@/lib/format";
import type { Bisnis } from "@/lib/data/bisnis";

export function BisnisCard({ bisnis }: { bisnis: Bisnis }) {
  const nama = bisnis.nama_brand || "Bisnis Alumni";
  const bidang = displayOrDash(bisnis.bidang);
  const lokasi = displayOrDash(bisnis.lokasi);
  const detail = displayOrDash(bisnis.detail);

  return (
    <Card href={`/bisnis/${bisnis.id}`} className="flex gap-4 p-5">
      <PosterThumb src={bisnis.poster_url} alt={nama} size={64} icon="store" />
      <div className="min-w-0">
        <div className="font-semibold text-white truncate">{nama}</div>
        {bidang && <div className="mt-1"><Badge variant="gold">{bidang}</Badge></div>}
        {lokasi && (
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1.5 truncate">
            <LineIcon name="pin" size={12} /> {lokasi}
          </div>
        )}
        {detail && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{detail}</p>}
      </div>
    </Card>
  );
}
