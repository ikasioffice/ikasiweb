import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx di folder ini adalah client component sehingga tidak bisa meng-export
// metadata sendiri; layout ini yang memberinya judul & deskripsi khusus.
export const metadata: Metadata = {
  title: "Kirim Bukti Dukungan — Beasiswa Alumni IKASI",
  description:
    "Sudah berdonasi untuk Program Beasiswa Alumni IKASI? Kirim bukti transfer Anda di sini agar dukungan diverifikasi dan tercatat.",
};

export default function DukungLayout({ children }: { children: ReactNode }) {
  return children;
}
