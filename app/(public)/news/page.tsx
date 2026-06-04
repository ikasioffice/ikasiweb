"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPublishedPosts, type Post } from "@/lib/data/news";
import { EmptyState } from "@/components/ui/empty-state";

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

  const [featured, ...rest] = posts;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Berita</span>
      </nav>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="text-primary">Berita</span> IKASI
      </h1>
      <p className="mt-2 text-muted-foreground">Informasi terkini dari keluarga besar alumni.</p>

      {loading ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border border-border bg-muted" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Belum ada artikel"
            description="Berita & informasi terbaru dari IKASI akan tampil di sini."
          />
        </div>
      ) : (
        <>
          {/* Featured */}
          <Link
            href={`/news/${featured.slug}`}
            className="group mt-10 grid overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md sm:grid-cols-2"
          >
            <div className="relative h-48 sm:h-full">
              {featured.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featured.cover_image} alt={featured.title} className="h-full w-full object-cover" />
              ) : (
                <div className="relative h-full min-h-48 bg-gradient-to-br from-primary/25 to-primary/5">
                  <div className="bp-grid absolute inset-0" />
                </div>
              )}
              <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">UTAMA</span>
            </div>
            <div className="p-6">
              <div className="text-xs text-muted-foreground">
                {formatDate(featured.published_at)} {featured.author && `· ${featured.author}`}
              </div>
              <h2 className="font-heading mt-2 text-xl font-extrabold leading-snug text-foreground">{featured.title}</h2>
              {featured.excerpt && <p className="mt-2 text-sm text-muted-foreground">{featured.excerpt}</p>}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Baca selengkapnya
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </div>
          </Link>

          {/* Rest */}
          {rest.length > 0 && (
            <div className="mt-6 grid gap-4 pb-16 sm:grid-cols-2">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative hidden h-20 w-24 shrink-0 overflow-hidden rounded-lg sm:block">
                    {post.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="relative h-full bg-gradient-to-br from-primary/20 to-primary/5">
                        <div className="bp-grid absolute inset-0" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">
                      {formatDate(post.published_at)} {post.author && `· ${post.author}`}
                    </div>
                    <h3 className="font-heading mt-1 font-bold leading-snug text-foreground">{post.title}</h3>
                    {post.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
