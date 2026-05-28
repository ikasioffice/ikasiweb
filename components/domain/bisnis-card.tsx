"use client";

import Link from "next/link";
import type { Bisnis } from "@/lib/data/bisnis";

export function BisnisCard({ bisnis }: { bisnis: Bisnis }) {
  return (
    <Link
      href={`/bisnis/${bisnis.id}`}
      className="glass-card rounded-2xl p-5 flex gap-4 hover:border-[#d4a72c]/40 transition-colors"
    >
      {bisnis.poster_url ? (
        <img
          src={bisnis.poster_url}
          alt={bisnis.nama_brand ?? "Bisnis"}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-[#142340] flex items-center justify-center flex-shrink-0 text-2xl">
          🏪
        </div>
      )}
      <div className="min-w-0">
        <div className="font-semibold text-white truncate">
          {bisnis.nama_brand ?? "—"}
        </div>
        {bisnis.bidang && (
          <div className="text-xs text-[#d4a72c] mt-0.5">{bisnis.bidang}</div>
        )}
        {bisnis.lokasi && (
          <div className="text-xs text-slate-400 mt-1 truncate">{bisnis.lokasi}</div>
        )}
        {bisnis.detail && (
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">{bisnis.detail}</p>
        )}
      </div>
    </Link>
  );
}
