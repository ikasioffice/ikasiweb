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
    let done = false;

    const goNext = () => {
      if (done) return;
      done = true;
      router.replace(searchParams.get("next") ?? "/me");
    };

    // Implicit flow: token ada di URL fragment (#access_token) dan diproses
    // secara async oleh client (detectSessionInUrl). Sesi bisa muncul lewat
    // event SIGNED_IN, jadi kita dengarkan event itu sekaligus poll getSession.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) goNext();
    });

    let tries = 0;
    const poll = setInterval(async () => {
      tries += 1;
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        clearInterval(poll);
        goNext();
      } else if (tries >= 10) {
        // ~5 detik tanpa sesi → anggap link tidak valid/kedaluwarsa
        clearInterval(poll);
        if (!done) {
          done = true;
          router.replace("/login?error=oauth");
        }
      }
    }, 500);

    return () => {
      subscription.unsubscribe();
      clearInterval(poll);
    };
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
