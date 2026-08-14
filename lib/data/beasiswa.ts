import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

export type BeasiswaDonasi = Database["public"]["Tables"]["beasiswa_donasi"]["Row"];
export type BeasiswaDonasiInsert = Database["public"]["Tables"]["beasiswa_donasi"]["Insert"];
export type BeasiswaDonasiUpdate = Database["public"]["Tables"]["beasiswa_donasi"]["Update"];
export type BeasiswaSettings = Database["public"]["Tables"]["beasiswa_settings"]["Row"];
export type BeasiswaDonaturPublik = Database["public"]["Views"]["beasiswa_donasi_public"]["Row"];
export type BeasiswaRekap = Database["public"]["Views"]["beasiswa_rekap"]["Row"];

/** Teks halaman yang boleh ditimpa admin; key yang tidak ada = pakai default di TSX. */
export type BeasiswaContent = Record<string, string>;

const BUCKET_BUKTI = "beasiswa-bukti";
const BUCKET_PUBLIK = "beasiswa-publik";

// ============================================================
// Publik (anon)
// ============================================================

/** Angka hero: target, terkumpul, jumlah donatur, dan link proposal. */
export async function getRekap(): Promise<BeasiswaRekap | null> {
  const supabase = createClient();
  const { data } = await supabase.from("beasiswa_rekap").select("*").maybeSingle();
  return data;
}

/**
 * Daftar donatur untuk halaman publik. Sengaja lewat view: tabel aslinya tidak
 * punya policy SELECT untuk anon karena memuat PII (lihat migration 007).
 */
export async function listDonaturPublik(): Promise<BeasiswaDonaturPublik[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("beasiswa_donasi_public")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  return data ?? [];
}

export async function getContent(): Promise<BeasiswaContent> {
  const supabase = createClient();
  const { data } = await supabase.from("beasiswa_content").select("key, value");
  const out: BeasiswaContent = {};
  for (const row of data ?? []) {
    if (row.value != null && row.value !== "") out[row.key] = row.value;
  }
  return out;
}

/**
 * Kiriman form /beasiswa/dukung. RLS memaksa is_verified = false.
 *
 * JANGAN menambahkan .select() di sini. anon sengaja tidak punya policy SELECT
 * pada beasiswa_donasi, dan INSERT ... RETURNING (yang dihasilkan .select())
 * membutuhkannya -- hasilnya gagal dengan pesan menyesatkan "new row violates
 * row-level security policy". Insert tanpa RETURNING adalah yang benar.
 */
export async function kirimDonasi(
  input: Omit<BeasiswaDonasiInsert, "is_verified">,
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("beasiswa_donasi")
    .insert({ ...input, is_verified: false });
  return { error: error?.message ?? null };
}

/**
 * Unggah bukti transfer ke bucket privat, kembalikan path-nya untuk disimpan di
 * kolom bukti_path. Anon boleh menulis tapi tidak boleh membaca kembali.
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
// Admin (butuh policy admin-write di migration 007)
// ============================================================

export async function listSemuaDonasi(): Promise<BeasiswaDonasi[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("beasiswa_donasi")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function tambahDonasiManual(
  input: BeasiswaDonasiInsert,
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("beasiswa_donasi").insert(input);
  return { error: error?.message ?? null };
}

export async function updateDonasi(
  id: string,
  input: BeasiswaDonasiUpdate,
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("beasiswa_donasi").update(input).eq("id", id);
  return { error: error?.message ?? null };
}

export async function setDonasiVerified(
  id: string,
  isVerified: boolean,
): Promise<{ error: string | null }> {
  return updateDonasi(id, { is_verified: isVerified });
}

export async function hapusDonasi(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("beasiswa_donasi").delete().eq("id", id);
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

export async function getSettings(): Promise<BeasiswaSettings | null> {
  const supabase = createClient();
  const { data } = await supabase.from("beasiswa_settings").select("*").eq("id", 1).maybeSingle();
  return data;
}

/** Hanya target_dana yang bisa diatur manual; dana terkumpul dihitung view. */
export async function setTargetDana(targetDana: number): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("beasiswa_settings")
    .update({ target_dana: targetDana })
    .eq("id", 1);
  return { error: error?.message ?? null };
}

export async function simpanContent(entries: BeasiswaContent): Promise<{ error: string | null }> {
  const supabase = createClient();
  const rows = Object.entries(entries).map(([key, value]) => ({ key, value }));
  if (rows.length === 0) return { error: null };
  const { error } = await supabase.from("beasiswa_content").upsert(rows, { onConflict: "key" });
  return { error: error?.message ?? null };
}

/**
 * Hapus override sehingga key kembali memakai teks bawaan dari TSX.
 *
 * Dipakai saat admin mengembalikan sebuah field ke nilai bawaannya: barisnya
 * dibuang, bukan disimpan sama persis dengan bawaan. Dengan begitu perubahan
 * teks bawaan di kode nanti tetap terlihat, dan tabelnya hanya berisi yang
 * benar-benar diubah.
 */
export async function hapusContent(keys: string[]): Promise<{ error: string | null }> {
  if (keys.length === 0) return { error: null };
  const supabase = createClient();
  const { error } = await supabase.from("beasiswa_content").delete().in("key", keys);
  return { error: error?.message ?? null };
}

export async function unggahProposal(
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();
  const path = `proposal-${Date.now()}.pdf`;
  const { error } = await supabase.storage
    .from(BUCKET_PUBLIK)
    .upload(path, file, { contentType: "application/pdf", upsert: true });
  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from(BUCKET_PUBLIK).getPublicUrl(path);
  const { error: updErr } = await supabase
    .from("beasiswa_settings")
    .update({ proposal_url: data.publicUrl, proposal_name: file.name })
    .eq("id", 1);
  return { url: data.publicUrl, error: updErr?.message ?? null };
}

// ============================================================
// Helper tampilan
// ============================================================

export function formatRupiah(n: number | null | undefined): string {
  return `Rp ${(Number(n) || 0).toLocaleString("id-ID")}`;
}

export function hitungPersen(terkumpul: number | null, target: number | null): number {
  const t = Number(target) || 0;
  if (t <= 0) return 0;
  return Math.min(100, Math.round(((Number(terkumpul) || 0) / t) * 100));
}
