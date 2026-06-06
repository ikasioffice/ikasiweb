"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { deleteAlumni, type BisnisRef } from "@/lib/data/admin-duplicates";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { FIELDS, GROUP_LABELS, type Alumni, type Field, type GroupKey } from "./alumni-schema";

type AlumniUpdate = Database["public"]["Tables"]["alumni"]["Update"];

type Props = {
  alumni: Alumni;
  onClose: () => void;
  onSaved: (updated: Alumni) => void;
  onDeleted: (id: string) => void;
};

const GROUP_ORDER: GroupKey[] = ["identitas", "pekerjaan", "keanggotaan", "tanggal", "lainnya"];

/** Ubah nilai dari Supabase menjadi string untuk input form. */
function toInput(field: Field, value: Alumni[keyof Alumni]): string {
  if (value == null) return "";
  if (field.type === "tags" && Array.isArray(value)) return value.join(", ");
  if (field.type === "date") return String(value).slice(0, 10);
  return String(value);
}

/** Ubah string input kembali menjadi nilai untuk disimpan ke Supabase. */
function fromInput(field: Field, raw: string): Alumni[keyof Alumni] {
  const t = raw.trim();
  if (field.type === "number") return (t === "" ? null : Number(t)) as never;
  if (field.type === "boolean") return (t === "" ? null : t === "true") as never;
  if (field.type === "tags") return (t === "" ? null : t.split(",").map((s) => s.trim()).filter(Boolean)) as never;
  return (t === "" ? null : t) as never;
}

function buildDraft(alumni: Alumni): Record<string, string> {
  const next: Record<string, string> = {};
  for (const f of FIELDS) next[f.key] = toInput(f, alumni[f.key]);
  return next;
}

export function AlumniDetailDrawer({ alumni, onClose, onSaved, onDeleted }: Props) {
  const [draft, setDraft] = useState<Record<string, string>>(() => buildDraft(alumni));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [blockedBisnis, setBlockedBisnis] = useState<BisnisRef[] | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const dirty = FIELDS.some(
    (f) => f.type !== "readonly" && draft[f.key] !== toInput(f, alumni[f.key]),
  );

  async function save() {
    setSaving(true);
    setError(null);
    const patch: AlumniUpdate = {};
    for (const f of FIELDS) {
      if (f.type === "readonly") continue;
      const before = toInput(f, alumni[f.key]);
      if (draft[f.key] !== before) patch[f.key] = fromInput(f, draft[f.key]) as never;
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("alumni")
      .update(patch)
      .eq("id", alumni.id)
      .select()
      .single();
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data) onSaved(data as Alumni);
  }

  async function remove() {
    setDeleting(true);
    setError(null);
    try {
      const res = await deleteAlumni(alumni.id);
      if (res.ok) {
        onDeleted(alumni.id);
      } else if ("blocked" in res && res.blocked === "bisnis") {
        setBlockedBisnis(res.bisnis);
      } else {
        setError("error" in res ? res.error : "Gagal menghapus");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* overlay */}
      <button
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* panel */}
      <div className="relative h-full w-full max-w-lg overflow-y-auto border-l border-border bg-card shadow-xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card px-6 py-4">
          <div className="min-w-0">
            <div className="font-heading text-lg font-bold text-foreground truncate">
              {alumni.nama || "Tanpa Nama"}
            </div>
            <div className="text-xs text-muted-foreground">
              Angkatan {alumni.angkatan} · {alumni.prodi || "—"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Tutup"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {GROUP_ORDER.map((g) => {
            const fields = FIELDS.filter((f) => f.group === g);
            if (fields.length === 0) return null;
            return (
              <section key={g}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {GROUP_LABELS[g]}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {fields.map((f) => (
                    <FieldInput
                      key={f.key}
                      field={f}
                      value={draft[f.key] ?? ""}
                      onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="sticky bottom-0 border-t border-border bg-card px-6 py-4">
          {error && <div className="mb-2 text-xs text-red-400 break-words">{error}</div>}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => { setBlockedBisnis(null); setConfirmDelete(true); }}
              className="h-9 rounded-md border border-red-500/30 px-4 text-sm font-medium text-red-400 hover:border-red-500/60 hover:bg-red-500/10"
            >
              Hapus
            </button>
            <div className="flex items-center gap-3">
              {!error && (
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {dirty ? "Ada perubahan belum disimpan" : "Tidak ada perubahan"}
                </span>
              )}
              <button
                onClick={onClose}
                className="h-9 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
              >
                Tutup
              </button>
              <button
                onClick={save}
                disabled={!dirty || saving}
                className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40"
              >
                {saving ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={blockedBisnis ? "Alumni ini punya bisnis terkait" : "Hapus alumni?"}
        message={blockedBisnis
          ? "Pindahkan atau hapus bisnis berikut dulu (lewat menu Duplikat Alumni / pengelolaan bisnis), baru alumni bisa dihapus."
          : `Hapus "${alumni.nama}" (angkatan ${alumni.angkatan}). Data disimpan & bisa di-restore lewat Riwayat Hapus.`}
        confirmLabel="Hapus"
        loading={deleting}
        confirmDisabled={!!blockedBisnis}
        onConfirm={remove}
        onCancel={() => { setConfirmDelete(false); setBlockedBisnis(null); }}
      >
        {blockedBisnis && (
          <ul className="list-disc pl-5 text-sm text-slate-300">
            {blockedBisnis.map((b) => <li key={b.id}>{b.nama_brand ?? b.id}</li>)}
          </ul>
        )}
      </ConfirmDialog>
    </div>
  );
}

function FieldInput({
  field, value, onChange,
}: { field: Field; value: string; onChange: (v: string) => void }) {
  const labelEl = (
    <label className="block text-xs text-muted-foreground mb-1">{field.label}</label>
  );
  const inputCls =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60";

  if (field.type === "readonly") {
    return (
      <div>
        {labelEl}
        <div className="w-full rounded-md border border-border bg-accent/40 px-3 py-2 text-sm text-muted-foreground break-all">
          {value || "—"}
        </div>
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <div>
        {labelEl}
        <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          <option value="true">Ya</option>
          <option value="false">Tidak</option>
        </select>
      </div>
    );
  }

  return (
    <div>
      {labelEl}
      <input
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        className={inputCls}
        value={value}
        placeholder={field.type === "tags" ? "pisahkan dengan koma" : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
