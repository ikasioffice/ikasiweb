"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();
    // @supabase/ssr browser client handles PKCE code exchange automatically
    // when detectSessionInUrl is enabled (default). We just need to wait for it.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const next = searchParams.get("next") ?? "/me";
        router.replace(next);
      } else {
        // Give the session detection a moment to process the URL hash/code
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: d2 }) => {
            router.replace(d2.session ? (searchParams.get("next") ?? "/me") : "/login?error=oauth");
          });
        }, 1000);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
