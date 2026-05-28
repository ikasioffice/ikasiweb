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
  const { data, error } = await supabase
    .from("alumni_public")
    .select("*")
    .order("angkatan", { ascending: false })
    .limit(500);
  if (error) throw error;
  return data ?? [];
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
  const { data, error } = await supabase
    .from("alumni")
    .select("email, no_hp")
    .eq("id", id)
    .maybeSingle();
  if (error) return null;
  return data;
}
