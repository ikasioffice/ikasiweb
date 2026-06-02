"use client";

import { useEffect, useState } from "react";
import { listPublishedPosts, type Post } from "@/lib/data/news";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";

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
      <PageHeader
        title={<><span className="gradient-text">Berita</span> IKASI</>}
        subtitle="Informasi terkini dari keluarga besar alumni"
        className="mb-10"
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="Belum ada artikel"
          description="Berita & informasi terbaru dari IKASI akan tampil di sini."
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} href={`/news/${post.slug}`} className="flex gap-5 p-6">
              {post.cover_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.cover_image} alt={post.title} className="hidden sm:block w-28 h-20 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-xs text-slate-500 mb-2">
                  {formatDate(post.published_at)} {post.author && `· ${post.author}`}
                </div>
                <h2 className="font-heading font-extrabold text-lg text-white mb-2">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-slate-400 line-clamp-2">{post.excerpt}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
