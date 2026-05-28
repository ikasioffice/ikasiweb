import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

export type AlumniRow = Database["public"]["Tables"]["alumni"]["Row"];
export type DeletionRow = Database["public"]["Tables"]["alumni_deletions"]["Row"];
export type BisnisRef = { id: string; nama_brand: string | null };
export type DeleteResult =
  | { ok: true; deletion_id: string }
  | { ok: false; blocked: "bisnis"; bisnis: BisnisRef[] }
  | { ok: false; error: string };

export async function fetchAllAlumni(): Promise<AlumniRow[]> {
  const { data, error } = await createClient().rpc("admin_list_alumni");
  if (error) throw error;
  return (data ?? []) as AlumniRow[];
}

export async function deleteAlumni(
  id: string, reason?: string, reassigned?: unknown,
): Promise<DeleteResult> {
  const { data, error } = await createClient().rpc("admin_delete_alumni", {
    p_alumni_id: id, p_reason: reason ?? undefined, p_reassigned: (reassigned ?? null) as never,
  });
  if (error) throw error;
  return data as unknown as DeleteResult;
}

export async function reassignBisnis(fromId: string, toId: string): Promise<{ ok: true; moved: number }> {
  const { data, error } = await createClient().rpc("admin_reassign_bisnis", { p_from: fromId, p_to: toId });
  if (error) throw error;
  return data as unknown as { ok: true; moved: number };
}

export async function restoreAlumni(deletionId: string): Promise<{ ok: boolean; restored_id?: string; error?: string }> {
  const { data, error } = await createClient().rpc("admin_restore_alumni", { p_deletion_id: deletionId });
  if (error) throw error;
  return data as unknown as { ok: boolean; restored_id?: string; error?: string };
}

export async function listDeletions(): Promise<DeletionRow[]> {
  const { data, error } = await createClient()
    .from("alumni_deletions").select("*").order("deleted_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DeletionRow[];
}
