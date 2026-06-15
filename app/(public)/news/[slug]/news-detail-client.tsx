"use client";

import { useEffect, useState, use } from "react";
import { getPostBySlug, type Post } from "@/lib/data/news";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// Very simple markdown renderer: converts **bold**, # headings, blank lines → paragraphs
function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let buf: string[] = [];

  function flushPara() {
    if (buf.length === 0) return;
    const text = buf.join(" ");
    // Escape HTML dulu agar konten (mis. <script>) tidak tereksekusi (anti-XSS),
    // baru terapkan **bold** yang aman.
    const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const bold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    elements.push(
      <p
        key={elements.length}
        className="text-foreground leading-relaxed mb-4"
        dangerouslySetInnerHTML={{ __html: bold }}
      />
    );
    buf = [];
  }

  for (const line of lines) {
    if (line.startsWith("# ")) {
      flushPara();
      elements.push(<h2 key={elements.length} className="text-2xl font-extrabold mt-8 mb-3 text-foreground">{line.slice(2)}</h2>);
    } else if (line.startsWith("## ")) {
      flushPara();
      elements.push(<h3 key={elements.length} className="text-xl font-bold mt-6 mb-2 text-foreground">{line.slice(3)}</h3>);
    } else if (line.trim() === "") {
      flushPara();
    } else {
      buf.push(line);
    }
  }
  flushPara();
  return elements;
}

export function NewsDetailClient({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const { slug } = use(paramsPromise);
  const [post, setPost] = useState<Post | null | "not-found">(null);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug).then((p) => setPost(p ?? "not-found"));
  }, [slug]);

  if (!post) return <div className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground sm:px-6">Memuat…</div>;
  if (post === "not-found") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Artikel tidak ditemukan"
          description="Artikel yang kamu cari mungkin sudah dipindah atau dihapus."
          action={<Link href="/news" className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Kembali ke Berita</Link>}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <Link href="/news" className="hover:text-foreground">Berita</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground line-clamp-1">{post.title}</span>
      </nav>

      <article>
        <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">BERITA</span>
        <h1 className="font-heading mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          {post.author && (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {post.author.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
            </span>
          )}
          {post.author && <span>{post.author}</span>}
          {post.author && <span>·</span>}
          <span>{formatDate(post.published_at)}</span>
        </div>

        {post.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image} alt={post.title} className="mt-6 max-h-96 w-full rounded-2xl border border-border object-cover" />
        ) : (
          <div className="relative mt-6 h-56 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/25 to-primary/5 sm:h-72">
            <div className="bp-grid absolute inset-0" />
          </div>
        )}

        <div className="mt-8 leading-relaxed">
          {post.body_md ? renderMarkdown(post.body_md) : <p className="text-muted-foreground">Konten belum tersedia.</p>}
        </div>
      </article>

      <div className="mt-10 border-t border-border pt-6">
        <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Kembali ke Berita
        </Link>
      </div>
    </main>
  );
}
