"use client";

import Link from "next/link";
import { formatRupiah, hitungPersen } from "@/lib/data/beasiswa";
import { EmptyState } from "@/components/ui/empty-state";
import { useBeasiswa } from "./_use-beasiswa";
import {
  DEFAULT_ANGGARAN_NOTE,
  DEFAULT_DONE_LIST,
  DEFAULT_FAKTA_CALLOUT,
  DEFAULT_HERO_TAGLINE,
  DEFAULT_KONTAK_EMAIL,
  DEFAULT_KONTAK_IG,
  DEFAULT_KONTAK_WA,
  DEFAULT_PIC_NAMA,
  DEFAULT_PIC_TITLE,
  DEFAULT_PROGRESS_LABEL,
  DEFAULT_PROGRESS_PERCENT,
  DEFAULT_REKENING_DESC,
  DEFAULT_REKENING_JUDUL,
  DEFAULT_TIMELINE,
  WA_NUMBER,
  parseLines,
  parseTimeline,
} from "./_content";

const cardCls = "rounded-xl border border-border bg-card p-5 shadow-sm";
const ctaPrimary =
  "inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90";
const ctaSecondary =
  "inline-flex h-11 items-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-semibold transition-colors hover:bg-accent";

// ============================================================
// Hero: tagline + tombol unduh proposal
// ============================================================

export function HeroAksi() {
  const { data } = useBeasiswa();
  const tagline = data?.content.hero_tagline || DEFAULT_HERO_TAGLINE;
  const proposalUrl = data?.rekap?.proposal_url ?? null;

  return (
    <>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{tagline}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/beasiswa/dukung" className={ctaPrimary}>
          Dukung Program Ini
        </Link>
        {proposalUrl && (
          <a href={proposalUrl} target="_blank" rel="noopener noreferrer" className={ctaSecondary}>
            Unduh Proposal
          </a>
        )}
      </div>
    </>
  );
}

// ============================================================
// Data & Fakta: kalimat sorotan
// ============================================================

export function FaktaCallout() {
  const { data } = useBeasiswa();
  const teks = data?.content.fakta_callout || DEFAULT_FAKTA_CALLOUT;
  return (
    <div className="mt-6 rounded-xl bg-primary/10 p-5 text-sm font-medium leading-relaxed text-primary">
      {teks}
    </div>
  );
}

// ============================================================
// Timeline + progres tahapan
// ============================================================

