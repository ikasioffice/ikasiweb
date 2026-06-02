import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

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
    <main className="px-6 py-16 max-w-4xl mx-auto">
      <PageHeader
        title={<>Cara <span className="gradient-text">Bergabung</span></>}
        subtitle="Gratis. Hanya butuh akun Google dan status alumni Teknik Sipil Polban."
        className="mb-12"
      />

      <div className="space-y-6 mb-16 max-w-3xl">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#d4a72c]/10 border border-[#d4a72c]/20 flex items-center justify-center text-[#d4a72c] font-extrabold text-lg flex-shrink-0">
              {step.num}
            </div>
            <div>
              <div className="font-semibold text-white mb-1">{step.title}</div>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-16 max-w-3xl">
        <Link href="/login" className="btn-gold px-8 py-3 rounded-full font-semibold">
          Mulai Bergabung
        </Link>
        <a
          href="mailto:ikasioffice@gmail.com?subject=Verifikasi Alumni IKASI"
          className="px-8 py-3 rounded-full border border-white/20 text-white font-semibold hover:border-[#d4a72c]/50 transition-colors"
        >
          Hubungi Pengurus
        </a>
      </div>

      <section className="border-t border-white/[0.06] pt-12">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Benefit Anggota</div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">
          Penawaran khusus dari <span className="gradient-text">14 brand alumni</span>
        </h2>
        <p className="text-slate-400 text-sm mb-8 max-w-2xl">
          Anggota IKASI yang terverifikasi mendapat akses ke benefit berikut dari brand-brand
          milik sesama alumni Teknik Sipil Polban.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <Card key={b.brand} className="p-5">
              <div className="font-semibold text-white mb-1">{b.brand}</div>
              <div className="text-xs text-slate-400 mb-3">{b.desc}</div>
              <div className="text-sm text-[#d4a72c] font-medium">{b.benefit}</div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
