const PDF_DRIVE_ID = "182dv7VU6C_L0ZqzEcsjhM7-RSZHTIWib";

const tableOfContents = [
  { bab: "BAB I", title: "Nama, Tempat Kedudukan, dan Waktu" },
  { bab: "BAB II", title: "Asas, Sifat, Tujuan dan Usaha" },
  { bab: "BAB III", title: "Keanggotaan" },
  { bab: "BAB IV", title: "Susunan dan Alat Kelengkapan Organisasi" },
  { bab: "BAB V", title: "Pengurus Organisasi" },
  { bab: "BAB VI", title: "Kode Etik" },
  { bab: "BAB VII", title: "Kekayaan" },
  { bab: "BAB VIII", title: "Anggaran Rumah Tangga" },
  { bab: "BAB IX", title: "Lambang Organisasi" },
  { bab: "BAB X", title: "Perubahan Anggaran Dasar" },
  { bab: "BAB XI", title: "Pembubaran Organisasi dan Likuidasi" },
  { bab: "BAB XII", title: "Ketentuan Peralihan" },
  { bab: "BAB XIII", title: "Ketentuan Penutup" },
];

export default function AdArtPage() {
  return (
    <main className="px-6 py-16 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        <span className="gradient-text">AD/ART</span>
      </h1>
      <p className="text-slate-400 mb-10">
        Anggaran Dasar dan Anggaran Rumah Tangga IKASI Polban — disahkan 6 Desember 2020
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Daftar Isi</div>
          <ul className="space-y-1.5 text-sm">
            {tableOfContents.map((item) => (
              <li key={item.bab} className="text-slate-300">
                <span className="text-[#d4a72c] font-semibold">{item.bab}</span> — {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Aksi</div>
          <div className="space-y-3">
            <a
              href={`https://drive.google.com/uc?export=download&id=${PDF_DRIVE_ID}`}
              target="_blank"
              rel="noreferrer"
              className="btn-gold px-6 py-2.5 rounded-full text-sm inline-block"
            >
              Unduh PDF
            </a>
            <a
              href={`https://drive.google.com/file/d/${PDF_DRIVE_ID}/view`}
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-slate-300 hover:text-[#d4a72c]"
            >
              Buka di Google Drive →
            </a>
            <a
              href="mailto:ikasioffice@gmail.com?subject=Request%20Dokumen%20AD/ART%20IKASI"
              className="block text-sm text-slate-300 hover:text-[#d4a72c]"
            >
              Minta dokumen via email →
            </a>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06]">
        <iframe
          src={`https://drive.google.com/file/d/${PDF_DRIVE_ID}/preview`}
          className="w-full h-[800px]"
          allow="autoplay"
          title="AD/ART IKASI"
        />
      </div>

      <p className="text-xs text-slate-500 mt-6 text-center">
        Jika dokumen tidak muncul, kemungkinan permission Drive masih restricted.
        Hubungi{" "}
        <a href="mailto:ikasioffice@gmail.com" className="text-[#d4a72c]">
          ikasioffice@gmail.com
        </a>
        .
      </p>
    </main>
  );
}
