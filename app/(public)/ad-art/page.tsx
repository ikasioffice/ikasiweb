import Link from "next/link";

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
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <Link href="/sejarah" className="hover:text-foreground">Tentang</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">AD/ART</span>
      </nav>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="text-primary">AD/ART</span>
      </h1>
      <p className="mt-2 text-muted-foreground">
        Anggaran Dasar dan Anggaran Rumah Tangga IKASI Polban — disahkan 6 Desember 2020.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {/* Daftar isi */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Daftar Isi</h2>
          <ol className="space-y-2 text-sm">
            {tableOfContents.map((item) => (
              <li key={item.bab} className="flex gap-2 text-muted-foreground">
                <span className="font-semibold text-primary">{item.bab}</span> — {item.title}
              </li>
            ))}
          </ol>
        </div>
        {/* Aksi */}
        <div className="space-y-3">
          <a
            href={`https://drive.google.com/uc?export=download&id=${PDF_DRIVE_ID}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Unduh PDF
          </a>
          <a
            href={`https://drive.google.com/file/d/${PDF_DRIVE_ID}/view`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          >
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
            Buka di Google Drive
          </a>
          <a
            href="mailto:ikasioffice@gmail.com?subject=Request%20Dokumen%20AD/ART%20IKASI"
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          >
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>
            Minta dokumen via email
          </a>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <iframe
          src={`https://drive.google.com/file/d/${PDF_DRIVE_ID}/preview`}
          className="h-[800px] w-full"
          allow="autoplay"
          title="AD/ART IKASI"
        />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Jika dokumen tidak muncul, kemungkinan permission Drive masih restricted. Hubungi{" "}
        <a href="mailto:ikasioffice@gmail.com" className="text-primary hover:underline">ikasioffice@gmail.com</a>.
      </p>
    </main>
  );
}
