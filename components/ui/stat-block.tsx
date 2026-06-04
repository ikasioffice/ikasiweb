"use client";

import { useEffect, useRef, useState } from "react";

export function StatBlock({ value, label }: { value: number | null; label: string }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === null) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplayed(value); return; }
    const start = Date.now();
    const duration = 1200;
    const animate = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return (
    <div className="relative text-center">
      <div className="font-heading text-4xl font-extrabold text-primary tabular-nums sm:text-5xl">
        {value === null ? "—" : displayed.toLocaleString("id-ID")}
      </div>
      <div className="mt-2 text-xs text-muted-foreground sm:text-sm">{label}</div>
    </div>
  );
}
