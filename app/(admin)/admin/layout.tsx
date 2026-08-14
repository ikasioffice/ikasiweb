"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/auth/admin-guard";
import { useAuth } from "@/lib/auth/use-auth";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/alumni", label: "Verifikasi Alumni" },
  { href: "/admin/alumni/duplicates", label: "Duplikat Alumni" },
  { href: "/admin/alumni/deletions", label: "Riwayat Hapus" },
  { href: "/admin/news", label: "Berita" },
  { href: "/admin/events", label: "Acara" },
  { href: "/admin/wa-groups", label: "Grup WhatsApp" },
  { href: "/admin/beasiswa", label: "Beasiswa Alumni" },
];

function AdminNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-white/[0.06] min-h-screen p-6">
      <Link href="/admin" className="font-heading text-[#d4a72c] font-extrabold text-lg block mb-8">
        IKASI Admin
      </Link>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === item.href
                ? "bg-[#d4a72c]/10 text-[#d4a72c] font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 pt-8 border-t border-white/[0.06]">
        <Link href="/" className="block text-xs text-slate-500 hover:text-slate-300 mb-2">
          ← Kembali ke Site
        </Link>
        <button
          onClick={signOut}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminNav />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}
