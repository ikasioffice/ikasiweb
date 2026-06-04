import Link from "next/link";

type Role = { jabatan: string; nama?: string; angkatan?: string };

const pengurusPusat: Role[] = [
  { jabatan: "Ketua Umum", nama: "Wildan Rivky Maulid" },
  { jabatan: "Sekretaris Jenderal" },
  { jabatan: "Bendahara Umum" },
  { jabatan: "Ketua Departemen Organisasi" },
  { jabatan: "Ketua Departemen Hubungan Almamater" },
  { jabatan: "Ketua Departemen Profesi & Pengembangan SDM" },
  { jabatan: "Ketua Departemen Usaha & Kerjasama" },
];

const dewanPenasihat: Role[] = [
  { jabatan: "Ketua Dewan Penasihat" },
  { jabatan: "Wakil Ketua" },
  { jabatan: "Sekretaris" },
];

export default function PengurusPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <Link href="/sejarah" className="hover:text-foreground">Tentang</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Pengurus</span>
      </nav>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        Struktur <span className="text-primary">Pengurus</span>
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Berdasarkan AD/ART IKASI BAB IV–V: Pengurus Pusat, Komisariat (Angkatan &amp; Daerah), dan Dewan
        Penasihat. Masa jabatan 4 tahun.
      </p>

      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Pengurus Pusat</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {pengurusPusat.map((r) => <RoleCard key={r.jabatan} role={r} />)}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Komisariat</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          IKASI memiliki Komisariat Angkatan dan Komisariat Daerah sebagai pelaksana kebijakan organisasi.
          Setiap komisariat terdiri dari Ketua, Sekretaris, Bendahara, dan beberapa Ketua Bidang.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Daftar lengkap koordinator per angkatan &amp; daerah sedang dikompilasi.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Dewan Penasihat</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {dewanPenasihat.map((r) => <RoleCard key={r.jabatan} role={r} />)}
        </div>
      </section>

      <div className="mt-10 rounded-xl border border-dashed border-border bg-card p-5 text-center text-sm text-muted-foreground">
        Untuk informasi pengurus aktif, hubungi{" "}
        <a href="mailto:ikasioffice@gmail.com" className="font-medium text-primary hover:underline">ikasioffice@gmail.com</a>
      </div>
    </main>
  );
}

function RoleCard({ role }: { role: Role }) {
  const initials = role.nama
    ? role.nama.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-heading text-sm font-bold ${role.nama ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
        {initials}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{role.jabatan}</div>
        <div className={`font-semibold ${role.nama ? "text-foreground" : "text-muted-foreground"}`}>
          {role.nama ?? "Segera diumumkan"}
          {role.angkatan && <span className="ml-2 text-xs text-muted-foreground">&apos;{role.angkatan}</span>}
        </div>
      </div>
    </div>
  );
}
