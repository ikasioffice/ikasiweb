"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPublishedEvents, type Event } from "@/lib/data/events";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { LineIcon } from "@/components/ui/icons";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function dateBox(iso: string | null): { day: string; month: string } {
  if (!iso) return { day: "—", month: "" };
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("id-ID", { day: "numeric" }),
    month: d.toLocaleDateString("id-ID", { month: "short" }),
  };
}

function isUpcoming(iso: string | null) {
  if (!iso) return false;
  return new Date(iso).getTime() >= Date.now();
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
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Acara</span>
      </nav>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="text-primary">Acara</span> IKASI
      </h1>
      <p className="mt-2 text-muted-foreground">Reuni, seminar, dan gathering alumni.</p>

      <div className="mt-10">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl border border-border bg-muted" />)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="Belum ada acara mendatang"
            description="Nantikan reuni, seminar, dan gathering alumni berikutnya."
            icon={<LineIcon name="calendar" size={24} />}
          />
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const box = dateBox(event.date);
              return (
                <Card key={event.id} href={`/event/${event.id}`} className="flex flex-col gap-4 p-5 sm:flex-row">
                  <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <span className="font-heading text-2xl font-extrabold leading-none">{box.day}</span>
                    <span className="mt-1 text-xs font-medium uppercase">{box.month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-primary">{formatDate(event.date)}</span>
                      {isUpcoming(event.date) && (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">SEGERA</span>
                      )}
                    </div>
                    <h2 className="font-heading mt-1 text-lg font-bold text-foreground">{event.title}</h2>
                    {event.location && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <LineIcon name="pin" size={12} /> {event.location}
                      </div>
                    )}
                    {event.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>}
                    <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <LineIcon name="users" size={12} /> {event.rsvp_count ?? 0} RSVP
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
