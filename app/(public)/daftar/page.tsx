"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DaftarPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/cara-bergabung"); }, [router]);
  return null;
}
