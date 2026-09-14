import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

export type SalurunPendaftaran = Database["public"]["Tables"]["salurun_pendaftaran"]["Row"];
export type SalurunPendaftaranInsert = Database["public"]["Tables"]["salurun_pendaftaran"]["Insert"];
export type SalurunPendaftaranUpdate = Database["public"]["Tables"]["salurun_pendaftaran"]["Update"];
export type SalurunRekap = Database["public"]["Views"]["salurun_rekap"]["Row"];
export type SalurunPesertaPublik = Database["public"]["Views"]["salurun_pendaftaran_public"]["Row"];

export type Kategori = "mahasiswa" | "alumni";
export type UkuranJersey = "S" | "M" | "L" | "XL" | "XXL";
export type Metode = "Transfer Bank" | "QRIS";

const BUCKET_BUKTI = "salurun-bukti";

/** Biaya pendaftaran tetap per kategori (Rp), sudah termasuk jersey + refreshment. */
export const BIAYA: Record<Kategori, number> = {
  mahasiswa: 82_000,
  alumni: 119_000,
};

export const KATEGORI_LABEL: Record<Kategori, string> = {
  mahasiswa: "Mahasiswa",
  alumni: "Alumni",
};

// ============================================================
// Publik (anon)
// ============================================================

/** Jumlah peserta terverifikasi untuk halaman publik. */
export async function getRekap(): Promise<SalurunRekap | null> {
  const supabase = createClient();
  const { data } = await supabase.from("salurun_rekap").select("*").maybeSingle();
  return data;
}

/**
 * Daftar peserta untuk halaman publik. Sengaja lewat view: tabel aslinya
 * tidak punya policy SELECT untuk anon karena memuat PII (lihat migration
 * 008). Hanya nama + angkatan + kategori dari peserta terverifikasi.
 */
export async function listPesertaPublik(): Promise<SalurunPesertaPublik[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("salurun_pendaftaran_public")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  return data ?? [];
}

/**
 * Kiriman form /salurun/daftar. RLS memaksa is_verified = false.
 *
 * JANGAN menambahkan .select() di sini. anon sengaja tidak punya policy
 * SELECT pada salurun_pendaftaran, dan INSERT ... RETURNING membutuhkannya --
 * hasilnya gagal dengan pesan menyesatkan "new row violates row-level
 * security policy". Insert tanpa RETURNING adalah yang benar.
 */
export async function kirimPendaftaran(
  input: Omit<SalurunPendaftaranInsert, "is_verified">,
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("salurun_pendaftaran")
    .insert({ ...input, is_verified: false });
  return { error: error?.message ?? null };
}

/**
 * Unggah bukti transfer ke bucket privat, kembalikan path-nya untuk disimpan
 * di kolom bukti_path. Anon boleh menulis tapi tidak boleh membaca kembali.
 */
export async function unggahBukti(file: File): Promise<{ path: string | null; error: string | null }> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET_BUKTI)
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  return { path: error ? null : path, error: error?.message ?? null };
}

// ============================================================
// Admin (butuh policy admin-write di migration 008)
// ============================================================

export async function listSemuaPendaftaran(): Promise<SalurunPendaftaran[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("salurun_pendaftaran")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function tambahPendaftaranManual(
  input: SalurunPendaftaranInsert,
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("salurun_pendaftaran").insert(input);
  return { error: error?.message ?? null };
}

export async function updatePendaftaran(
  id: string,
  input: SalurunPendaftaranUpdate,
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("salurun_pendaftaran").update(input).eq("id", id);
  return { error: error?.message ?? null };
}

export async function setPendaftaranVerified(
  id: string,
  isVerified: boolean,
): Promise<{ error: string | null }> {
  return updatePendaftaran(id, { is_verified: isVerified });
}

export async function hapusPendaftaran(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("salurun_pendaftaran").delete().eq("id", id);
  return { error: error?.message ?? null };
}

/** Bucket bukti bersifat privat, jadi admin membacanya lewat signed URL. */
export async function getBuktiSignedUrl(
  path: string,
  expiresInSeconds = 300,
): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.storage
    .from(BUCKET_BUKTI)
    .createSignedUrl(path, expiresInSeconds);
  return data?.signedUrl ?? null;
}

// ============================================================
// Helper tampilan
// ============================================================

export function formatRupiah(n: number | null | undefined): string {
  return `Rp ${(Number(n) || 0).toLocaleString("id-ID")}`;
}
