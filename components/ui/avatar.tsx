import { formatName } from "@/lib/format";

const PALETTES = [
  ["#d4a72c", "#b88a1c"], ["#3b82f6", "#1e40af"], ["#10b981", "#047857"],
  ["#f59e0b", "#c2410c"], ["#8b5cf6", "#6d28d9"], ["#ec4899", "#be185d"],
] as const;

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = formatName(name).split(" ").filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export function Avatar({ name, size = 56 }: { name: string; size?: number }) {
  const clean = formatName(name) || "?";
  const palette = PALETTES[hashString(clean) % PALETTES.length];
  const isLight = palette[0] === "#d4a72c";
  return (
    <div
      className="rounded-[14px] grid place-items-center font-extrabold tracking-tight"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
        color: isLight ? "#0a1628" : "#fff",
        fontSize: size * 0.4,
      }}
      aria-hidden="true"
    >
      {initials(clean)}
    </div>
  );
}
