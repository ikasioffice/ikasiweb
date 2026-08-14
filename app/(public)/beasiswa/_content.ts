/**
 * Teks bawaan halaman /beasiswa.
 *
 * Pola ini mengikuti microsite aslinya: teks default ditulis di sini (ikut
 * ter-render server-side, jadi instan dan ramah SEO), lalu ditimpa oleh baris
 * di tabel beasiswa_content bila admin pernah mengeditnya lewat /admin/beasiswa.
 *
 * Nilai di bawah disalin langsung dari CONTENT_SCHEMA admin.html microsite lama
 * agar hasilnya identik dengan yang selama ini tampil.
 *
 * Daftar field yang bisa diedit ada di app/(admin)/admin/beasiswa/_fields.ts.
 */

export const DEFAULTS: Record<string, string> = {
  // Hero (Bagian Paling Atas)
  hero_eyebrow: "Proposal Kemitraan & Donasi · 2026",
  hero_title_line1: "Beasiswa",
  hero_title_line2: "Alumni IKASI",
  hero_tagline: "Program beasiswa yang bertujuan untuk membantu mahasiswa Jurusan Teknik Sipil Politeknik Negeri Bandung.",
  // Tentang Program
  tentang_eyebrow: "Tentang Program",
  tentang_judul: "Program Beasiswa Alumni Tahun 2026-2027",
  tentang_latar_judul: "Latar Belakang",
  tentang_latar_isi: "Tunggakan UKT masih menjadi beban nyata bagi banyak mahasiswa Teknik Sipil — baik yang berprestasi maupun yang bersungguh-sungguh menempuh pendidikan. Survei internal IKASI kepada 413 mahasiswa menemukan bahwa 52,1% pernah atau sedang terkendala UKT, dan hampir semuanya (96,4%) berminat mendapatkan bantuan beasiswa.",
  tentang_copy_1: "Atas dasar itulah IKASI — Ikatan Alumni Jurusan Teknik Sipil Poli ITB – Politeknik Negeri Bandung — menghadirkan Program Beasiswa Alumni sebagai bentuk kepedulian nyata alumni untuk meringankan beban tersebut.",
  tentang_copy_2: "Program ini terbuka bagi alumni, perusahaan, dan donatur yang ingin turut menghimpun dana secara transparan melalui rekening resmi IKASI, agar mahasiswa dapat fokus menyelesaikan pendidikan tanpa terbebani masalah biaya.",
  tentang_visi: "Menjadi jembatan nyata antara alumni dan mahasiswa Teknik Sipil dalam mewujudkan pendidikan yang merata dan berkelanjutan.",
  tentang_misi: "Meringankan beban tunggakan UKT mahasiswa Teknik Sipil yang berprestasi dan bersungguh-sungguh.\nMenghimpun kepedulian alumni, perusahaan, dan donatur untuk berkontribusi nyata.\nMendorong mahasiswa agar dapat fokus menyelesaikan pendidikan tanpa terbebani masalah biaya.",
  // Tujuan Program
  tujuan_eyebrow: "Tujuan Program",
  tujuan_judul: "Tujuan Program",
  tujuan_lede: "Program ini dirancang dengan tujuan yang terukur, bukan sekadar bantuan sesaat.",
  tujuan_goals: "Memberdayakan Generasi Penerus | Membuka akses pendidikan yang lebih luas bagi mahasiswa Teknik Sipil melalui dukungan biaya yang berkelanjutan.\nMembangun Jaringan Alumni | Memperkuat jaringan alumni yang kuat dan berkelanjutan sebagai fondasi kontribusi jangka panjang bagi almamater.\nMeningkatkan Kualitas SDM | Menyiapkan lulusan Teknik Sipil yang kompeten dan siap berkontribusi di dunia kerja maupun masyarakat.\nDampak Sosial Berkelanjutan | Turut mendorong dampak sosial dan pembangunan berkelanjutan melalui investasi pada pendidikan generasi muda.",
  // Data & Fakta
  fakta_eyebrow: "Tingkat Kebutuhan Beasiswa Mahasiswa",
  fakta_judul: "Seberapa besar kebutuhannya?",
  fakta_lede: "Berdasarkan survei tingkat kebutuhan beasiswa mahasiswa jurusan Teknik Sipil Polban dan sinkronisasi data tunggakan dari Bidang Keuangan Polban. Diperoleh data sebagai berikut :",
  insight1_judul: "Survey Kebutuhan Beasiswa",
  insight1_sub: "Periode M1 April – M4 Mei 2026",
  insight1_list: "398 mhs | berminat mendapatkan beasiswa (96,4%)\n215 mhs | pernah/sedang terkendala UKT (52,1%)\n83,8% | akan memakai beasiswa untuk pembayaran UKT — hambatan finansial utama mahasiswa",
  insight2_judul: "Status Tunggakan Mahasiswa",
  insight2_sub: "Sumber: Bidang Keuangan Polban, Mei 2026",
  insight2_list: "131 mhs | Program Studi D3 & D4 aktif memiliki tunggakan UKT\nRp 363,2 jt | total tunggakan UKT dari 131 mahasiswa tersebut",
  fakta_callout: "Berdasarkan sinkronisasi data survei dengan data tunggakan Bidang Keuangan, beasiswa diprioritaskan bagi 34 mahasiswa tingkat akhir dengan total tunggakan senilai Rp 99.000.000.",
  // Sistematika Beasiswa
  sistematika_eyebrow: "Sistematika Beasiswa",
  sistematika_judul: "Rencana sistem Beasiswa",
  sistematika_lede: "Program ini diprioritaskan bagi mahasiswa tingkat akhir yang berisiko terhambat kelulusannya karena kendala finansial. Dana beasiswa diharapkan dapat dikembalikan setelah penerima bekerja — penuh atau dicicil, maksimal 12 bulan — agar dapat digunakan kembali untuk mahasiswa lain. Periode program: April 2026 – Februari 2027.",
  // Timeline Program
  timeline_eyebrow: "Timeline",
  timeline_judul: "Timeline Program Beasiswa Alumni",
  progress_label: "5 dari 12 tahap telah selesai",
  progress_percent: "42",
  done_list: "Pembentukan Program Beasiswa IKASI\nSurvey kebutuhan beasiswa ke 413 mahasiswa Teknik Sipil Polban\nPengajuan data tunggakan mahasiswa ke Manajemen Polban\nSinkronisasi data tunggakan dengan hasil survey\nSurvey mata pencaharian orang tua mahasiswa",
  timeline_items: "Agustus 2026 | Akan Datang | Pengumpulan Sumber Dana | Mulai Agustus minggu ke-1 — dimungkinkan dilaksanakan bertahap (per batch) menyesuaikan kebutuhan dana. | ya\nAgustus 2026 | Akan Datang | Pengumpulan Formulir Data Diri & Keuangan Orang Tua | Pengumpulan berkas dari calon penerima beasiswa. | tidak\nAgustus 2026 | Direncanakan | Verifikasi Administrasi | Pemeriksaan kelengkapan dan keabsahan berkas calon penerima. | tidak\nAgustus 2026 | Direncanakan | Wawancara Calon Penerima Beasiswa | Sesi wawancara oleh tim pelaksana untuk penilaian akhir. | tidak\nSeptember 2026 | Direncanakan | Penetapan Penerima Beasiswa | Penentuan akhir daftar mahasiswa penerima beasiswa. | tidak\nSeptember 2026 | Direncanakan | Pengumuman Penerima Beasiswa | Publikasi resmi daftar penerima kepada seluruh pemangku kepentingan. | tidak\nOkt 2026 – Feb 2027 | Direncanakan | Penyaluran Beasiswa | Pencairan dana beasiswa mengikuti masuk kuliah semester ganjil. | tidak",
  // Anggaran (Teks Pendukung)
  anggaran_eyebrow: "Pemasukan Dana Program Beasiswa",
  anggaran_judul: "Update Dana Terkumpul",
  anggaran_lede: "Beasiswa diprioritaskan bagi mahasiswa tingkat akhir yang memiliki tunggakan UKT atau uang pangkal berpotensi menghambat kelulusan — jumlah penerima disesuaikan berdasarkan dana yang terkumpul.",
  rekening_judul: "Rekening Resmi IKASI",
  kode_unik: "11",
  rekening_desc: "Dana disalurkan melalui rekening resmi berikut dan dikelola secara transparan dengan laporan berkala kepada seluruh donatur.",
  anggaran_note: "Di luar 34 mahasiswa tingkat akhir prioritas ini, total tunggakan UKT seluruh mahasiswa aktif Program Studi D3/D4 tercatat Rp 363.237.500 (131 mahasiswa) — gambaran skala kebutuhan yang lebih luas untuk keberlanjutan program ke depan.",
  // Bagian Tambahan (Custom)
  tambahan_eyebrow: "Informasi Tambahan",
  tambahan_judul: "Informasi Tambahan",
  custom_sections: "",
  // Kontak & Footer
  kontak_eyebrow: "Kontak",
  kontak_judul: "Mari berdiskusi lebih lanjut",
  kontak_lede: "Terima kasih atas perhatiannya. Kami sangat mengharapkan dukungan serta partisipasi akang-teteh dalam program ini. Tim kami siap menjelaskan lebih detail mengenai skema kemitraan dan laporan keuangan program.",
  pic_nama: "IKASI Office",
  pic_title: "Ikatan Alumni Teknik Sipil Poli ITB – Polban",
  kontak_wa: "0812-3468-1730 (WhatsApp)",
  kontak_email: "ikasioffice@gmail.com",
  kontak_ig: "@ikasi.piliitb.polban",
  footer_tagline: "Dipersembahkan oleh Tim Beasiswa Alumni Tahun 2026",
};

