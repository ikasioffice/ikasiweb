"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OverviewTab } from "./_dashboard/overview-tab";
import { AlumniDatabaseTab } from "./_dashboard/alumni-database-tab";

type TabKey = "overview" | "database";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "database", label: "Database Alumni" },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = (searchParams.get("tab") as TabKey) || "overview";
  const [tab, setTab] = useState<TabKey>(initial === "database" ? "database" : "overview");

  function select(key: TabKey) {
    setTab(key);
    const params = new URLSearchParams(searchParams.toString());
    if (key === "overview") params.delete("tab");
    else params.set("tab", key);
    const qs = params.toString();
    router.replace(qs ? `/admin?${qs}` : "/admin", { scroll: false });
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight mb-6">Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => select(t.key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "text-[#d4a72c]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#d4a72c]" />
            )}
          </button>
        ))}
      </div>

      {tab === "overview" ? <OverviewTab /> : <AlumniDatabaseTab />}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
