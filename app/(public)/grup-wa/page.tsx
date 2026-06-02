"use client";

import { useEffect, useState } from "react";
import { listWaGroups, groupByCategory, type WaGroup } from "@/lib/data/wa-groups";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

function WaCard({ group }: { group: WaGroup }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(group.wa_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia — abaikan
    }
  };

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-white text-sm leading-snug">{group.name}</h3>
        <span className="shrink-0 text-xs bg-[#25D366]/20 text-[#25D366] px-2 py-0.5 rounded-full font-medium">
          {group.member_count ?? 0} member
        </span>
      </div>
      {group.description && (
        <p className="text-xs text-slate-400 leading-relaxed">{group.description}</p>
      )}
      <div className="flex items-center gap-4 mt-1">
        <a
          href={group.wa_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:text-[#20bd5a] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
          Gabung Grup
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Tersalin
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Salin Link
            </>
          )}
        </button>
      </div>
    </Card>
  );
}

export default function GrupWaPage() {
  const [groups, setGroups] = useState<WaGroup[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listWaGroups().then((data) => {
      setGroups(data);
      setLoading(false);
    });
  }, []);

  const filtered = groups.filter((g) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      (g.description?.toLowerCase().includes(q) ?? false) ||
      g.category.toLowerCase().includes(q)
    );
  });

  const grouped = groupByCategory(filtered);

  return (
    <main className="px-6 py-12 max-w-5xl mx-auto">
      <PageHeader
        title={<>Grup <span className="gradient-text">WhatsApp</span> IKASI</>}
        subtitle="Kumpulan grup WhatsApp resmi IKASI — silaturahmi, info lowongan, diskusi bidang, dan lainnya"
        className="mb-8"
      />

      <input
        type="search"
        placeholder="Cari grup, kategori, atau deskripsi…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-10 min-h-11 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4a72c]/50"
      />

      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-5 w-40 bg-white/5 rounded mb-4 animate-pulse" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((j) => (
                  <div key={j} className="glass-card rounded-2xl h-32 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Belum ada grup ditemukan"
          description="Coba ubah kata kunci pencarian."
        />
      ) : (
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-lg font-bold text-[#d4a72c] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#d4a72c] rounded-full inline-block" />
                {category}
                <span className="text-xs text-slate-500 font-normal ml-1">
                  ({items.length} grup)
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((g) => (
                  <WaCard key={g.id} group={g} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
