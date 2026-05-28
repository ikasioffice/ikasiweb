"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("alumni")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setCount(count));
  }, []);

  return (
    <main className="p-12">
      <h1 className="text-5xl font-extrabold tracking-tight">
        IKASI <span className="gradient-text">{count ?? "..."} Alumni</span>
      </h1>
    </main>
  );
}
