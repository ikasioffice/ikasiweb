"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listAllWaGroups,
  setWaGroupActive,
  deleteWaGroup,
  type WaGroup,
} from "@/lib/data/wa-groups";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminWaGroupsPage() {
  const [groups, setGroups] = useState<WaGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAllWaGroups().then((data) => {
      setGroups(data);
      setLoading(false);
    });
  }, []);

  async function toggleActive(group: WaGroup) {
    const next = !(group.is_active ?? false);
    const { error } = await setWaGroupActive(group.id, next);
    if (error) {
      alert("Gagal mengubah status: " + error);
      return;
    }
    setGroups((prev) =>
      prev.map((g) => (g.id === group.id ? { ...g, is_active: next } : g))
    );
  }

  async function handleDelete(group: WaGroup) {
    if (!confirm(`Hapus grup "${group.name}"?`)) return;
    const { error } = await deleteWaGroup(group.id);
    if (error) {
      alert("Gagal menghapus: " + error);
      return;
    }
    setGroups((prev) => prev.filter((g) => g.id !== group.id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">Grup WhatsApp</h1>
        <Link
          href="/admin/wa-groups/new"
          className="btn-gold px-5 py-2 rounded-full text-sm"
        >
          + Tambah Grup
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState title="Belum ada grup WhatsApp" description="Tambahkan grup WhatsApp pertama untuk alumni IKASI" />
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="glass-card rounded-xl px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">{group.name}</div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">
                  {group.category} · {group.member_count ?? 0} member ·{" "}
                  {group.is_active ? (
                    <span className="text-green-400">Aktif</span>
                  ) : (
                    <span className="text-orange-400">Nonaktif</span>
                  )}
                </div>
                <a
                  href={group.wa_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#25D366] hover:underline font-mono truncate block mt-0.5"
                >
                  {group.wa_link}
                </a>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(group)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:border-[#d4a72c]/50 transition-colors"
                >
                  {group.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <Link
                  href={`/admin/wa-groups/${group.id}`}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:border-[#d4a72c]/50 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(group)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:border-red-500/60 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
