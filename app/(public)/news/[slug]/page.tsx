import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { NewsDetailClient } from "./news-detail-client";

export async function generateStaticParams() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase.from("posts").select("slug").eq("is_published", true);
  return (data ?? []).map((r) => ({ slug: r.slug }));
}

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <NewsDetailClient paramsPromise={params} />;
}
