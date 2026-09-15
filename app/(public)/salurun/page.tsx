import type { Metadata } from "next";
import Link from "next/link";
import { IsiSalurun } from "./_sections";

export const metadata: Metadata = {
  title: "SALURUN 2026 — Charity Fun Run IKASI POLBAN",
  description:
    "SALURUN 2026: charity fun run 4,4K oleh IKASI POLBAN dalam rangka 44 Tahun HIMAS POLBAN. Minggu, 11 Oktober 2026 di Bandung. Dana pendaftaran disalurkan untuk beasiswa mahasiswa Teknik Sipil Polban.",
};

export default function SalurunPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Beranda
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">SALURUN 2026</span>
      </nav>
      <IsiSalurun />
    </main>
  );
}
