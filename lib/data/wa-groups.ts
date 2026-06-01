import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

export type WaGroup = Database["public"]["Tables"]["wa_groups"]["Row"];
export type WaGroupInsert = Database["public"]["Tables"]["wa_groups"]["Insert"];
export type WaGroupUpdate = Database["public"]["Tables"]["wa_groups"]["Update"];

export async function listWaGroups(): Promise<WaGroup[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("wa_groups")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("name")
    .limit(100);
  return data ?? [];
}

// --- Admin: butuh policy admin-write (lihat migration 002) ---

export async function listAllWaGroups(): Promise<WaGroup[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("wa_groups")
    .select("*")
    .order("category")
    .order("name");
  return data ?? [];
}

export async function getWaGroupById(id: string): Promise<WaGroup | null> {
  const supabase = createClient();
  const { data } = await supabase.from("wa_groups").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function createWaGroup(input: WaGroupInsert): Promise<{ data: WaGroup | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase.from("wa_groups").insert(input).select().single();
  return { data, error: error?.message ?? null };
}

export async function updateWaGroup(id: string, input: WaGroupUpdate): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("wa_groups").update(input).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteWaGroup(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("wa_groups").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function setWaGroupActive(id: string, isActive: boolean): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("wa_groups").update({ is_active: isActive }).eq("id", id);
  return { error: error?.message ?? null };
}

export function groupByCategory(groups: WaGroup[]): Map<string, WaGroup[]> {
  const map = new Map<string, WaGroup[]>();
  for (const g of groups) {
    const existing = map.get(g.category) ?? [];
    existing.push(g);
    map.set(g.category, existing);
  }
  return map;
}
