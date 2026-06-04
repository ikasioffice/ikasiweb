import Link from "next/link";
import { LineIcon } from "@/components/ui/icons";

export function LoginPrompt({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2 text-sm text-foreground">
        <LineIcon name="briefcase" className="text-primary" />
        <strong className="text-primary">{message}</strong>
      </div>
      <Link
        href="/login"
        className="inline-flex h-9 items-center whitespace-nowrap rounded-md bg-primary px-5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Masuk dengan Google
      </Link>
    </div>
  );
}