export function TimelineProgres() {
  const { data } = useBeasiswa();
  const label = data?.content.progress_label || DEFAULT_PROGRESS_LABEL;
  const persenRaw = Number(data?.content.progress_percent);
  const persen = Number.isFinite(persenRaw)
    ? Math.min(100, Math.max(0, persenRaw))
    : DEFAULT_PROGRESS_PERCENT;
  const selesai = parseLines(data?.content.done_list) ?? DEFAULT_DONE_LIST;
  const timeline = parseTimeline(data?.content.timeline_items) ?? DEFAULT_TIMELINE;

  return (
    <>
      <div className={`${cardCls} mt-6`}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <span className="font-heading text-lg font-extrabold tabular-nums text-primary">{persen}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${persen}%` }} />
        </div>

        <div className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Sudah diselesaikan
        </div>
        <ul className="mt-3 space-y-2">
          {selesai.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10l4 4 8-9" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <ol className="mt-6 space-y-0">
        {timeline.map((item, i) => (
          <li key={`${item.judul}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                className={`mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 ${
                  item.aktif ? "border-primary bg-primary" : "border-border bg-background"
                }`}
              />
              {i < timeline.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className="min-w-0 pb-1">
              <div className="text-xs text-muted-foreground">
                {item.tanggal}
                {item.status && (
                  <>
                    {" · "}
                    <span className={item.aktif ? "font-semibold text-primary" : ""}>{item.status}</span>
                  </>
                )}
              </div>
              <div className="font-heading mt-0.5 font-bold text-foreground">{item.judul}</div>
              {item.desc && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

// ============================================================
// Dana terkumpul, rekening, dan daftar donatur
// ============================================================

export function DanaDukungan() {
  const { data, loading } = useBeasiswa();
  const target = data?.rekap?.target_dana ?? 0;
  const terkumpul = data?.rekap?.dana_terkumpul ?? 0;
  const persen = hitungPersen(terkumpul, target);
  const donatur = data?.donatur ?? [];

  const rekeningJudul = data?.content.rekening_judul || DEFAULT_REKENING_JUDUL;
  const rekeningBaris = parseLines(data?.content.rekening_desc) ?? parseLines(DEFAULT_REKENING_DESC)!;
  const catatan = data?.content.anggaran_note || DEFAULT_ANGGARAN_NOTE;

  return (
    <>
      {/* Progres dana */}
      <div className={`${cardCls} mt-6`}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Dana</div>
            <div className="font-heading mt-1 text-2xl font-extrabold tabular-nums text-foreground">
              {loading ? "—" : formatRupiah(target)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Terkumpul dari Alumni
            </div>
            <div className="font-heading mt-1 text-2xl font-extrabold tabular-nums text-primary">
              {loading ? "—" : formatRupiah(terkumpul)}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{donatur.length} donatur terverifikasi</span>
            <span className="tabular-nums">{persen}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${persen}%` }} />
          </div>
        </div>
      </div>

      {/* Rekening + QRIS */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className={cardCls}>
          <div className="font-heading font-bold text-foreground">{rekeningJudul}</div>
          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {rekeningBaris.map((baris, i) => (
              <div key={baris} className={i === 1 ? "font-mono text-base font-bold text-foreground" : ""}>
                {baris}
              </div>
            ))}
          </div>
        </div>
        <div className={`${cardCls} flex flex-col items-center justify-center`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/beasiswa-qris.png"
            alt="Kode QRIS untuk donasi Beasiswa Alumni IKASI"
            className="w-full max-w-[240px] rounded-lg"
          />
          <div className="mt-3 text-center text-xs text-muted-foreground">
            Satu QRIS untuk semua — scan untuk donasi
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/beasiswa/dukung" className={ctaPrimary}>
          Kirim Bukti Dukungan
        </Link>
        <span className="text-sm text-muted-foreground">
          Sudah transfer? Kirim buktinya agar dukungan Anda tercatat.
        </span>
      </div>

      {/* Daftar donatur */}
      <div className="mt-10">
        <h3 className="font-heading text-lg font-extrabold tracking-tight">
          Alumni yang Memberi Dukungan
        </h3>
        {loading ? (
          <div className="mt-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : donatur.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Belum ada dukungan terverifikasi"
              description="Daftar ini akan terisi setelah admin memverifikasi bukti dukungan yang masuk."
            />
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-bold">No</th>
                    <th className="px-4 py-3 font-bold">Nama</th>
                    <th className="px-4 py-3 font-bold">Angkatan</th>
                    <th className="px-4 py-3 text-right font-bold">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {donatur.map((d, i) => (
                    <tr key={d.id ?? i} className="border-t border-border">
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{d.nama ?? "Alumni"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{d.angkatan ?? "-"}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-primary">
                        {formatRupiah(d.nominal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{catatan}</p>
    </>
  );
}

// ============================================================
// Kontak
// ============================================================

export function KontakInfo() {
  const { data } = useBeasiswa();
  const nama = data?.content.pic_nama || DEFAULT_PIC_NAMA;
  const title = data?.content.pic_title || DEFAULT_PIC_TITLE;
  const wa = data?.content.kontak_wa || DEFAULT_KONTAK_WA;
  const email = data?.content.kontak_email || DEFAULT_KONTAK_EMAIL;
  const ig = data?.content.kontak_ig || DEFAULT_KONTAK_IG;

  return (
    <div className={`${cardCls} mt-6`}>
      <div className="flex items-center gap-3">
        <div className="font-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
          IK
        </div>
        <div>
          <div className="font-heading font-bold text-foreground">{nama}</div>
          <div className="text-xs text-muted-foreground">{title}</div>
        </div>
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-muted-foreground">WhatsApp:</dt>
          <dd>
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-primary">
              {wa}
            </a>
          </dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-muted-foreground">Email:</dt>
          <dd>
            <a href={`mailto:${email}`} className="font-medium text-foreground hover:text-primary">{email}</a>
          </dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-muted-foreground">Instagram:</dt>
          <dd>
            <a href={`https://instagram.com/${ig.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-primary">
              {ig}
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo IKASI, saya ingin bertanya tentang Program Beasiswa Alumni.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={ctaPrimary}
        >
          Hubungi Kami
        </a>
      </div>
    </div>
  );
}
