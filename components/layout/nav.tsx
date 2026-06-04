"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { AvatarPlaceholder } from "@/components/domain/avatar-placeholder";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
    <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
  ) : user ? (
    <Link
      href="/me"
      onClick={close}
      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
    >
      <AvatarPlaceholder
        name={user.user_metadata?.full_name ?? user.email ?? "?"}
        size={28}
      />
      <span>{user.user_metadata?.full_name?.split(" ")[0] ?? "Profil"}</span>
    </Link>
  ) : (
    <Link
      href="/login"
      onClick={close}
      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
    >
      Masuk / Daftar
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" onClick={close} className="flex shrink-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-ikasi.png" alt="IKASI" className="h-9 w-9 rounded-md object-contain" />
          <span className="font-heading text-lg font-extrabold tracking-tight">
            IKASI<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? "rounded-md px-3 py-2 text-sm font-medium text-primary"
                    : "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden shrink-0 md:block">{authArea}</div>
          <button
            type="button"
            aria-label="Buka menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent md:hidden"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className={
                    active
                      ? "rounded-md bg-accent px-3 py-2.5 text-sm font-semibold text-primary"
                      : "rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
                  }
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="pt-2">{authArea}</div>
          </div>
        </div>
      )}
    </header>
  );
}
