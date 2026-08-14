/**
 * Teks halaman /beasiswa yang bisa ditimpa admin.
 *
 * Skema ini menyalin CONTENT_SCHEMA dari admin.html microsite lama (53 field,
 * 9 grup) supaya admin yang sudah terbiasa menemukan field yang sama persis.
 * Diekstrak langsung dari sumbernya, bukan disalin tangan.
 *
 * Field bertipe list/timeline/sections diedit sebagai textarea multi-baris.
 * Admin lama memakai editor baris-per-baris; format datanya identik, hanya
 * cara mengetiknya yang berbeda -- lihat hint tiap field.
 *
 * Teks bawaan tiap field ada di app/(public)/beasiswa/_content.ts. Field yang
 * dikosongkan berarti halaman memakai teks bawaan itu.
 */

export type FieldType = "text" | "textarea" | "list" | "timeline" | "sections";

export type ContentField = {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  rows?: number;
};

export type ContentGroup = {
  title: string;
  fields: ContentField[];
};

export const CONTENT_GROUPS: ContentGroup[] = [
  {
    title: "Hero (Bagian Paling Atas)",
    fields: [
      { key: "hero_eyebrow", label: "Label kecil di atas judul", type: "text" },
      { key: "hero_title_line1", label: "Judul baris 1", type: "text" },
      { key: "hero_title_line2", label: "Judul baris 2 (tampil warna emas)", type: "text" },
      { key: "hero_tagline", label: "Kalimat pembuka", type: "textarea", rows: 3 },
    ],
  },
  {
    title: "Tentang Program",
    fields: [
      { key: "tentang_eyebrow", label: "Label kecil", type: "text" },
      { key: "tentang_judul", label: "Judul section", type: "text" },
      { key: "tentang_latar_judul", label: "Judul kartu latar belakang", type: "text" },
      { key: "tentang_latar_isi", label: "Isi latar belakang", type: "textarea", rows: 3 },
      { key: "tentang_copy_1", label: "Paragraf pembuka 1", type: "textarea", rows: 3 },
      { key: "tentang_copy_2", label: "Paragraf pembuka 2", type: "textarea", rows: 3 },
      { key: "tentang_visi", label: "Visi", type: "textarea", rows: 3 },
      { key: "tentang_misi", label: "Misi", type: "list", hint: "Satu baris = satu poin misi. Tambah/hapus baris untuk menambah/mengurangi jumlah poin.", rows: 6 },
    ],
  },
  {
    title: "Tujuan Program",
    fields: [
      { key: "tujuan_eyebrow", label: "Label kecil", type: "text" },
      { key: "tujuan_judul", label: "Judul section", type: "text" },
      { key: "tujuan_lede", label: "Kalimat pembuka", type: "textarea", rows: 3 },
      { key: "tujuan_goals", label: "Daftar tujuan", type: "list", hint: "Format per baris: Judul | Deskripsi. Tambah/hapus baris untuk menambah/mengurangi kartu tujuan.", rows: 6 },
    ],
  },
  {
    title: "Data & Fakta",
    fields: [
      { key: "fakta_eyebrow", label: "Label kecil", type: "text" },
      { key: "fakta_judul", label: "Judul section", type: "text" },
      { key: "fakta_lede", label: "Kalimat pembuka", type: "textarea", rows: 3 },
      { key: "insight1_judul", label: "Judul kartu data 1", type: "text" },
      { key: "insight1_sub", label: "Sub-label kartu data 1", type: "text" },
      { key: "insight1_list", label: "Daftar data kartu 1", type: "list", hint: "Format per baris: Nilai | Deskripsi", rows: 6 },
      { key: "insight2_judul", label: "Judul kartu data 2", type: "text" },
      { key: "insight2_sub", label: "Sub-label kartu data 2", type: "text" },
      { key: "insight2_list", label: "Daftar data kartu 2", type: "list", hint: "Format per baris: Nilai | Deskripsi", rows: 6 },
      { key: "fakta_callout", label: "Kotak sorotan (highlight)", type: "textarea", rows: 3 },
    ],
  },
  {
    title: "Sistematika Beasiswa",
    fields: [
      { key: "sistematika_eyebrow", label: "Label kecil", type: "text" },
      { key: "sistematika_judul", label: "Judul section", type: "text" },
      { key: "sistematika_lede", label: "Isi paragraf", type: "textarea", rows: 3 },
    ],
  },
  {
    title: "Timeline Program",
    fields: [
      { key: "timeline_eyebrow", label: "Label kecil", type: "text" },
      { key: "timeline_judul", label: "Judul section", type: "text" },
      { key: "progress_label", label: "Teks ringkasan progres", type: "text" },
      { key: "progress_percent", label: "Persentase progres (angka saja, 0-100)", type: "text" },
      { key: "done_list", label: "Daftar yang sudah diselesaikan", type: "list", hint: "Satu baris = satu poin.", rows: 6 },
      { key: "timeline_items", label: "Tahapan timeline", type: "timeline", hint: "Satu tahap per baris, dipisah tanda | — tanggal | status | judul | deskripsi | aktif(ya/tidak)", rows: 8 },
    ],
  },
  {
    title: "Anggaran (Teks Pendukung)",
    fields: [
      { key: "anggaran_eyebrow", label: "Label kecil", type: "text" },
      { key: "anggaran_judul", label: "Judul section", type: "text" },
      { key: "anggaran_lede", label: "Kalimat pembuka", type: "textarea", rows: 3 },
      { key: "rekening_judul", label: "Judul kotak rekening", type: "text" },
      { key: "rekening_desc", label: "Deskripsi kotak rekening", type: "textarea", rows: 3 },
      { key: "anggaran_note", label: "Catatan tambahan di bawah", type: "textarea", rows: 3 },
    ],
  },
  {
    title: "Bagian Tambahan (Custom)",
    fields: [
      { key: "tambahan_eyebrow", label: "Label kecil bagian tambahan", type: "text" },
      { key: "tambahan_judul", label: "Judul bagian tambahan", type: "text" },
      { key: "custom_sections", label: "Daftar kartu/bagian baru", type: "sections", hint: "Satu kartu per baris, dipisah tanda | — judul | isi. Kosongkan untuk menyembunyikan bagian ini.", rows: 5 },
    ],
  },
  {
    title: "Kontak & Footer",
    fields: [
      { key: "kontak_eyebrow", label: "Label kecil", type: "text" },
      { key: "kontak_judul", label: "Judul section", type: "text" },
      { key: "kontak_lede", label: "Kalimat pembuka", type: "textarea", rows: 3 },
      { key: "pic_nama", label: "Nama PIC", type: "text" },
      { key: "pic_title", label: "Keterangan PIC", type: "text" },
      { key: "kontak_wa", label: "Teks nomor WhatsApp yang ditampilkan", type: "text", hint: "Hanya mengubah teks yang tampil, bukan nomor tujuan tautannya." },
      { key: "kontak_email", label: "Teks email yang ditampilkan", type: "text" },
      { key: "kontak_ig", label: "Teks Instagram yang ditampilkan", type: "text" },
      { key: "footer_tagline", label: "Tagline di footer", type: "text" },
    ],
  },
];

export const ALL_CONTENT_KEYS: string[] = CONTENT_GROUPS.flatMap((g) =>
  g.fields.map((f) => f.key),
);
