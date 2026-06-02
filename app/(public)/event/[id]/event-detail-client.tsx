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

  if (!event) return <div className="p-12 text-slate-300 animate-pulse">Memuat…</div>;

  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <Link href="/event" className="text-slate-400 hover:text-white text-sm block mb-8">
        ← Acara IKASI
      </Link>

      {event.poster_url && (
        <img src={event.poster_url} alt={event.title} className="w-full rounded-2xl mb-8 object-cover max-h-72" />
      )}

      <div className="text-[#d4a72c] text-sm font-semibold mb-2">{formatDate(event.date)}</div>
      <h1 className="text-4xl font-heading font-extrabold tracking-tight mb-4">{event.title}</h1>
      {event.location && (
        <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-6">
          <LineIcon name="pin" /> {event.location}
        </div>
      )}
      {event.description && (
        <p className="text-slate-300 leading-relaxed mb-8">{event.description}</p>
      )}

      <div className="flex items-center gap-4">
        {user ? (
          rsvped ? (
            <div className="px-6 py-3 rounded-full bg-green-900/30 border border-green-500/30 text-green-400 text-sm font-semibold">
              <span className="inline-flex items-center gap-1.5">Sudah RSVP <LineIcon name="check" size={14} /></span>
            </div>
          ) : (
            <button
              onClick={handleRsvp}
              disabled={submitting}
              className="btn-gold px-8 py-3 rounded-full font-semibold disabled:opacity-50"
            >
              {submitting ? "Mendaftar…" : "RSVP Sekarang"}
            </button>
          )
        ) : (
          <Link href="/login" className="btn-gold px-8 py-3 rounded-full font-semibold">
            Login untuk RSVP
          </Link>
        )}
        <span className="text-sm text-slate-400">{rsvpCount} orang sudah RSVP</span>
      </div>
    </main>
  );
}
