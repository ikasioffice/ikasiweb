import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx di folder ini adalah client component sehingga tidak bisa meng-export
// metadata sendiri; layout ini yang memberinya judul & deskripsi khusus.
export const metadata: Metadata = {
  title: "Daftar — SALURUN 2026",
  description:
    "Formulir pendaftaran SALURUN 2026: isi data peserta, transfer sesuai kategori, lalu kirim bukti transfer untuk diverifikasi panitia.",
};

export default function DaftarSalurunLayout({ children }: { children: ReactNode }) {
  return children;
}
