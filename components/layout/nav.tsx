"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/alumni", label: "Direktori" },
  { href: "/bisnis", label: "Bisnis" },
  { href: "/event", label: "Acara" },
  { href: "/news", label: "Berita" },
  { href: "/sejarah", label: "Tentang" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="px-12 py-5 flex justify-between items-center border-b border-white/[0.06]">
      <Link href="/" className="text-lg font-extrabold tracking-tight text-[#d4a72c]">
        IKASI<span className="text-white">.</span>
      </Link>
      <div className="flex gap-7 text-sm text-slate-300">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={pathname.startsWith(l.href) ? "text-[#d4a72c] font-semibold" : ""}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <Link
        href="/daftar"
        className="btn-gold px-5 py-2 rounded-full text-xs"
      >
        Bergabung — Gratis
      </Link>
    </nav>
  );
}
