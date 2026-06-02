"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { AvatarPlaceholder } from "@/components/domain/avatar-placeholder";

const links = [
  { href: "/alumni", label: "Direktori" },
  { href: "/bisnis", label: "Bisnis" },
  { href: "/event", label: "Acara" },
  { href: "/grup-wa", label: "Grup WA" },
  { href: "/news", label: "Berita" },
  { href: "/sejarah", label: "Tentang" },
];

export function Nav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const authArea = loading ? (
    <div className="w-24 h-8 rounded-full bg-white/5 animate-pulse" />
  ) : user ? (
    <Link
      href="/me"
      onClick={close}
      className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
    >
      <AvatarPlaceholder
        name={user.user_metadata?.full_name ?? user.email ?? "?"}
        size={32}
      />
      <span>{user.user_metadata?.full_name?.split(" ")[0] ?? "Profil"}</span>
    </Link>
  ) : (
    <Link href="/login" onClick={close} className="btn-gold px-5 py-2 rounded-full text-xs">
      Masuk / Daftar
    </Link>
  );

  return (
    <nav className="relative border-b border-white/[0.06] px-5 py-4 sm:px-8 sm:py-5 lg:px-12">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" onClick={close} className="flex shrink-0 items-center gap-2">
          <img src="/logo-ikasi.png" alt="IKASI" className="h-9 w-9" />
          <span className="font-heading text-lg font-extrabold tracking-tight text-[#d4a72c]">
            IKASI<span className="text-white">.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden gap-7 text-sm text-slate-300 md:flex">
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

        {/* Desktop auth */}
        <div className="hidden shrink-0 md:block">{authArea}</div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/5 md:hidden"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="mt-4 flex flex-col gap-1 border-t border-white/[0.06] pt-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className={`py-2 text-sm ${
                pathname.startsWith(l.href) ? "text-[#d4a72c] font-semibold" : "text-slate-300"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3">{authArea}</div>
        </div>
      )}
    </nav>
  );
}
