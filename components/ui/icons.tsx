type IconName = "directory" | "angkatan" | "bisnis" | "acara" | "berita" | "tentang";

const PATHS: Record<IconName, string> = {
  directory: "M4 6h10M4 12h16M4 18h10",
  angkatan: "M12 3l9 5-9 5-9-5 9-5zM5 10v5l7 4 7-4v-5",
  bisnis: "M4 9l1-4h14l1 4M5 9v10h14V9M9 19v-5h6v5",
  acara: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  berita: "M5 4h11v16H5zM16 8h3v9a2 2 0 01-4 0M8 8h5M8 12h5",
  tentang: "M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5",
};

export function FeatureIcon({ name, className = "" }: { name: IconName; className?: string }) {
  const d = PATHS[name] ?? PATHS.tentang;
  return (
    <svg
      width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
