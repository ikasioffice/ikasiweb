import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { WaGroupEditorPage } from "./wa-group-editor-client";

export async function generateStaticParams() {
  // Always include "new" for the create route
  const shells: { id: string }[] = [{ id: "new" }];
  // Add existing group IDs so direct navigation works without SPA fallback
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase.from("wa_groups").select("id");
  (data ?? []).forEach((r) => shells.push({ id: r.id }));
  return shells;
}

export default function AdminWaGroupEditorPage({ params }: { params: Promise<{ id: string }> }) {
  return <WaGroupEditorPage params={params} />;
}
