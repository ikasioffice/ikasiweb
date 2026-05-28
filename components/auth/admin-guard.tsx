"use client";

import { useAuth } from "@/lib/auth/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (!isAdmin) router.replace("/me");
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#d4a72c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return <>{children}</>;
}
