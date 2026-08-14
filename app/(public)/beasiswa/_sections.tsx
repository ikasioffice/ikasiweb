"use client";

import Link from "next/link";
import { formatRupiah, hitungPersen } from "@/lib/data/beasiswa";
import { EmptyState } from "@/components/ui/empty-state";
import { useBeasiswa } from "./_use-beasiswa";
import {
  REKENING_BANK,
  REKENING_NOMOR,
  WA_NUMBER,
  baris,
  kolom,
  persenProgres,
  teks,
  timeline,
  type Konten,
} from "./_content";

const eyebrowCls =
  "inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary";
const h2Cls = "font-heading mt-3 text-2xl font-extrabold tracking-tight";
const cardCls = "rounded-xl border border-border bg-card p-5 shadow-sm";
const ctaPrimary =
  "inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90";
const ctaSecondary =
  "inline-flex h-11 items-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-semibold transition-colors hover:bg-accent";

export function IsiBeasiswa() {
  const { data, loading } = useBeasiswa();
  const c: Konten = data?.content ?? {};

  const proposalUrl = data?.rekap?.proposal_url ?? null;
  const target = data?.rekap?.target_dana ?? 0;
  const terkumpul = data?.rekap?.dana_terkumpul ?? 0;
  const persenDana = hitungPersen(terkumpul, target);
  const donatur = data?.donatur ?? [];

  const misi = baris(c, "tentang_misi");
  const goals = kolom(c, "tujuan_goals");
  const insight1 = kolom(c, "insight1_list");
  const insight2 = kolom(c, "insight2_list");
  const selesai = baris(c, "done_list");
  const tahapan = timeline(c);
  const persenTahap = persenProgres(c);
  const rekeningDesc = baris(c, "rekening_desc");
  const custom = kolom(c, "custom_sections").filter((p) => (p[0] ?? "") !== "");

  return (
    <>
      {/* ---------- Hero ---------- */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <span className={eyebrowCls}>{teks(c, "hero_eyebrow")}</span>
          <h1 className="font-heading mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {teks(c, "hero_title_line1")}{" "}
            <span className="text-primary">{teks(c, "hero_title_line2")}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {teks(c, "hero_tagline")}
          </p>
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
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/beasiswa-maskot.png"
          alt=""
          aria-hidden
          className="hidden w-32 shrink-0 select-none sm:block lg:w-40"
        />
      </div>

      {/* ---------- Tentang ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>{teks(c, "tentang_eyebrow")}</span>
        <h2 className={h2Cls}>{teks(c, "tentang_judul")}</h2>

        <div className={`${cardCls} mt-6`}>
          <div className="font-heading font-bold text-foreground">{teks(c, "tentang_latar_judul")}</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {teks(c, "tentang_latar_isi")}
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">{teks(c, "tentang_copy_1")}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{teks(c, "tentang_copy_2")}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className={cardCls}>
            <div className="font-heading font-bold text-foreground">Visi</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{teks(c, "tentang_visi")}</p>
          </div>
          <div className={cardCls}>
            <div className="font-heading font-bold text-foreground">Misi</div>
            <ul className="mt-2 space-y-2">
              {misi.map((m) => (
                <li key={m} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Tujuan ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>{teks(c, "tujuan_eyebrow")}</span>
        <h2 className={h2Cls}>{teks(c, "tujuan_judul")}</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{teks(c, "tujuan_lede")}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {goals.map((g, i) => (
            <div key={`${g[0]}-${i}`} className={`flex gap-4 ${cardCls}`}>
              <div className="font-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="font-semibold text-foreground">{g[0]}</div>
                {g[1] && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{g[1]}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Data & Fakta ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>{teks(c, "fakta_eyebrow")}</span>
        <h2 className={h2Cls}>{teks(c, "fakta_judul")}</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{teks(c, "fakta_lede")}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { judul: teks(c, "insight1_judul"), sub: teks(c, "insight1_sub"), items: insight1 },
            { judul: teks(c, "insight2_judul"), sub: teks(c, "insight2_sub"), items: insight2 },
          ].map((ins) => (
            <div key={ins.judul} className={cardCls}>
              <div className="font-heading font-bold text-foreground">{ins.judul}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{ins.sub}</div>
              <ul className="mt-4 space-y-3">
                {ins.items.map((it, i) => (
                  <li key={`${it[0]}-${i}`}>
                    <div className="font-heading text-xl font-extrabold text-primary">{it[0]}</div>
                    {it[1] && <div className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{it[1]}</div>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-primary/10 p-5 text-sm font-medium leading-relaxed text-primary">
          {teks(c, "fakta_callout")}
        </div>
      </section>

      {/* ---------- Sistematika ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>{teks(c, "sistematika_eyebrow")}</span>
        <h2 className={h2Cls}>{teks(c, "sistematika_judul")}</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{teks(c, "sistematika_lede")}</p>
      </section>

      {/* ---------- Timeline ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>{teks(c, "timeline_eyebrow")}</span>
        <h2 className={h2Cls}>{teks(c, "timeline_judul")}</h2>

        <div className={`${cardCls} mt-6`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">{teks(c, "progress_label")}</span>
            <span className="font-heading text-lg font-extrabold tabular-nums text-primary">
              {persenTahap}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700"
              style={{ width: `${persenTahap}%` }}
            />
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

        <ol className="mt-6">
          {tahapan.map((item, i) => (
            <li key={`${item.judul}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <span
                  className={`mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 ${
                    item.aktif ? "border-primary bg-primary" : "border-border bg-background"
                  }`}
                />
                {i < tahapan.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
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
                {item.desc && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Anggaran & dukungan ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>{teks(c, "anggaran_eyebrow")}</span>
        <h2 className={h2Cls}>{teks(c, "anggaran_judul")}</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{teks(c, "anggaran_lede")}</p>

        <div className={`${cardCls} mt-6`}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Target Dana
              </div>
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
              <span className="tabular-nums">{persenDana}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700"
                style={{ width: `${persenDana}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className={cardCls}>
            <div className="font-heading font-bold text-foreground">{teks(c, "rekening_judul")}</div>
            <div className="mt-3 space-y-1">
              <div className="text-sm font-semibold text-foreground">{REKENING_BANK}</div>
              <div className="font-mono text-lg font-bold tracking-wide text-primary">{REKENING_NOMOR}</div>
            </div>
            <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
              {rekeningDesc.map((b) => (
                <p key={b}>{b}</p>
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
                        <td className="px-4 py-3 tabular-nums text-muted-foreground">{i + 1}</td>
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

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{teks(c, "anggaran_note")}</p>
      </section>

      {/* ---------- Bagian tambahan (disembunyikan bila kosong) ---------- */}
      {custom.length > 0 && (
        <section className="mt-16">
          <span className={eyebrowCls}>{teks(c, "tambahan_eyebrow")}</span>
          <h2 className={h2Cls}>{teks(c, "tambahan_judul")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {custom.map((k, i) => (
              <div key={`${k[0]}-${i}`} className={cardCls}>
                <div className="font-heading font-bold text-foreground">{k[0]}</div>
                {k[1] && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{k[1]}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Kontak ---------- */}
      <section className="mt-16 pb-16">
        <span className={eyebrowCls}>{teks(c, "kontak_eyebrow")}</span>
        <h2 className={h2Cls}>{teks(c, "kontak_judul")}</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{teks(c, "kontak_lede")}</p>

        <div className={`${cardCls} mt-6`}>
          <div className="flex items-center gap-3">
            <div className="font-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
              IK
            </div>
            <div>
              <div className="font-heading font-bold text-foreground">{teks(c, "pic_nama")}</div>
              <div className="text-xs text-muted-foreground">{teks(c, "pic_title")}</div>
            </div>
          </div>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-muted-foreground">WhatsApp:</dt>
              <dd>
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:text-primary"
                >
                  {teks(c, "kontak_wa")}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-muted-foreground">Email:</dt>
              <dd>
                <a
                  href={`mailto:${teks(c, "kontak_email")}`}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {teks(c, "kontak_email")}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-muted-foreground">Instagram:</dt>
              <dd>
                <a
                  href={`https://instagram.com/${teks(c, "kontak_ig").replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:text-primary"
                >
                  {teks(c, "kontak_ig")}
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

        <p className="mt-6 text-center text-xs text-muted-foreground">{teks(c, "footer_tagline")}</p>
      </section>
    </>
  );
}
