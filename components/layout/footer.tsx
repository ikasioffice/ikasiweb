import Link from "next/link";

const cols: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: "Jelajahi",
    links: [
      { href: "/alumni", label: "Direktori Alumni" },
      { href: "/angkatan", label: "Per Angkatan" },
      { href: "/bisnis", label: "Bisnis Alumni" },
      { href: "/event", label: "Acara" },
      { href: "/news", label: "Berita" },
      { href: "/grup-wa", label: "Grup WhatsApp" },
      { href: "/beasiswa", label: "Beasiswa Alumni" },
    ],
  },
  {
    title: "Organisasi",
    links: [
      { href: "/sejarah", label: "Tentang IKASI" },
      { href: "/pengurus", label: "Pengurus" },
      { href: "/ad-art", label: "AD/ART" },
      { href: "/cara-bergabung", label: "Cara Bergabung" },
    ],
  },
  {
    title: "Kontak",
    links: [
      { href: "https://wa.me/6281234681730", label: "WA: +62 812-3468-1730", external: true },
      { href: "mailto:ikasioffice@gmail.com", label: "ikasioffice@gmail.com", external: true },
      { href: "https://instagram.com/ikasi.poliitb.polban", label: "@ikasi.poliitb.polban", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-ikasi.png" alt="IKASI" className="h-9 w-9 rounded-md object-contain" />
              <div>
                <div className="font-heading text-sm font-extrabold">
                  IKASI<span className="text-primary">.</span>
                </div>
                <div className="text-xs text-muted-foreground">Ikatan Alumni Teknik Sipil Polban</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Berdiri 2001, berakar dari angkatan 1982, berbadan hukum sejak 2024.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">
                {col.title}
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {col.links.map((l) =>
                  l.external ? (
                    <li key={l.href}>
                      <a href={l.href} className="transition-colors hover:text-foreground">
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link href={l.href} className="transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} IKASI Polban · Sejak 28 April 2001 · SK Kemenkumham 2024
        </div>
      </div>
    </footer>
  );
}
