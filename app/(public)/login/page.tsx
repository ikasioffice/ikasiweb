"use client";

import { useAuth } from "@/lib/auth/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function LoginForm() {
  const { user, loading, signInWithGoogle, signInWithMagicLink } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error") === "oauth";

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [magicError, setMagicError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace("/me");
  }, [user, loading, router]);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setMagicError(null);
    const { error } = await signInWithMagicLink(email.trim().toLowerCase());
    setSending(false);
    if (error) {
      setMagicError("Gagal mengirim link. Coba lagi.");
    } else {
      setSent(true);
    }
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="glass-card rounded-3xl p-10 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">🎓</div>
        <h1 className="text-2xl font-extrabold tracking-tight mb-2">Masuk ke IKASI</h1>
        <p className="text-sm text-slate-400 mb-8">
          Login dengan Google atau kirim magic link ke email terdaftar.
        </p>

        {hasError && (
          <div className="mb-6 p-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 text-sm">
            Login gagal. Coba lagi.
          </div>
        )}

        {/* Google Login */}
        <button
          onClick={signInWithGoogle}
          className="w-full btn-gold py-3 rounded-xl font-semibold flex items-center justify-center gap-3 mb-6"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Masuk dengan Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-slate-500">atau</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Magic Link */}
        {sent ? (
          <div className="p-4 rounded-xl bg-[#d4a72c]/10 border border-[#d4a72c]/30 text-sm text-slate-200">
            <div className="text-[#d4a72c] font-semibold mb-1">Cek email kamu ✓</div>
            Link masuk sudah dikirim ke <strong>{email}</strong>.
            Klik link di email untuk masuk. Berlaku 1 jam.
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email terdaftar di IKASI"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d4a72c]/50"
            />
            {magicError && (
              <p className="text-red-400 text-xs text-left">{magicError}</p>
            )}
            <button
              type="submit"
              disabled={sending || !email.trim()}
              className="w-full py-3 rounded-xl border border-[#d4a72c]/40 text-[#d4a72c] font-semibold text-sm hover:bg-[#d4a72c]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Mengirim..." : "Kirim Magic Link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-xs text-slate-500">
          Dengan masuk, kamu setuju dengan syarat dan ketentuan IKASI.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
