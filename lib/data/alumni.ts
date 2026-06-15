import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

export type AlumniPublic = Database["public"]["Views"]["alumni_public"]["Row"];

export type AlumniFilter = {
  query?: string;
  angkatan?: number;
  prodi?: string;
  domisili?: string;
  bidang_pekerjaan?: string;
};

export function matchesAlumniFilter(a: AlumniPublic, f: AlumniFilter): boolean {
  if (f.query) {
    const q = f.query.toLowerCase();
    const hay = [a.nama, a.tempat_kerja, a.jabatan, a.bidang_pekerjaan]
      .filter(Boolean)
      .map((v) => String(v).toLowerCase())
      .join(" ");
    if (!hay.includes(q)) return false;
  }
  if (f.angkatan && a.angkatan !== f.angkatan) return false;
  if (f.prodi && a.prodi !== f.prodi) return false;
  if (f.domisili && a.domisili !== f.domisili) return false;
  if (f.bidang_pekerjaan && a.bidang_pekerjaan !== f.bidang_pekerjaan) return false;
  return true;
}

export async function listAlumniPublic(): Promise<AlumniPublic[]> {
  const supabase = createClient();
  const PAGE = 1000;
  const all: AlumniPublic[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("alumni_public")
      .select("*")
      .order("angkatan", { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  return all;
}

export async function getAlumniById(id: string): Promise<AlumniPublic | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("alumni_public")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAlumniContact(
  id: string,
): Promise<{ email: string | null; no_hp: string | null } | null> {
  const supabase = createClient();

  // Baris sendiri atau admin: RLS mengizinkan baca penuh (email + no_hp).
  const { data: own } = await supabase
    .from("alumni")
    .select("email, no_hp")
    .eq("id", id)
    .maybeSingle();
  if (own) return own;

  // Alumni terverifikasi melihat alumni lain: hanya EMAIL (via fungsi DB),
  // no_hp tidak diekspos. Non-terverifikasi/anon menerima null.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: email } = await (supabase as any).rpc("get_alumni_email", { p_id: id });
  return { email: (email as string | null) ?? null, no_hp: null };
}
