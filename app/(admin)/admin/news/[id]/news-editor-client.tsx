"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { useRouter } from "next/navigation";
import Link from "next/link";

type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];

const EMPTY: Partial<PostInsert> = {
  title: "",
  slug: "",
  excerpt: "",
  body_md: "",
  author: "",
  is_published: false,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function NewsEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const [form, setForm] = useState<Partial<PostInsert>>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    const supabase = createClient();
    supabase.from("posts").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setForm(data);
      setLoading(false);
    });
  }, [id, isNew]);

  function handleTitleChange(title: string) {
    setForm((p) => ({
      ...p,
      title,
      slug: p.slug || slugify(title),
    }));
  }

  async function handleSave() {
    if (!form.title || !form.slug) return;
    setSaving(true);
    const supabase = createClient();
    if (isNew) {
      const { data, error } = await supabase.from("posts").insert(form as PostInsert).select().single();
      if (!error && data) router.replace(`/admin/news/${data.id}`);
    } else {
      await supabase.from("posts").update({ ...form, updated_at: new Date().toISOString() }).eq("id", id);
    }
    setSaving(false);
  }

  if (loading) return <div className="text-slate-300 animate-pulse">Memuat…</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/news" className="text-slate-400 hover:text-white text-sm">← Berita</Link>
        <h1 className="text-xl font-extrabold tracking-tight">
          {isNew ? "Tulis Artikel Baru" : "Edit Artikel"}
        </h1>
      </div>

      <div className="space-y-4">
        <input
          placeholder="Judul artikel"
          value={form.title ?? ""}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4a72c]/50 text-lg font-semibold"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Slug (URL)</label>
            <input
              placeholder="slug-artikel"
              value={form.slug ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4a72c]/50 text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Penulis</label>
            <input
              placeholder="Nama penulis"
              value={form.author ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4a72c]/50 text-sm"
            />
          </div>
        </div>
        <textarea
          placeholder="Ringkasan artikel (opsional)"
          value={form.excerpt ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4a72c]/50 text-sm resize-none"
        />
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Isi Artikel (Markdown)</label>
          <textarea
            placeholder="Tulis isi artikel dalam format Markdown…"
            value={form.body_md ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, body_md: e.target.value }))}
            rows={20}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4a72c]/50 text-sm font-mono resize-y"
          />
        </div>
        <div className="flex items-center gap-4">
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
        <button
          onClick={handleSave}
          disabled={saving || !form.title || !form.slug}
          className="btn-gold px-8 py-2.5 rounded-full text-sm disabled:opacity-50"
        >
          {saving ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </div>
  );
}
