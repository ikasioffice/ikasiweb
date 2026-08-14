"use client";

import { useState } from "react";
import { KeuanganTab } from "./_keuangan-tab";
import { KontenTab } from "./_konten-tab";

type Tab = "keuangan" | "konten";

export default function AdminBeasiswaPage() {
  const [tab, setTab] = useState<Tab>("keuangan");

  const tabs: { id: Tab; label: string }[] = [
    { id: "keuangan", label: "Keuangan & Donasi" },
    { id: "konten", label: "Konten Halaman" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">Beasiswa Alumni</h1>
        <p className="text-sm text-slate-400 mt-1">
          Kelola target dana, verifikasi bukti dukungan, dan teks halaman{" "}
          <a href="/beasiswa/" className="text-[#d4a72c] hover:underline">/beasiswa</a>.
        </p>
      </div>

      <div className="flex gap-2 border-b border-white/[0.06] mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? "border-[#d4a72c] text-[#d4a72c] font-semibold"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "keuangan" ? <KeuanganTab /> : <KontenTab />}
    </div>
  );
}
