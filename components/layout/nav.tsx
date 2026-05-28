"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/use-auth";
import { AvatarPlaceholder } from "@/components/domain/avatar-placeholder";

const links = [
  { href: "/alumni", label: "Direktori" },
  { href: "/bisnis", label: "Bisnis" },
  { href: "/event", label: "Acara" },
  { href: "/news", label: "Berita" },
  { href: "/sejarah", label: "Tentang" },
];

export function Nav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

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
      {loading ? (
        <div className="w-24 h-8 rounded-full bg-white/5 animate-pulse" />
      ) : user ? (
        <Link href="/me" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
          <AvatarPlaceholder
            name={user.user_metadata?.full_name ?? user.email ?? "?"}
            size={32}
          />
          <span className="hidden sm:inline">
            {user.user_metadata?.full_name?.split(" ")[0] ?? "Profil"}
          </span>
        </Link>
      ) : (
        <Link href="/login" className="btn-gold px-5 py-2 rounded-full text-xs">
          Masuk / Daftar
        </Link>
      )}
    </nav>
  );
}
