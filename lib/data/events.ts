import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"];

export async function listPublishedEvents(): Promise<Event[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false })
    .limit(50);
  return data ?? [];
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = createClient();
  const { data } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function rsvpEvent(eventId: string, userId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("rsvps").insert({ event_id: eventId, user_id: userId });
  return !error;
}

export async function hasRsvped(eventId: string, userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("rsvps")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}
