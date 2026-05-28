import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { BisnisDetailClient } from "./bisnis-detail-client";

export async function generateStaticParams() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase.from("bisnis").select("id").limit(500);
  return (data ?? []).map((r) => ({ id: String(r.id) }));
}

export default function BisnisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <BisnisDetailClient paramsPromise={params} />;
}
