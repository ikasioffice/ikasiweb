import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Situs ini static export (tanpa server), jadi pakai implicit flow:
        // token dikirim di URL fragment (#access_token) dan diproses di client.
        // PKCE gagal saat magic link dibuka di device/browser berbeda dari
        // peminta (code_verifier tidak tersedia). Implicit flow lintas-device.
        flowType: "implicit",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  );
}
