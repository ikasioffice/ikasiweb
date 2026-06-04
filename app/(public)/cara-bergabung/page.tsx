import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Daftar dengan Google",
    desc: "Klik tombol Masuk / Daftar di navigasi dan login menggunakan akun Google kamu.",
  },
  {
    num: "02",
    title: "Profil terdeteksi otomatis",
    desc: "Sistem akan mencocokkan email kamu dengan database alumni. Jika cocok, akun langsung terhubung.",
  },
  {
    num: "03",
    title: "Verifikasi manual (jika perlu)",
    desc: "Jika email tidak cocok, hubungi pengurus untuk verifikasi manual. Gratis, tanpa biaya.",
  },
  {
    num: "04",
    title: "Akses penuh",
    desc: "Setelah terverifikasi, kamu bisa lihat kontak sesama alumni, daftarkan bisnis, dan ikut acara.",
  },
];

type Benefit = { brand: string; desc: string; benefit: string };

const benefits: Benefit[] = [
  { brand: "Travelance.id", desc: "Platform edukasi pariwisata", benefit: "Sesi 1-on-1 gratis konsultasi" },
  { brand: "Rancang Imah", desc: "Jasa desain & renovasi rumah", benefit: "Free desain 2D/3D, max 3× revisi" },
  { brand: "Konveksi Bandung Berkah", desc: "Pembuatan kemeja kerja, rompi proyek, kaos gathering", benefit: "Free design & free ongkir" },
  { brand: "Waheed Consulting", desc: "Konsultan keuangan, bisnis, dan pembiayaan syariah", benefit: "Free konsultasi 1 sesi + diskon 10%" },
  { brand: "PT. BOEMI MANDIRI PERSADA", desc: "Usaha jasa konstruksi", benefit: "Diskon khusus anggota" },
  { brand: "Handal Studio", desc: "Pelatihan spesialis Jalan & Jembatan, BIM", benefit: "Diskon pelatihan" },
  { brand: "PD. Berkah Abadi Citunjung", desc: "Pusat belanja bahan bangunan", benefit: "Diskon 3% + gratis ongkir KBB & Cimahi" },
  { brand: "Ruang Therapeutic", desc: "Jasa kesehatan mental & hipnoterapi", benefit: "Diskon konsultasi & hipnoterapi" },
  { brand: "Sana Project", desc: "Design interior, arsitektur & konstruksi", benefit: "Free desain (Design & Build) / diskon 5%" },
  { brand: "Negrin Industries", desc: "Manufaktur apparel, aksesoris & merchandise", benefit: "Free design + ongkir, support B2B" },
  { brand: "SEMMA STUDIO", desc: "Konsultan arsitektur", benefit: "Potongan harga khusus" },
  { brand: "WIDIARNOKO Repair & Strengthening", desc: "Konsultan perbaikan & perkuatan struktur (FRP)", benefit: "30% fee per termin pembayaran" },
  { brand: "PT. Anugrahjaya Multi Sinergi", desc: "Kontraktor perkuatan & waterproofing", benefit: "3% fee per termin project" },
  { brand: "Bumi Putra Trade", desc: "E-commerce alat NDT (Langry) & tools", benefit: "Diskon e-commerce" },
];

export default function CaraBergabungPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Cara Bergabung</span>
      </nav>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        Cara <span className="text-primary">Bergabung</span>
      </h1>
      <p className="mt-2 text-muted-foreground">
        Gratis. Hanya butuh akun Google dan status alumni Teknik Sipil Polban.
      </p>

      {/* Steps */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="font-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
              {step.num}
            </div>
            <div>
              <div className="font-semibold text-foreground">{step.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/login" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          Daftar Sekarang
        </Link>
        <a href="https://wa.me/6281234681730?text=Halo%20IKASI%2C%20saya%20ingin%20verifikasi%20sebagai%20alumni." target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-semibold transition-colors hover:bg-accent">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
          Hubungi Pengurus (WA)
        </a>
      </div>

      {/* Benefits */}
      <section className="mt-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          BENEFIT ANGGOTA
        </span>
        <h2 className="font-heading mt-3 text-2xl font-extrabold tracking-tight">Keuntungan dari bisnis alumni</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Penawaran khusus dari {benefits.length} brand milik sesama alumni — eksklusif untuk anggota IKASI terverifikasi.
        </p>

        <div className="mt-6 grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.brand} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="font-heading font-bold text-foreground">{b.brand}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{b.desc}</div>
              <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-primary/10 p-2.5 text-xs font-medium text-primary">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11V6a3 3 0 0 1 6 0v5" /><path d="M3 11h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" /></svg>
                {b.benefit}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
