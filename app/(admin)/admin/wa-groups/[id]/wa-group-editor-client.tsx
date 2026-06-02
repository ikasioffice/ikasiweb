"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getWaGroupById,
  createWaGroup,
  updateWaGroup,
  type WaGroupInsert,
} from "@/lib/data/wa-groups";

const EMPTY: Partial<WaGroupInsert> = {
  name: "",
  category: "",
  description: "",
  wa_link: "",
  member_count: 0,
  is_active: true,
};

export function WaGroupEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const [form, setForm] = useState<Partial<WaGroupInsert>>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    getWaGroupById(id).then((data) => {
      if (data) setForm(data);
      setLoading(false);
    });
  }, [id, isNew]);

  function update<K extends keyof WaGroupInsert>(key: K, value: WaGroupInsert[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    if (!form.name || !form.category || !form.wa_link) {
      setError("Nama, kategori, dan link WhatsApp wajib diisi.");
      return;
    }
    setError(null);
    setSaving(true);
    if (isNew) {
      const { data, error } = await createWaGroup(form as WaGroupInsert);
      setSaving(false);
      if (error) {
        setError(error);
        return;
      }
      if (data) router.replace(`/admin/wa-groups/${data.id}`);
    } else {
      const { error } = await updateWaGroup(id, form);
      setSaving(false);
      if (error) {
        setError(error);
        return;
      }
      router.push("/admin/wa-groups");
    }
  }

  if (loading) return <div className="text-slate-300 animate-pulse">Memuat…</div>;

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4a72c]/50 text-sm";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/wa-groups" className="text-slate-400 hover:text-white text-sm">
          ← Grup WhatsApp
        </Link>
        <h1 className="font-heading text-xl font-extrabold tracking-tight">
          {isNew ? "Tambah Grup WhatsApp" : "Edit Grup WhatsApp"}
        </h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Nama Grup</label>
          <input
            placeholder="Contoh: IKASI Angkatan 2015"
            value={form.name ?? ""}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Kategori</label>
          <input
            placeholder="Contoh: Angkatan 2015 / Bidang Konstruksi / Info Lowongan"
            value={form.category ?? ""}
            onChange={(e) => update("category", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Link WhatsApp</label>
          <input
            placeholder="https://chat.whatsapp.com/..."
            value={form.wa_link ?? ""}
            onChange={(e) => update("wa_link", e.target.value)}
            className={`${inputClass} font-mono`}
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Deskripsi (opsional)</label>
          <textarea
            placeholder="Deskripsi singkat grup…"
            value={form.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Jumlah Member</label>
          <input
            type="number"
            min={0}
            value={form.member_count ?? 0}
            onChange={(e) => update("member_count", Number(e.target.value))}
            className={`${inputClass} max-w-[160px]`}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active ?? false}
            onChange={(e) => update("is_active", e.target.checked)}
            className="accent-[#d4a72c]"
          />
          Tampilkan di halaman publik (aktif)
        </label>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !form.name || !form.category || !form.wa_link}
          className="btn-gold px-8 py-2.5 rounded-full text-sm disabled:opacity-50"
        >
          {saving ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </div>
  );
}
