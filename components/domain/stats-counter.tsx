"use client";

import { useEffect, useRef, useState } from "react";

export function StatsCounter({ value, label }: { value: number | null; label: string }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === null) return;
    const start = Date.now();
    const duration = 1200;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-5xl font-extrabold gradient-text tabular-nums">
        {value === null ? "—" : displayed.toLocaleString("id-ID")}
      </div>
      <div className="text-sm text-slate-400 mt-2">{label}</div>
    </div>
  );
}
