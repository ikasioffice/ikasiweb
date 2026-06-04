import type { ReactNode } from "react";

// Admin keeps the dark "blueprint" look regardless of the public site's theme.
export default function AdminGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
