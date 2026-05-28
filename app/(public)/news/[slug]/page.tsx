import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { NewsDetailClient } from "./news-detail-client";

export async function generateStaticParams() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase.from("posts").select("slug").eq("is_published", true);
  const slugs = (data ?? []).map((r) => ({ slug: r.slug }));
  // Always include a placeholder so Next.js accepts this dynamic route with output: export
  return slugs.length > 0 ? slugs : [{ slug: "_" }];
}

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <NewsDetailClient paramsPromise={params} />;
}
