import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx di folder ini adalah client component sehingga tidak bisa meng-export
// metadata sendiri; layout ini yang memberinya judul & deskripsi khusus.
export const metadata: Metadata = {
  title: "Donasi — Beasiswa Alumni IKASI",
  description:
    "Dukung Program Beasiswa Alumni IKASI: isi data donatur, ikuti panduan transfer ke rekening resmi atau QRIS, lalu kirim bukti transfer untuk diverifikasi.",
};

export default function DukungLayout({ children }: { children: ReactNode }) {
  return children;
}
