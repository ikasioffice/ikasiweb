export default function AdArtPage() {
  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        <span className="gradient-text">AD/ART</span>
      </h1>
      <p className="text-slate-400 mb-10">Anggaran Dasar dan Anggaran Rumah Tangga IKASI Polban</p>

      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">📄</div>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Dokumen AD/ART IKASI Polban sedang dalam proses digitalisasi.
        </p>
        <a
          href="mailto:ikasioffice@gmail.com?subject=Request Dokumen AD/ART IKASI"
          className="btn-gold px-6 py-2.5 rounded-full text-sm inline-block"
        >
          Minta Dokumen AD/ART
        </a>
      </div>
    </main>
  );
}
