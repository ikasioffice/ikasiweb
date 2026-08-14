/**
 * Teks bawaan halaman /beasiswa.
 *
 * Pola ini mengikuti microsite aslinya: prosa ditulis di sini sebagai default
 * (render instan, ramah SEO, tidak ada loading shell), lalu ditimpa oleh baris
 * di tabel beasiswa_content bila admin pernah mengeditnya lewat /admin/beasiswa.
 *
 * Key yang bisa ditimpa admin didaftarkan di app/(admin)/admin/beasiswa/_fields.ts.
 */

export const DEFAULT_HERO_TAGLINE =
  "Program beasiswa yang bertujuan untuk membantu mahasiswa Jurusan Teknik Sipil Politeknik Negeri Bandung.";

export const LATAR_BELAKANG =
  "Tunggakan UKT masih menjadi beban nyata bagi banyak mahasiswa Teknik Sipil — baik yang berprestasi maupun yang bersungguh-sungguh menempuh pendidikan. Survei internal IKASI kepada 413 mahasiswa menemukan bahwa 52,1% pernah atau sedang terkendala UKT, dan hampir semuanya (96,4%) berminat mendapatkan bantuan beasiswa.";

export const TENTANG_PARAGRAF = [
  "Atas dasar itulah IKASI — Ikatan Alumni Jurusan Teknik Sipil Poli ITB – Politeknik Negeri Bandung — menghadirkan Program Beasiswa Alumni sebagai bentuk kepedulian nyata alumni untuk meringankan beban tersebut.",
  "Program ini terbuka bagi alumni, perusahaan, dan donatur yang ingin turut menghimpun dana secara transparan melalui rekening resmi IKASI, agar mahasiswa dapat fokus menyelesaikan pendidikan tanpa terbebani masalah biaya.",
];

export const VISI =
  "Menjadi jembatan nyata antara alumni dan mahasiswa Teknik Sipil dalam mewujudkan pendidikan yang merata dan berkelanjutan.";

export const MISI = [
  "Meringankan beban tunggakan UKT mahasiswa Teknik Sipil yang berprestasi dan bersungguh-sungguh.",
  "Menghimpun kepedulian alumni, perusahaan, dan donatur untuk berkontribusi nyata.",
  "Mendorong mahasiswa agar dapat fokus menyelesaikan pendidikan tanpa terbebani masalah biaya.",
];

export const TUJUAN_LEDE =
  "Program ini dirancang dengan tujuan yang terukur, bukan sekadar bantuan sesaat.";

export const TUJUAN = [
  {
    num: "01",
    title: "Memberdayakan Generasi Penerus",
    desc: "Membuka akses pendidikan yang lebih luas bagi mahasiswa Teknik Sipil melalui dukungan biaya yang berkelanjutan.",
  },
  {
    num: "02",
    title: "Membangun Jaringan Alumni",
    desc: "Memperkuat jaringan alumni yang kuat dan berkelanjutan sebagai fondasi kontribusi jangka panjang bagi almamater.",
  },
  {
    num: "03",
    title: "Meningkatkan Kualitas SDM",
    desc: "Menyiapkan lulusan Teknik Sipil yang kompeten dan siap berkontribusi di dunia kerja maupun masyarakat.",
  },
  {
    num: "04",
    title: "Dampak Sosial Berkelanjutan",
    desc: "Turut mendorong dampak sosial dan pembangunan berkelanjutan melalui investasi pada pendidikan generasi muda.",
  },
];

export const FAKTA_LEDE =
  "Berdasarkan survei tingkat kebutuhan beasiswa mahasiswa jurusan Teknik Sipil Polban dan sinkronisasi data tunggakan dari Bidang Keuangan Polban. Diperoleh data sebagai berikut:";

export const INSIGHTS = [
  {
    judul: "Survey Kebutuhan Beasiswa",
    sub: "Periode M1 April – M4 Mei 2026",
    items: [
      { val: "398 mhs", desc: "berminat mendapatkan beasiswa (96,4%)" },
      { val: "215 mhs", desc: "pernah/sedang terkendala UKT (52,1%)" },
      { val: "83,8%", desc: "akan memakai beasiswa untuk pembayaran UKT — hambatan finansial utama mahasiswa" },
    ],
  },
  {
    judul: "Status Tunggakan Mahasiswa",
    sub: "Sumber: Bidang Keuangan Polban, Mei 2026",
    items: [
      { val: "131 mhs", desc: "Program Studi D3 & D4 aktif memiliki tunggakan UKT" },
      { val: "Rp 363,2 jt", desc: "total tunggakan UKT dari 131 mahasiswa tersebut" },
    ],
  },
];

export const DEFAULT_FAKTA_CALLOUT =
  "Berdasarkan sinkronisasi data survei dengan data tunggakan Bidang Keuangan, beasiswa diprioritaskan bagi 34 mahasiswa tingkat akhir dengan total tunggakan senilai Rp 99.000.000.";

export const SISTEMATIKA_LEDE =
  "Program ini diprioritaskan bagi mahasiswa tingkat akhir yang berisiko terhambat kelulusannya karena kendala finansial. Dana beasiswa diharapkan dapat dikembalikan setelah penerima bekerja — penuh atau dicicil, maksimal 12 bulan — agar dapat digunakan kembali untuk mahasiswa lain. Periode program: April 2026 – Februari 2027.";

