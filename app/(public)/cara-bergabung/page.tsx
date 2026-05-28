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

export default function CaraBergabungPage() {
  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        Cara <span className="gradient-text">Bergabung</span>
      </h1>
      <p className="text-slate-400 mb-12">Gratis. Hanya butuh akun Google dan status alumni Teknik Sipil Polban.</p>

      <div className="space-y-6 mb-12">
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

      <div className="flex flex-wrap gap-4">
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
    </main>
  );
}
