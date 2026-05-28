import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

export type Bisnis = Database["public"]["Tables"]["bisnis"]["Row"];

export async function listBisnis(): Promise<Bisnis[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("bisnis")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  return data ?? [];
}

export async function getBisnisById(id: string): Promise<Bisnis | null> {
  const supabase = createClient();
  const { data } = await supabase.from("bisnis").select("*").eq("id", id).single();
  return data;
}

export async function getBisnisByAlumni(alumniId: string): Promise<Bisnis[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("bisnis")
    .select("*")
    .eq("alumni_id", alumniId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