export const ANGGARAN_LEDE =
  "Beasiswa diprioritaskan bagi mahasiswa tingkat akhir yang memiliki tunggakan UKT atau uang pangkal berpotensi menghambat kelulusan — jumlah penerima disesuaikan berdasarkan dana yang terkumpul.";

export const DEFAULT_ANGGARAN_NOTE =
  "Di luar 34 mahasiswa tingkat akhir prioritas ini, total tunggakan UKT seluruh mahasiswa aktif Program Studi D3/D4 tercatat Rp 363.237.500 (131 mahasiswa) — gambaran skala kebutuhan yang lebih luas untuk keberlanjutan program ke depan.";

export const DEFAULT_REKENING_JUDUL = "Rekening Resmi IKASI";

export const DEFAULT_REKENING_DESC = [
  "BSI a.n. IKASI POLBAN",
  "1982320247",
  "Kirim donasi dengan nominal diakhiri angka 11 sebagai kode pendataan.",
  "Contoh: Rp50.011 atau Rp100.011",
].join("\n");

export const KONTAK_LEDE =
  "Terima kasih atas perhatiannya. Kami sangat mengharapkan dukungan serta partisipasi akang-teteh dalam program ini. Tim kami siap menjelaskan lebih detail mengenai skema kemitraan dan laporan keuangan program.";

export const DEFAULT_PIC_NAMA = "IKASI Office";
export const DEFAULT_PIC_TITLE = "Ikatan Alumni Teknik Sipil Poli ITB – Polban";
export const DEFAULT_KONTAK_WA = "0812-3468-1730";
export const DEFAULT_KONTAK_EMAIL = "ikasioffice@gmail.com";
export const DEFAULT_KONTAK_IG = "@ikasi.poliitb.polban";

export const WA_NUMBER = "6281234681730";

export const DEFAULT_PROGRESS_LABEL = "5 dari 12 tahap telah selesai";
export const DEFAULT_PROGRESS_PERCENT = 42;

export const DEFAULT_DONE_LIST = [
  "Pembentukan Program Beasiswa IKASI",
  "Survey kebutuhan beasiswa ke 413 mahasiswa Teknik Sipil Polban",
  "Pengajuan data tunggakan mahasiswa ke Manajemen Polban",
  "Sinkronisasi data tunggakan dengan hasil survey",
  "Survey mata pencaharian orang tua mahasiswa",
];

export type TimelineItem = {
  tanggal: string;
  status: string;
  judul: string;
  desc: string;
  aktif: boolean;
};

export const DEFAULT_TIMELINE: TimelineItem[] = [
  {
    tanggal: "Agustus 2026",
    status: "Akan Datang",
    judul: "Pengumpulan Sumber Dana",
    desc: "Mulai Agustus minggu ke-1 — dimungkinkan dilaksanakan bertahap (per batch) menyesuaikan kebutuhan dana.",
    aktif: true,
  },
  {
    tanggal: "Agustus 2026",
    status: "Akan Datang",
    judul: "Pengumpulan Formulir Data Diri & Keuangan Orang Tua",
    desc: "Pengumpulan berkas dari calon penerima beasiswa.",
    aktif: false,
  },
  {
    tanggal: "Agustus 2026",
    status: "Direncanakan",
    judul: "Verifikasi Administrasi",
    desc: "Pemeriksaan kelengkapan dan keabsahan berkas calon penerima.",
    aktif: false,
  },
  {
    tanggal: "Agustus 2026",
    status: "Direncanakan",
    judul: "Wawancara Calon Penerima Beasiswa",
    desc: "Sesi wawancara oleh tim pelaksana untuk penilaian akhir.",
    aktif: false,
  },
  {
    tanggal: "September 2026",
    status: "Direncanakan",
    judul: "Penetapan Penerima Beasiswa",
    desc: "Penentuan akhir daftar mahasiswa penerima beasiswa.",
    aktif: false,
  },
  {
    tanggal: "September 2026",
    status: "Direncanakan",
    judul: "Pengumuman Penerima Beasiswa",
    desc: "Publikasi resmi daftar penerima kepada seluruh pemangku kepentingan.",
    aktif: false,
  },
  {
    tanggal: "Okt 2026 – Feb 2027",
    status: "Direncanakan",
    judul: "Penyaluran Beasiswa",
    desc: "Pencairan dana beasiswa mengikuti masuk kuliah semester ganjil.",
    aktif: false,
  },
];

/** Format admin: "tanggal|status|judul|deskripsi|aktif(ya/tidak)", satu per baris. */
export function parseTimeline(raw: string | undefined): TimelineItem[] | null {
  if (!raw) return null;
  const items = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const p = line.split("|");
      return {
        tanggal: (p[0] ?? "").trim(),
        status: (p[1] ?? "").trim(),
        judul: (p[2] ?? "").trim(),
        desc: (p[3] ?? "").trim(),
        aktif: (p[4] ?? "").trim().toLowerCase() === "ya",
      };
    });
  return items.length > 0 ? items : null;
}

export function parseLines(raw: string | undefined): string[] | null {
  if (!raw) return null;
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.length > 0 ? lines : null;
}
