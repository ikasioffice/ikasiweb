import { LineIcon } from "@/components/ui/icons";

type LineIconName = "pin" | "lock" | "check" | "mail" | "warning" | "briefcase" | "cap" | "phone" | "link" | "calendar" | "store" | "users";

export function PosterThumb({
  src, alt, size = 64, icon = "store", className = "",
}: { src?: string | null; alt: string; size?: number; icon?: LineIconName; className?: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`rounded-xl object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`rounded-xl bg-accent border border-border flex items-center justify-center flex-shrink-0 text-primary ${className}`}
      style={{ width: size, height: size }}
    >
      <LineIcon name={icon} size={Math.round(size * 0.4)} />
    </div>
  );
}
