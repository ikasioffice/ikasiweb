export default function PengurusPage() {
  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        Struktur <span className="gradient-text">Pengurus</span>
      </h1>
      <p className="text-slate-400 mb-10">Pengurus IKASI Polban periode aktif</p>

      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">🏛️</div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Informasi struktur pengurus sedang dalam proses pengumpulan data.
          <br />
          Untuk informasi lebih lanjut, hubungi kami di{" "}
          <a href="mailto:ikasioffice@gmail.com" className="text-[#d4a72c] hover:underline">
            ikasioffice@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
