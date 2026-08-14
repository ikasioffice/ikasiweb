import type { Metadata } from "next";
import Link from "next/link";
import { IsiBeasiswa } from "./_sections";

export const metadata: Metadata = {
  title: "Beasiswa Alumni IKASI 2026",
  description:
    "Program Beasiswa Alumni IKASI untuk meringankan tunggakan UKT mahasiswa Teknik Sipil Polban. Terbuka bagi alumni, perusahaan, dan donatur.",
};

export default function BeasiswaPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Beranda
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Beasiswa Alumni</span>
      </nav>
      <IsiBeasiswa />
    </main>
  );
}
