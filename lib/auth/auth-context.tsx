"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AuthState = {
  user: User | null;
  isVerified: boolean;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  isVerified: false,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithMagicLink: async () => ({ error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  async function refreshRoles(u: User | null) {
    if (!u) {
      setIsVerified(false);
      setIsAdmin(false);
      return;
    }

    // Check admin role
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.id)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!roleRow);

    // Self-link: klaim row alumni yang email-nya cocok tapi belum tertaut akun ini.
    // Trigger DB (on_auth_user_created / on_auth_email_confirmed) hanya jalan saat
    // auth user dibuat / email dikonfirmasi. Pada alur pendaftaran mandiri, user
    // bisa punya akun auth SEBELUM row alumni-nya ada/di-approve, sehingga trigger
    // tidak menautkan apa pun. Klaim di sini berjalan setiap login dan menutup
    // celah itu. Dibolehkan oleh RLS alumni_self_link_auth (auth_user_id IS NULL
    // AND email = jwt email). Tidak mengubah is_verified (tetap kendali admin).
    if (u.email) {
      await supabase
        .from("alumni")
        .update({ auth_user_id: u.id })
        .is("auth_user_id", null)
        .eq("email", u.email);
    }

    const { data: alumniRow } = await supabase
      .from("alumni")
      .select("is_verified")
      .eq("auth_user_id", u.id)
      .maybeSingle();

    setIsVerified(alumniRow?.is_verified ?? false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      refreshRoles(u).finally(() => setLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      refreshRoles(u).finally(() => setLoading(false));
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function signInWithMagicLink(email: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setIsVerified(false);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ user, isVerified, isAdmin, loading, signInWithGoogle, signInWithMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
