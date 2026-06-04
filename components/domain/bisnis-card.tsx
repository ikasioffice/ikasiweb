import { Card } from "@/components/ui/card";
import { LineIcon } from "@/components/ui/icons";
import { displayOrDash } from "@/lib/format";
import type { Bisnis } from "@/lib/data/bisnis";

export function BisnisCard({ bisnis }: { bisnis: Bisnis }) {
  const nama = bisnis.nama_brand || "Bisnis Alumni";
  const bidang = displayOrDash(bisnis.bidang);
  const lokasi = displayOrDash(bisnis.lokasi);
  const detail = displayOrDash(bisnis.detail);

  return (
    <Card href={`/bisnis/${bisnis.id}`} className="flex items-start gap-4 p-5">
      {bisnis.poster_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bisnis.poster_url}
          alt={nama}
          className="h-14 w-14 shrink-0 rounded-lg object-cover"
          style={{ width: 56, height: 56 }}
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <LineIcon name="store" size={24} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-heading font-bold text-foreground">{nama}</div>
        {bidang && <div className="text-sm text-muted-foreground">{bidang}</div>}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {lokasi && (
            <span className="inline-flex items-center gap-1">
              <LineIcon name="pin" size={12} /> {lokasi}
            </span>
          )}
        </div>
        {detail && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{detail}</p>}
      </div>
      <svg className="h-4 w-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10M7 17 17 7" /></svg>
    </Card>
  );
}