/** Nomor tujuan tautan WhatsApp (teks yang tampil diatur lewat kontak_wa). */
export const WA_NUMBER = "6281234681730";

/** Detail rekening; statis di microsite lama, bukan bagian dari skema konten. */
export const REKENING_BANK = "BSI a.n. IKASI POLBAN";
export const REKENING_NOMOR = "1982320247";

export type Konten = Record<string, string>;

/** Nilai konten: pakai override admin bila ada isinya, kalau tidak pakai bawaan. */
export function teks(c: Konten, key: string): string {
  const v = c[key];
  return v != null && v.trim() !== "" ? v : (DEFAULTS[key] ?? "");
}

/** Pecah nilai multi-baris jadi array, buang baris kosong. */
export function baris(c: Konten, key: string): string[] {
  return teks(c, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Pecah tiap baris pada tanda | jadi kolom. */
export function kolom(c: Konten, key: string): string[][] {
  return baris(c, key).map((l) => l.split("|").map((x) => x.trim()));
}

export type TimelineItem = {
  tanggal: string;
  status: string;
  judul: string;
  desc: string;
  aktif: boolean;
};

/** Format: tanggal | status | judul | deskripsi | aktif(ya/tidak) */
export function timeline(c: Konten): TimelineItem[] {
  return kolom(c, "timeline_items").map((p) => ({
    tanggal: p[0] ?? "",
    status: p[1] ?? "",
    judul: p[2] ?? "",
    desc: p[3] ?? "",
    aktif: (p[4] ?? "").toLowerCase() === "ya",
  }));
}

/**
 * Naikkan nominal donasi ke angka terdekat yang berakhiran kode unik, mengikuti
 * konvensi lama IKASI: "kirim donasi dengan nominal diakhiri angka 11 sebagai
 * kode pendataan" (contoh Rp50.011). Kode unik membuat admin bisa mencocokkan
 * mutasi rekening dengan baris donasi yang masuk.
 *
 * Selalu MEMBULATKAN KE ATAS, jadi donatur tidak pernah diminta mentransfer
 * kurang dari yang ia niatkan; tambahannya paling banyak sebesar 10^digit.
 *
 * Kode diatur lewat field `kode_unik` di /admin/beasiswa. Dikosongkan =
 * fitur mati, nominal dipakai apa adanya.
 */
export function nominalDenganKode(base: number, kode: string): number {
  const digit = (kode ?? "").replace(/\D/g, "");
  if (!digit || base <= 0) return base;
  const kelipatan = 10 ** digit.length; // "11" -> 100
  const akhiran = Number(digit);
  const kandidat = Math.floor(base / kelipatan) * kelipatan + akhiran;
  return kandidat >= base ? kandidat : kandidat + kelipatan;
}

/** Persentase progres tahapan, dijepit ke rentang 0-100. */
export function persenProgres(c: Konten): number {
  const n = Number(teks(c, "progress_percent"));
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}
