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
  const PAGE = 1000;
  const ids: string[] = [];
  let from = 0;
  while (true) {
    const { data } = await supabase
      .from("alumni_public")
      .select("id")
      .range(from, from + PAGE - 1);
    if (!data || data.length === 0) break;
    ids.push(...data.map((r) => String(r.id)));
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return ids.map((id) => ({ id }));
}

export default function AlumniDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <AlumniDetailClient paramsPromise={params} />;
}
