import { PageHeader } from "@/components/ui/page-header";

export default function SejarahPage() {
  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <PageHeader
        title={<>Tentang <span className="gradient-text">IKASI Polban</span></>}
        subtitle="Ikatan Alumni Teknik Sipil Politeknik Negeri Bandung"
        className="mb-10"
      />

      <Section label="Sejarah">
        <p className="text-slate-300 leading-relaxed">
          Jurusan Teknik Sipil Politeknik Institut Teknologi Bandung berdiri pada tahun 1982 dan telah
          menghasilkan ribuan lulusan yang berkiprah di seluruh nusantara hingga luar negeri. Pada tahun
          1985, alumni membentuk &ldquo;Ikatan Alumni Politeknik ITB&rdquo;. Seiring perubahan institusi
          menjadi Politeknik Negeri Bandung, organisasi alumni menyesuaikan nama menjadi
          <strong> Ikatan Alumni Teknik Sipil Politeknik ITB – Politeknik Negeri Bandung (IKASI)</strong>,
          resmi berdiri pada <strong>28 April 2001</strong>. AD/ART terakhir disahkan pada 6 Desember 2020
          di Bandung sebagai Yayasan Non Profit.
        </p>
      </Section>

      <Section label="Tujuan Organisasi">
        <ol className="space-y-2 text-slate-300 text-sm list-decimal pl-5">
          <li>Menjaga, membina, dan mempererat hubungan kekeluargaan serta kerjasama antara sesama alumni dan civitas academica Jurusan Teknik Sipil Polban.</li>
          <li>Turut serta dalam membangun visi-misi Jurusan Teknik Sipil Polban.</li>
          <li>Menumbuh-kembangkan rasa cinta dan kebanggaan pada almamater.</li>
          <li>Mengabdikan diri kepada masyarakat.</li>
          <li>Mengoptimalkan sumber daya alumni sebagai mitra pembangunan nasional.</li>
        </ol>
      </Section>

      <Section label="Usaha">
        <ul className="space-y-2 text-slate-300 text-sm">
          <li>• Menyelenggarakan kegiatan yang menumbuhkan rasa memiliki pada organisasi dan almamater.</li>
          <li>• Memperjuangkan keberadaan, peran, dan kedudukan organisasi di tingkat nasional dan internasional.</li>
          <li>• Meningkatkan mutu dan kemampuan alumni secara profesional.</li>
          <li>• Menjalin kerjasama dengan lembaga terkait di dalam maupun luar negeri.</li>
          <li>• Mengadakan usaha lain yang sah dan sesuai asas organisasi.</li>
        </ul>
      </Section>

      <Section label="Data Singkat">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-400 text-xs mb-1">Tanggal Pendirian</div>
            <div className="text-[#d4a72c] font-semibold">28 April 2001</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">Jurusan Berdiri</div>
            <div className="text-[#d4a72c] font-semibold">1982 (Politeknik ITB)</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">AD/ART Disahkan</div>
            <div className="text-[#d4a72c] font-semibold">6 Desember 2020</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">Bentuk Hukum</div>
            <div className="text-[#d4a72c] font-semibold">Yayasan Non Profit</div>
          </div>
          <div className="col-span-2">
            <div className="text-slate-400 text-xs mb-1">Sekretariat</div>
            <div className="text-slate-200 text-sm">
              Kampus Polban Jurusan Teknik Sipil, Jl. Gegerkalong Hilir, Ds. Ciwaruga,
              Kec. Parongpong, Kab. Bandung Barat 40559
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-slate-400 text-xs mb-1">Kontak</div>
            <a href="mailto:ikasioffice@gmail.com" className="text-[#d4a72c] hover:underline">
              ikasioffice@gmail.com
            </a>
            <span className="text-slate-500"> · </span>
            <a href="mailto:ikasi.poliitb.polban@gmail.com" className="text-[#d4a72c] hover:underline">
              ikasi.poliitb.polban@gmail.com
            </a>
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
