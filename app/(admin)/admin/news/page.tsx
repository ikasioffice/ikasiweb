"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import Link from "next/link";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  async function togglePublish(post: Post) {
    const supabase = createClient();
    const next = !post.is_published;
    await supabase
      .from("posts")
      .update({ is_published: next, published_at: next ? new Date().toISOString() : null })
      .eq("id", post.id);
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, is_published: next } : p));
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus artikel ini?")) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Berita</h1>
        <Link href="/admin/news/new" className="btn-gold px-5 py-2 rounded-full text-sm">
          + Tulis Artikel
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="glass-card rounded-xl h-16 animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-slate-500 text-center py-16">Belum ada artikel.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="glass-card rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">{post.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {post.slug} · {post.is_published ? (
                    <span className="text-green-400">Published</span>
                  ) : (
                    <span className="text-orange-400">Draft</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:border-[#d4a72c]/50 transition-colors"
                >
                  {post.is_published ? "Unpublish" : "Publish"}
                </button>
                <Link
                  href={`/admin/news/${post.id}`}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:border-[#d4a72c]/50 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:border-red-500/60 transition-colors"
                >
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
