"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

const EMPTY: Partial<EventInsert> = {
  title: "",
  date: "",
  location: "",
  description: "",
  is_published: false,
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<Partial<EventInsert>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    supabase.from("events").select("*").order("date", { ascending: false }).then(({ data }) => {
      setEvents(data ?? []);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    setSaving(true);
    if (editing) {
      const { data } = await supabase.from("events").update({ ...form }).eq("id", editing).select().single();
      if (data) setEvents((prev) => prev.map((e) => e.id === editing ? data : e));
    } else {
      const { data } = await supabase.from("events").insert(form as EventInsert).select().single();
      if (data) setEvents((prev) => [data, ...prev]);
    }
    setForm(EMPTY);
    setEditing(null);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus acara ini?")) return;
    await supabase.from("events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight mb-6">Acara</h1>

      {/* Form */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <h2 className="font-semibold mb-4">{editing ? "Edit Acara" : "Tambah Acara Baru"}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Judul acara"
            value={form.title ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d4a72c]/50"
          />
          <input
            type="datetime-local"
            value={form.date?.slice(0, 16) ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4a72c]/50"
          />
          <input
            placeholder="Lokasi"
            value={form.location ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d4a72c]/50"
          />
          <textarea
            placeholder="Deskripsi acara"
            value={form.description ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d4a72c]/50 resize-none"
          />
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published ?? false}
              onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))}
              className="accent-[#d4a72c]"
            />
            Publish sekarang
          </label>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving || !form.title}
            className="btn-gold px-6 py-2 rounded-full text-sm disabled:opacity-50"
          >
            {saving ? "Menyimpan…" : editing ? "Simpan" : "Tambahkan"}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(EMPTY); }} className="px-6 py-2 rounded-full text-sm border border-white/20 text-slate-300">
              Batal
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="glass-card rounded-xl h-16 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="glass-card rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">{event.title}</div>
                <div className="text-xs text-slate-400">
                  {formatDate(event.date)} · {event.is_published ? <span className="text-green-400">Published</span> : <span className="text-orange-400">Draft</span>}
                  {" · "}{event.rsvp_count ?? 0} RSVP
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => { setEditing(event.id); setForm({ title: event.title, date: event.date ?? "", location: event.location ?? "", description: event.description ?? "", is_published: event.is_published ?? false }); }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:border-[#d4a72c]/50 transition-colors"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(event.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
