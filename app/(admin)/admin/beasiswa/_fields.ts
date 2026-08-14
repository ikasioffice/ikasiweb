/**
 * Teks halaman /beasiswa yang boleh ditimpa admin.
 *
 * Microsite lama (Google Apps Script) membolehkan mengedit 54 field. Di sini
 * sengaja dipersempit ke field yang benar-benar berubah selama kampanye; prosa
 * panjang yang jarang berubah ditulis langsung di TSX halaman publik, mengikuti
 * cara halaman statis lain ditangani (sejarah, pengurus, ad-art, cara-bergabung).
 *
 * Menambah field cukup menambah entri di sini -- tabel beasiswa_content
 * berbentuk key/value sehingga tidak perlu perubahan skema.
 */

export type FieldType = "text" | "textarea" | "number";

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
    title: "Hero",
    fields: [
      {
        key: "hero_tagline",
        label: "Tagline hero",
        type: "textarea",
        rows: 2,
        hint: "Kalimat pembuka di bawah judul besar. Kosongkan untuk memakai teks bawaan.",
      },
    ],
  },
  {
    title: "Progres Program",
    fields: [
      {
        key: "progress_label",
        label: "Label progres",
        type: "text",
        hint: 'Contoh: "Tahap persiapan penyaluran".',
      },
      {
        key: "progress_percent",
        label: "Persentase progres",
        type: "number",
        hint: "0-100. Ini progres tahapan program, bukan progres dana (dana dihitung otomatis).",
      },
      {
        key: "done_list",
        label: "Daftar yang sudah selesai",
        type: "textarea",
        rows: 5,
        hint: "Satu item per baris.",
      },
      {
        key: "timeline_items",
        label: "Item timeline",
        type: "textarea",
        rows: 7,
        hint: "Satu item per baris, dipisah tanda | — tanggal|status|judul|deskripsi|aktif(ya/tidak)",
      },
    ],
  },
  {
    title: "Data & Fakta",
    fields: [
      {
        key: "fakta_callout",
        label: "Kalimat sorotan",
        type: "textarea",
        rows: 3,
        hint: "Kotak penekanan di akhir bagian Data & Fakta.",
      },
    ],
  },
  {
    title: "Anggaran & Rekening",
    fields: [
      { key: "rekening_judul", label: "Judul kartu rekening", type: "text" },
      {
        key: "rekening_desc",
        label: "Detail rekening",
        type: "textarea",
        rows: 4,
        hint: "Nomor rekening, atas nama, dan bank. Satu baris per informasi.",
      },
      {
        key: "anggaran_note",
        label: "Catatan anggaran",
        type: "textarea",
        rows: 3,
      },
    ],
  },
  {
    title: "Kontak",
    fields: [
      { key: "pic_nama", label: "Nama PIC", type: "text" },
      { key: "pic_title", label: "Jabatan PIC", type: "text" },
      { key: "kontak_wa", label: "Nomor WhatsApp", type: "text", hint: "Format tampilan, contoh: +62 812-3468-1730" },
      { key: "kontak_email", label: "Email", type: "text" },
      { key: "kontak_ig", label: "Instagram", type: "text", hint: "Contoh: @ikasi.poliitb.polban" },
    ],
  },
];

export const ALL_CONTENT_KEYS: string[] = CONTENT_GROUPS.flatMap((g) =>
  g.fields.map((f) => f.key),
);
