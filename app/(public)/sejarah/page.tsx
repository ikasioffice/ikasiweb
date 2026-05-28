export default function SejarahPage() {
  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        Tentang <span className="gradient-text">IKASI Polban</span>
      </h1>
      <p className="text-slate-400 mb-10">Ikatan Alumni Teknik Sipil Politeknik Negeri Bandung</p>

      <Section label="Sejarah">
        <p className="text-slate-300 leading-relaxed">
          IKASI Polban berdiri sebagai wadah bagi para alumni Teknik Sipil Politeknik Negeri Bandung
          (dahulu Politeknik ITB) yang telah menghasilkan ribuan lulusan sejak angkatan pertama tahun 1982.
          Organisasi ini resmi berbadan hukum dengan Surat Keputusan Kemenkumham pada tahun 2024,
          menandai babak baru dalam penguatan komunitas alumni.
        </p>
      </Section>

      <Section label="Visi">
        <p className="text-slate-300 leading-relaxed">
          Menjadi organisasi alumni teknik sipil yang profesional, solid, dan berdampak nyata bagi
          pembangunan bangsa dan pengembangan almamater.
        </p>
      </Section>

      <Section label="Misi">
        <ul className="space-y-2 text-slate-300 text-sm">
          <li>• Mempererat silaturahmi dan jaringan antar alumni Teknik Sipil Polban</li>
          <li>• Mendukung perkembangan karier dan wirausaha alumni</li>
          <li>• Berkontribusi pada pengembangan Prodi Teknik Sipil Polban</li>
          <li>• Membangun ekosistem profesional di bidang teknik sipil Indonesia</li>
        </ul>
      </Section>

      <Section label="Data Singkat">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-400 text-xs mb-1">Tahun Berdiri</div>
            <div className="text-[#d4a72c] font-semibold">2001</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">Angkatan Pertama</div>
            <div className="text-[#d4a72c] font-semibold">1982</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">Berbadan Hukum</div>
            <div className="text-[#d4a72c] font-semibold">2024 (SK Kemenkumham)</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">Kontak</div>
            <div>
              <a href="mailto:ikasioffice@gmail.com" className="text-[#d4a72c] hover:underline">
                ikasioffice@gmail.com
              </a>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 pb-8 border-b border-white/[0.06]">
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">{label}</div>
      {children}
    </section>
  );
}
