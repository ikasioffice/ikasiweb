"use client";

import { useEffect, useState } from "react";
import { listPublishedEvents, type Event } from "@/lib/data/events";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { PosterThumb } from "@/components/ui/poster-thumb";
import { LineIcon } from "@/components/ui/icons";

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
      <PageHeader
        title={<><span className="gradient-text">Acara</span> IKASI</>}
        subtitle="Reuni, seminar, dan gathering alumni"
        className="mb-10"
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="glass-card rounded-2xl h-28 animate-pulse" />)}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="Belum ada acara mendatang"
          description="Nantikan reuni, seminar, dan gathering alumni berikutnya."
          icon={<LineIcon name="calendar" size={24} />}
        />
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} href={`/event/${event.id}`} className="flex gap-5 p-6">
              <PosterThumb src={event.poster_url} alt={event.title} size={80} icon="calendar" />
              <div className="min-w-0">
                <div className="text-xs text-[#d4a72c] mb-1">{formatDate(event.date)}</div>
                <h2 className="font-heading font-extrabold text-white truncate">{event.title}</h2>
                {event.location && (
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <LineIcon name="pin" size={12} /> {event.location}
                  </div>
                )}
                {event.description && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{event.description}</p>}
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                  <LineIcon name="users" size={12} /> {event.rsvp_count ?? 0} RSVP
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
