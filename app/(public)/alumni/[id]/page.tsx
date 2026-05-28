import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { AlumniDetailClient } from "./alumni-detail-client";

// Pre-generate static shells for all alumni IDs at build time.
// New alumni added after deploy: .htaccess → /index.html → client router.
export async function generateStaticParams() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase.from("alumni_public").select("id").limit(2000);
  return (data ?? []).map((r) => ({ id: String(r.id) }));
}

export default function AlumniDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <AlumniDetailClient paramsPromise={params} />;
}
