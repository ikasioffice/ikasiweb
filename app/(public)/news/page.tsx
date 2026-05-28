"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPublishedPosts, type Post } from "@/lib/data/news";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublishedPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        <span className="gradient-text">Berita</span> IKASI
      </h1>
      <p className="text-slate-400 mb-10">Informasi terkini dari keluarga besar alumni</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-slate-500 py-16">Belum ada artikel yang dipublish.</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="glass-card rounded-2xl p-6 block hover:border-[#d4a72c]/40 transition-colors"
            >
              <div className="text-xs text-slate-500 mb-2">
                {formatDate(post.published_at)} {post.author && `· ${post.author}`}
              </div>
              <h2 className="font-extrabold text-lg text-white mb-2">{post.title}</h2>
              {post.excerpt && (
                <p className="text-sm text-slate-400 line-clamp-2">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
