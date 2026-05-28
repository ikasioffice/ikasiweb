"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPublishedEvents, type Event } from "@/lib/data/events";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublishedEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        <span className="gradient-text">Acara</span> IKASI
      </h1>
      <p className="text-slate-400 mb-10">Reuni, seminar, dan gathering alumni</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="glass-card rounded-2xl h-28 animate-pulse" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-slate-500 py-16">Belum ada acara yang akan datang.</div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="glass-card rounded-2xl p-6 flex gap-5 hover:border-[#d4a72c]/40 transition-colors"
            >
              {event.poster_url ? (
                <img src={event.poster_url} alt={event.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-[#142340] flex items-center justify-center flex-shrink-0 text-3xl">📅</div>
              )}
              <div className="min-w-0">
                <div className="text-xs text-[#d4a72c] mb-1">{formatDate(event.date)}</div>
                <h2 className="font-extrabold text-white truncate">{event.title}</h2>
                {event.location && <div className="text-xs text-slate-400 mt-1">📍 {event.location}</div>}
                {event.description && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{event.description}</p>}
                <div className="text-xs text-slate-500 mt-2">{event.rsvp_count ?? 0} RSVP</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
