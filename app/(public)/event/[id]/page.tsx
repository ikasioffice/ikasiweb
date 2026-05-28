import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { EventDetailClient } from "./event-detail-client";

export async function generateStaticParams() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase.from("events").select("id").eq("is_published", true);
  const ids = (data ?? []).map((r) => ({ id: String(r.id) }));
  return ids.length > 0 ? ids : [{ id: "_" }];
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <EventDetailClient paramsPromise={params} />;
}
