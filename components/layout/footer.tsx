import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-12 py-12 border-t border-white/[0.06] text-sm text-slate-400">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="text-[#d4a72c] font-extrabold mb-2">IKASI.</div>
          <p className="text-xs max-w-xs">
            Ikatan Alumni Teknik Sipil Polban. Berdiri 2001, berakar dari angkatan 1982,
            berbadan hukum sejak 2024.
          </p>
        </div>
        <div className="flex gap-12 text-xs">
          <div>
            <div className="text-white font-semibold mb-2">Platform</div>
            <Link href="/alumni" className="block py-1">Direktori</Link>
            <Link href="/bisnis" className="block py-1">Bisnis</Link>
            <Link href="/event" className="block py-1">Acara</Link>
            <Link href="/news" className="block py-1">Berita</Link>
          </div>
          <div>
            <div className="text-white font-semibold mb-2">Organisasi</div>
            <Link href="/sejarah" className="block py-1">Sejarah</Link>
            <Link href="/pengurus" className="block py-1">Pengurus</Link>
            <Link href="/ad-art" className="block py-1">AD/ART</Link>
            <Link href="/cara-bergabung" className="block py-1">Cara Bergabung</Link>
          </div>
          <div>
            <div className="text-white font-semibold mb-2">Kontak</div>
            <a href="mailto:ikasioffice@gmail.com" className="block py-1">
              ikasioffice@gmail.com
            </a>
            <a href="https://instagram.com/ikasi.poliitb.polban" className="block py-1">
              @ikasi.poliitb.polban
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-xs text-slate-500">
        © {new Date().getFullYear()} IKASI Polban. SK Kemenkumham 2024.
      </div>
    </footer>
  );
}
