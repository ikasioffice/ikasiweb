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

type LineIconName = "pin" | "lock" | "check" | "mail" | "warning" | "briefcase" | "cap" | "phone" | "link" | "calendar" | "store" | "users";

const LINE_PATHS: Record<LineIconName, string> = {
  pin: "M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10zM12 11a2 2 0 100-4 2 2 0 000 4z",
  lock: "M6 10V8a6 6 0 0112 0v2M5 10h14v10H5zM12 14v3",
  check: "M20 6L9 17l-5-5",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  warning: "M12 3l10 18H2zM12 10v5M12 18h.01",
  briefcase: "M4 8h16v12H4zM9 8V6a2 2 0 012-2h2a2 2 0 012 2v2",
  cap: "M12 4l10 5-10 5L2 9l10-5zM6 11v5l6 3 6-3v-5",
  phone: "M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  link: "M9 15l6-6M10 6l1-1a4 4 0 016 6l-1 1M14 18l-1 1a4 4 0 01-6-6l1-1",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  store: "M4 9l1-4h14l1 4M5 9v10h14V9M9 19v-5h6v5",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 0112 0M17 11a3 3 0 10-2-5.2M21 20a6 6 0 00-4-5.6",
};

export function LineIcon({ name, className = "", size = 16 }: { name: LineIconName; className?: string; size?: number }) {
  const d = LINE_PATHS[name] ?? LINE_PATHS.check;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
