"use client";

import { useEffect, useState, use } from "react";
import { getBisnisById, type Bisnis } from "@/lib/data/bisnis";
import { PosterThumb } from "@/components/ui/poster-thumb";
import { LineIcon } from "@/components/ui/icons";

export function BisnisDetailClient({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const [bisnis, setBisnis] = useState<Bisnis | null>(null);

  useEffect(() => {
    if (!id) return;
    getBisnisById(id).then(setBisnis);
  }, [id]);

  if (!bisnis) return <div className="p-12 text-slate-300">Loading…</div>;

  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <div className="flex gap-6 mb-8">
        <PosterThumb src={bisnis.poster_url} alt={bisnis.nama_brand ?? "Bisnis"} size={96} icon="store" className="rounded-2xl" />
        <div>
          <h1 className="text-4xl font-heading font-extrabold tracking-tight">{bisnis.nama_brand}</h1>
          {bisnis.bidang && (
            <div className="text-[#d4a72c] mt-1 text-sm font-medium">{bisnis.bidang}</div>
          )}
          {bisnis.lokasi && (
            <div className="text-slate-400 mt-1 text-sm">{bisnis.lokasi}</div>
          )}
        </div>
      </div>

      {bisnis.detail && (
        <Section label="Deskripsi">
          <p className="text-sm leading-relaxed text-slate-300">{bisnis.detail}</p>
        </Section>
      )}

      {(bisnis.no_kontak || bisnis.link_medsos) && (
        <Section label="Kontak">
          <div className="space-y-2 text-sm">
            {bisnis.no_kontak && <div className="text-slate-300"><span className="inline-flex items-center gap-1.5 text-slate-300"><LineIcon name="phone" /> {bisnis.no_kontak}</span></div>}
            {bisnis.link_medsos && (
              <div>
                <a
                  href={bisnis.link_medsos}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d4a72c] hover:underline"
                >
                  <span className="inline-flex items-center gap-1.5"><LineIcon name="link" /> {bisnis.link_medsos}</span>
                </a>
              </div>
            )}
          </div>
        </Section>
      )}
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
