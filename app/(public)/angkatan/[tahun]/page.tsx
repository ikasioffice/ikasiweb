import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { AngkatanDetailClient } from "./angkatan-detail-client";

export async function generateStaticParams() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase.from("alumni_public").select("angkatan");
  const tahunSet = new Set((data ?? []).map((r) => r.angkatan).filter(Boolean));
  return Array.from(tahunSet).map((t) => ({ tahun: String(t) }));
}

export default function AngkatanDetailPage({ params }: { params: Promise<{ tahun: string }> }) {
  return <AngkatanDetailClient paramsPromise={params} />;
}
