import type { Database } from "@/lib/supabase/database.types";

export type Alumni = Database["public"]["Tables"]["alumni"]["Row"];

export type FieldType = "text" | "number" | "boolean" | "date" | "tags" | "readonly";
export type GroupKey = "identitas" | "pekerjaan" | "keanggotaan" | "tanggal" | "lainnya";

export type Field = {
  key: keyof Alumni;
  label: string;
  type: FieldType;
  group: GroupKey;
  /** Tampil sebagai kolom di tabel database. */
  table?: boolean;
};

export const GROUP_LABELS: Record<GroupKey, string> = {
  identitas: "Identitas",
  pekerjaan: "Pekerjaan",
  keanggotaan: "Keanggotaan",
  tanggal: "Tanggal",
  lainnya: "Lainnya",
};

/** Urutan grup yang dipakai untuk toggle kolom tabel. */
export const TABLE_GROUPS: GroupKey[] = ["identitas", "pekerjaan", "keanggotaan", "tanggal"];

export const FIELDS: Field[] = [
  // — Identitas —
  { key: "nama", label: "Nama", type: "text", group: "identitas", table: true },
  { key: "angkatan", label: "Angkatan", type: "number", group: "identitas", table: true },
  { key: "prodi", label: "Prodi", type: "text", group: "identitas", table: true },
  { key: "email", label: "Email", type: "text", group: "identitas", table: true },
  { key: "no_hp", label: "No HP", type: "text", group: "identitas", table: true },
  { key: "is_verified", label: "Terverifikasi", type: "boolean", group: "identitas", table: true },
  { key: "jenis_kelamin", label: "Jenis Kelamin", type: "text", group: "identitas" },
  { key: "tanggal_lahir", label: "Tanggal Lahir", type: "date", group: "identitas" },
  { key: "pendidikan_terakhir", label: "Pendidikan Terakhir", type: "text", group: "identitas" },
  { key: "institusi", label: "Institusi", type: "text", group: "identitas" },

  // — Pekerjaan —
  { key: "tempat_kerja", label: "Tempat Kerja", type: "text", group: "pekerjaan", table: true },
  { key: "jabatan", label: "Jabatan", type: "text", group: "pekerjaan", table: true },
  { key: "bidang_pekerjaan", label: "Bidang Pekerjaan", type: "text", group: "pekerjaan", table: true },
  { key: "domisili", label: "Domisili", type: "text", group: "pekerjaan", table: true },

  // — Keanggotaan —
  { key: "kta_status", label: "Status KTA", type: "text", group: "keanggotaan", table: true },
  { key: "nomor_anggota", label: "Nomor Anggota", type: "text", group: "keanggotaan", table: true },
  { key: "punya_ska", label: "Punya SKA", type: "boolean", group: "keanggotaan", table: true },
  { key: "has_kta", label: "Has KTA", type: "boolean", group: "keanggotaan" },
  { key: "kta_kategori", label: "Kategori KTA", type: "text", group: "keanggotaan" },
  { key: "kta_nominal", label: "Nominal KTA", type: "text", group: "keanggotaan" },
  { key: "kta_tanggal", label: "Tanggal KTA", type: "text", group: "keanggotaan" },
  { key: "kta_pengambilan", label: "Pengambilan KTA", type: "text", group: "keanggotaan" },
  { key: "has_nomor_anggota", label: "Has Nomor Anggota", type: "boolean", group: "keanggotaan" },
  { key: "bidang_ska", label: "Bidang SKA", type: "text", group: "keanggotaan" },
  { key: "bersedia_kp", label: "Bersedia KP", type: "boolean", group: "keanggotaan" },
  { key: "bersedia_pengurus", label: "Bersedia Pengurus", type: "boolean", group: "keanggotaan" },
  { key: "bersedia_dosen_tamu", label: "Bersedia Dosen Tamu", type: "text", group: "keanggotaan" },
  { key: "ikut_s2_polban", label: "Ikut S2 Polban", type: "text", group: "keanggotaan" },

  // — Tanggal —
  { key: "tahun_lulus", label: "Tahun Lulus", type: "number", group: "tanggal", table: true },
  { key: "created_at", label: "Dibuat", type: "readonly", group: "tanggal", table: true },
  { key: "updated_at", label: "Diupdate", type: "readonly", group: "tanggal", table: true },

  // — Lainnya —
  { key: "minat_hobi", label: "Minat / Hobi", type: "tags", group: "lainnya" },
  { key: "foto_url", label: "Foto URL", type: "text", group: "lainnya" },
  { key: "is_form_filled", label: "Form Terisi", type: "boolean", group: "lainnya" },
  { key: "source_layer", label: "Source Layer", type: "readonly", group: "lainnya" },
  { key: "auth_user_id", label: "Auth User ID", type: "readonly", group: "lainnya" },
  { key: "id", label: "ID", type: "readonly", group: "lainnya" },
];

export const TABLE_FIELDS = FIELDS.filter((f) => f.table);

/** Format nilai cell untuk ditampilkan di tabel (read-only). */
export function formatCell(field: Field, value: Alumni[keyof Alumni]): string {
  if (value == null || value === "") return "—";
  if (field.type === "boolean") return value ? "Ya" : "Tidak";
  if (field.type === "date" || field.type === "readonly") {
    const s = String(value);
    // ISO timestamp / tanggal → tampilkan yyyy-mm-dd saja
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    return s;
  }
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
