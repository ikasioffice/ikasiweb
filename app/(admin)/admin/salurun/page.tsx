"use client";

import { SalurunTab } from "./_salurun-tab";

export default function AdminSalurunPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">SALURUN 2026</h1>
        <p className="text-sm text-slate-400 mt-1">
          Kelola pendaftar dan verifikasi bukti transfer untuk halaman{" "}
          <a href="/salurun/" className="text-[#d4a72c] hover:underline">/salurun</a>.
        </p>
      </div>

      <SalurunTab />
    </div>
  );
}
