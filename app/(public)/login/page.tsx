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
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="bp-grid bp-grid-fade absolute inset-0" />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-ikasi.png" alt="IKASI" className="mx-auto h-14 w-14 rounded-lg object-contain" />
          <h1 className="font-heading mt-4 text-2xl font-extrabold tracking-tight">Selamat datang</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masuk dengan Google atau kirim magic link ke email terdaftar.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {hasError && (
            <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              Login gagal. Coba lagi.
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={signInWithGoogle}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Masuk dengan Google
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> atau <div className="h-px flex-1 bg-border" />
          </div>

          {/* Magic Link */}
          {sent ? (
            <div className="rounded-md border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
              <div className="mb-1 font-semibold text-primary">Cek email kamu ✓</div>
              Link masuk sudah dikirim ke <strong>{email}</strong>. Klik link di email untuk masuk. Berlaku 1 jam.
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email terdaftar di IKASI"
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              {magicError && <p className="text-left text-xs text-destructive">{magicError}</p>}
              <button
                type="submit"
                disabled={sending || !email.trim()}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "Mengirim..." : "Kirim Magic Link"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
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
