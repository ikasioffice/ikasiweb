import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

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
    <main className="px-6 py-16 max-w-4xl mx-auto">
      <PageHeader
        title={<>Struktur <span className="gradient-text">Pengurus</span></>}
        subtitle="Berdasarkan AD/ART IKASI BAB IV–V, struktur organisasi terdiri dari Pengurus Pusat, Komisariat (Angkatan & Daerah), dan Dewan Penasihat. Masa jabatan 4 tahun."
        className="mb-10"
      />

      <Section label="Pengurus Pusat">
        <div className="grid sm:grid-cols-2 gap-3">
          {pengurusPusat.map((r) => (
            <RoleCard key={r.jabatan} role={r} />
          ))}
        </div>
      </Section>

      <Section label="Komisariat">
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          IKASI memiliki Komisariat Angkatan dan Komisariat Daerah sebagai pelaksana kebijakan
          organisasi. Setiap komisariat terdiri dari Ketua, Sekretaris, Bendahara, dan beberapa Ketua Bidang.
        </p>
        <p className="text-slate-500 text-xs">
          Daftar lengkap koordinator per angkatan & daerah sedang dikompilasi.
        </p>
      </Section>

      <Section label="Dewan Penasihat">
        <div className="grid sm:grid-cols-3 gap-3">
          {dewanPenasihat.map((r) => (
            <RoleCard key={r.jabatan} role={r} />
          ))}
        </div>
      </Section>

      <div className="text-center text-xs text-slate-500 mt-10">
        Untuk informasi pengurus aktif, hubungi{" "}
        <a href="mailto:ikasioffice@gmail.com" className="text-[#d4a72c] hover:underline">
          ikasioffice@gmail.com
        </a>
      </div>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-10 pb-8 border-b border-white/[0.06]">
      <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">{label}</div>
      {children}
    </section>
  );
}

function RoleCard({ role }: { role: Role }) {
  return (
    <Card className="p-4">
      <div className="text-xs text-[#d4a72c] mb-1">{role.jabatan}</div>
      {role.nama ? (
        <div className="text-sm text-white font-medium">
          {role.nama}
          {role.angkatan && <span className="text-slate-500 ml-2 text-xs">&apos;{role.angkatan}</span>}
        </div>
      ) : (
        <div className="text-sm text-slate-500 italic">Akan diumumkan</div>
      )}
    </Card>
  );
}
