"use client";

import { useEffect, useState, use } from "react";
import { getEventById, rsvpEvent, hasRsvped, type Event } from "@/lib/data/events";
import { useAuth } from "@/lib/auth/use-auth";
import Link from "next/link";
import { LineIcon } from "@/components/ui/icons";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function EventDetailClient({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvped, setRsvped] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEventById(id).then((e) => {
      if (e) {
        setEvent(e);
        setRsvpCount(e.rsvp_count ?? 0);
      }
    });
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;
    hasRsvped(id, user.id).then(setRsvped);
  }, [id, user]);

  async function handleRsvp() {
    if (!user || !id) return;
    setSubmitting(true);
    const ok = await rsvpEvent(id, user.id);
    if (ok) {
      setRsvped(true);
      setRsvpCount((n) => n + 1);
    }
    setSubmitting(false);
  }

  if (!event) return <div className="mx-auto max-w-4xl px-4 py-16 text-muted-foreground sm:px-6">Memuat…</div>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <Link href="/event" className="hover:text-foreground">Acara</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{event.title}</span>
      </nav>

      {/* Poster banner */}
      <div className="relative h-56 overflow-hidden rounded-2xl border border-border shadow-sm sm:h-72">
        {event.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.poster_url} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="relative h-full bg-gradient-to-br from-primary/25 to-primary/5">
            <div className="bp-grid absolute inset-0" />
            <div className="absolute bottom-5 left-5">
              <div className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">{event.title}</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="text-sm font-semibold text-primary">{formatDate(event.date)}</div>
            <h1 className="font-heading mt-1 text-2xl font-extrabold tracking-tight">{event.title}</h1>
            {event.location && (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <LineIcon name="pin" size={14} /> {event.location}
              </div>
            )}
            {event.description && (
              <p className="mt-5 leading-relaxed text-muted-foreground">{event.description}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <Detail icon="calendar" label="Tanggal" value={formatDate(event.date)} />
              {event.location && <Detail icon="pin" label="Lokasi" value={event.location} />}
              <Detail icon="users" label="RSVP" value={`${rsvpCount} alumni`} />
            </div>

            <div className="mt-6">
              {user ? (
                rsvped ? (
                  <div className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-md bg-emerald-500/15 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Sudah RSVP <LineIcon name="check" size={14} />
                  </div>
                ) : (
                  <button
                    onClick={handleRsvp}
                    disabled={submitting}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    <LineIcon name="check" size={16} /> {submitting ? "Mendaftar…" : "Konfirmasi Hadir"}
                  </button>
                )
              ) : (
                <Link href="/login" className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                  Login untuk RSVP
                </Link>
              )}
            </div>
          </div>

          <Link href="/event" className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Kembali ke daftar acara
          </Link>
        </div>
      </div>
    </main>
  );
}

function Detail({ icon, label, value }: { icon: "calendar" | "pin" | "users"; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <LineIcon name={icon} size={20} className="shrink-0 text-primary" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
