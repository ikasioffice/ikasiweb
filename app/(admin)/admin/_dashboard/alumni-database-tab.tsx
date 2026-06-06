"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { AlumniDetailDrawer } from "./alumni-detail-drawer";
import {
  TABLE_FIELDS, TABLE_GROUPS, GROUP_LABELS, formatCell,
  type Alumni, type GroupKey,
} from "./alumni-schema";

const PER_PAGE = 25;

export function AlumniDatabaseTab() {
  const [rows, setRows] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [prodi, setProdi] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Alumni | null>(null);
  const [hiddenGroups, setHiddenGroups] = useState<Set<GroupKey>>(new Set());
  const [colMenu, setColMenu] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function fetchAll() {
      const PAGE = 1000;
      let all: Alumni[] = [];
      let from = 0;
      while (true) {
        const { data } = await supabase
          .from("alumni")
          .select("*")
          .order("angkatan", { ascending: false })
          .order("nama", { ascending: true })
          .range(from, from + PAGE - 1);
        if (!data || data.length === 0) break;
        all = [...all, ...data];
        if (data.length < PAGE) break;
        from += PAGE;
      }
      setRows(all);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const angkatanOptions = useMemo(
    () => [...new Set(rows.map((r) => r.angkatan).filter((v) => v != null))].sort((a, b) => b - a),
    [rows],
  );
  const prodiOptions = useMemo(
    () => [...new Set(rows.map((r) => r.prodi).filter(Boolean))].sort() as string[],
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (angkatan && String(r.angkatan) !== angkatan) return false;
      if (prodi && r.prodi !== prodi) return false;
      if (status === "verified" && !r.is_verified) return false;
      if (status === "unverified" && r.is_verified) return false;
      if (q) {
        const hay = [r.nama, r.email, r.prodi, r.no_hp, r.tempat_kerja, r.nomor_anggota]
          .filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, query, angkatan, prodi, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const columns = TABLE_FIELDS.filter((f) => !hiddenGroups.has(f.group));

  function toggleGroup(g: GroupKey) {
    setHiddenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g); else next.add(g);
      return next;
    });
  }

  function exportCsv() {
    const cols = columns;
    const head = cols.map((c) => c.label).join(",");
    const lines = filtered.map((r) =>
      cols.map((c) => {
        const v = formatCell(c, r[c.key]);
        return `"${v.replace(/"/g, '""')}"`;
      }).join(","),
    );
    const csv = [head, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alumni-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const selectCls =
    "h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="search"
          placeholder="Cari nama, email, prodi, no HP…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          className="min-w-[220px] flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select className={selectCls} value={angkatan} onChange={(e) => { setAngkatan(e.target.value); setPage(1); }}>
          <option value="">Semua Angkatan</option>
          {angkatanOptions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select className={selectCls} value={prodi} onChange={(e) => { setProdi(e.target.value); setPage(1); }}>
          <option value="">Semua Prodi</option>
          {prodiOptions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className={selectCls} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Semua Status</option>
          <option value="verified">Terverifikasi</option>
          <option value="unverified">Belum</option>
        </select>

        {/* Toggle kolom */}
        <div className="relative">
          <button
            onClick={() => setColMenu((v) => !v)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent"
          >
            Kolom ▾
          </button>
          {colMenu && (
            <>
              <button className="fixed inset-0 z-10" aria-label="Tutup menu" onClick={() => setColMenu(false)} />
              <div className="absolute right-0 z-20 mt-1 w-48 rounded-md border border-border bg-card p-2 shadow-lg">
                {TABLE_GROUPS.map((g) => (
                  <label key={g} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!hiddenGroups.has(g)}
                      onChange={() => toggleGroup(g)}
                      className="accent-primary"
                    />
                    {GROUP_LABELS[g]}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={exportCsv}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent"
        >
          ⬇ Export CSV
        </button>
      </div>

      <div className="text-xs text-muted-foreground mb-3">
        {loading ? "Memuat…" : `${filtered.length.toLocaleString("id-ID")} alumni`}
        {!loading && filtered.length > 0 && (
          <> · menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}</>
        )}
      </div>

      {/* Tabel */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-11 rounded-md border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Tidak ada alumni ditemukan" description="Coba ubah filter atau kata kunci pencarian" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/40 text-left">
                {columns.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-3 py-2.5 font-semibold text-muted-foreground">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="border-b border-border last:border-0 cursor-pointer hover:bg-accent/40"
                >
                  {columns.map((c) => {
                    if (c.key === "is_verified") {
                      return (
                        <td key={c.key} className="px-3 py-2.5">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                            r.is_verified ? "bg-green-900/30 text-green-400" : "bg-orange-900/30 text-orange-400"
                          }`}>
                            {r.is_verified ? "Verified" : "Belum"}
                          </span>
                        </td>
                      );
                    }
                    return (
                      <td
                        key={c.key}
                        className={`whitespace-nowrap px-3 py-2.5 ${c.key === "nama" ? "font-medium text-foreground" : "text-muted-foreground"}`}
                      >
                        {formatCell(c, r[c.key])}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPage={setPage} className="mt-6" />
      )}

      {selected && (
        <AlumniDetailDrawer
          key={selected.id}
          alumni={selected}
          onClose={() => setSelected(null)}
          onSaved={(updated) => {
            setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            setSelected(updated);
          }}
          onDeleted={(id) => {
            setRows((prev) => prev.filter((r) => r.id !== id));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
