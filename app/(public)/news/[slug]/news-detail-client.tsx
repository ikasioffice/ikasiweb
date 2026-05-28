"use client";

import { useEffect, useState, use } from "react";
import { getPostBySlug, type Post } from "@/lib/data/news";
import Link from "next/link";

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
    const bold = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    elements.push(
      <p
        key={elements.length}
        className="text-slate-300 leading-relaxed mb-4"
        dangerouslySetInnerHTML={{ __html: bold }}
      />
    );
    buf = [];
  }

  for (const line of lines) {
    if (line.startsWith("# ")) {
      flushPara();
      elements.push(<h2 key={elements.length} className="text-2xl font-extrabold mt-8 mb-3 text-white">{line.slice(2)}</h2>);
    } else if (line.startsWith("## ")) {
      flushPara();
      elements.push(<h3 key={elements.length} className="text-xl font-bold mt-6 mb-2 text-white">{line.slice(3)}</h3>);
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

  if (!post) return <div className="p-12 text-slate-300 animate-pulse">Memuat…</div>;
  if (post === "not-found") {
    return (
      <main className="p-12 text-center">
        <div className="text-slate-400 mb-4">Artikel tidak ditemukan.</div>
        <Link href="/news" className="text-[#d4a72c] hover:underline">← Kembali ke Berita</Link>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <Link href="/news" className="text-slate-400 hover:text-white text-sm block mb-8">
        ← Berita IKASI
      </Link>
      <div className="text-xs text-slate-500 mb-3">
        {formatDate(post.published_at)} {post.author && `· ${post.author}`}
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-8 leading-tight">{post.title}</h1>
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="w-full rounded-2xl mb-8 object-cover max-h-96" />
      )}
      <article className="prose-sm">
        {post.body_md ? renderMarkdown(post.body_md) : <p className="text-slate-400">Konten belum tersedia.</p>}
      </article>
    </main>
  );
}
