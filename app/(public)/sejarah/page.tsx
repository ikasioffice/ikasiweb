import Link from "next/link";
import { LineIcon } from "@/components/ui/icons";

export default function SejarahPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Tentang</span>
      </nav>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        Tentang <span className="text-primary">IKASI Polban</span>
      </h1>
      <p className="mt-2 text-muted-foreground">Ikatan Alumni Teknik Sipil Politeknik Negeri Bandung.</p>

      {/* Sejarah */}
      <Card label="Sejarah" className="mt-10">
        <p className="leading-relaxed text-muted-foreground">
          Jurusan Teknik Sipil Politeknik Institut Teknologi Bandung berdiri pada tahun 1982 dan telah
          menghasilkan ribuan lulusan yang berkiprah di seluruh nusantara hingga luar negeri. Pada tahun
          1985, alumni membentuk &ldquo;Ikatan Alumni Politeknik ITB&rdquo;. Seiring perubahan institusi
          menjadi Politeknik Negeri Bandung, organisasi alumni menyesuaikan nama menjadi{" "}
          <strong className="text-foreground">Ikatan Alumni Teknik Sipil Politeknik ITB – Politeknik Negeri Bandung (IKASI)</strong>,
          resmi berdiri pada <strong className="text-foreground">28 April 2001</strong>. AD/ART terakhir disahkan
          pada 6 Desember 2020 di Bandung sebagai Yayasan Non Profit.
        </p>
      </Card>

      {/* Timeline */}
      <Card label="Linimasa" className="mt-6">
        <ol className="relative space-y-6 border-l border-border pl-6">
          {timeline.map((t) => (
            <li key={t.year}>
              <div className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-primary" />
              <div className="font-heading font-bold text-primary">{t.year}</div>
              <p className="text-sm text-muted-foreground">{t.text}</p>
            </li>
          ))}
        </ol>
      </Card>

      {/* Tujuan */}
      <Card label="Tujuan Organisasi" className="mt-6">
        <ul className="space-y-3 text-sm text-muted-foreground">
          {tujuan.map((t) => (
            <li key={t} className="flex gap-3">
              <LineIcon name="check" size={16} className="mt-0.5 shrink-0 text-primary" />
              {t}
            </li>
          ))}
        </ul>
      </Card>

      {/* Data singkat */}
      <Card label="Data Singkat" className="mt-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Data k="Tanggal Pendirian" v="28 April 2001" />
          <Data k="Jurusan Berdiri" v="1982 (Politeknik ITB)" />
          <Data k="AD/ART Disahkan" v="6 Desember 2020" />
          <Data k="Bentuk Hukum" v="Yayasan Non Profit" />
          <div className="col-span-2">
            <div className="mb-1 text-xs text-muted-foreground">Sekretariat</div>
            <div className="text-foreground">
              Kampus Polban Jurusan Teknik Sipil, Jl. Gegerkalong Hilir, Ds. Ciwaruga, Kec. Parongpong,
              Kab. Bandung Barat 40559
            </div>
          </div>
          <div className="col-span-2">
            <div className="mb-1 text-xs text-muted-foreground">Kontak</div>
            <div className="flex flex-col gap-1">
              <a href="https://wa.me/6281234681730" target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-1.5 text-primary hover:underline">
                <LineIcon name="phone" size={14} /> WhatsApp: +62 812-3468-1730
              </a>
              <a href="mailto:ikasioffice@gmail.com" className="inline-flex w-fit items-center gap-1.5 text-primary hover:underline">
                <LineIcon name="mail" size={14} /> ikasioffice@gmail.com
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* CTA pengurus / ad-art */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/pengurus" className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary"><LineIcon name="users" size={20} /></div>
          <div><div className="font-semibold">Struktur Pengurus</div><div className="text-xs text-muted-foreground">Lihat susunan kepengurusan</div></div>
          <svg className="ml-auto h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </Link>
        <Link href="/ad-art" className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary"><LineIcon name="briefcase" size={20} /></div>
          <div><div className="font-semibold">AD / ART</div><div className="text-xs text-muted-foreground">Anggaran dasar & rumah tangga</div></div>
          <svg className="ml-auto h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </Link>
      </div>
    </main>
  );
}

function Card({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className}`}>
      <div className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      {children}
    </section>
  );
}

function Data({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{k}</div>
      <div className="font-semibold text-primary">{v}</div>
    </div>
  );
}

const timeline = [
  { year: "1982", text: "Jurusan Teknik Sipil Politeknik ITB berdiri." },
  { year: "1985", text: "Terbentuk “Ikatan Alumni Politeknik ITB”." },
  { year: "28 April 2001", text: "IKASI resmi berdiri." },
  { year: "6 Desember 2020", text: "AD/ART terakhir disahkan sebagai Yayasan Non Profit." },
];

const tujuan = [
  "Menjaga, membina, dan mempererat hubungan kekeluargaan serta kerjasama antara sesama alumni dan civitas academica Jurusan Teknik Sipil Polban.",
  "Turut serta dalam membangun visi-misi Jurusan Teknik Sipil Polban.",
  "Menumbuh-kembangkan rasa cinta dan kebanggaan pada almamater.",
  "Mengabdikan diri kepada masyarakat.",
  "Mengoptimalkan sumber daya alumni sebagai mitra pembangunan nasional.",
];
