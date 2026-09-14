-- Tambahan untuk SALURUN 2026: field angkatan peserta + metode pembayaran.
--
-- Migration ini MURNI ADITIF (ALTER TABLE ADD COLUMN saja), aman dijalankan
-- kapan saja -- tabel salurun_pendaftaran masih kosong saat migration ini
-- ditulis, tapi kolom baru tetap dibuat nullable dulu lalu di-backfill supaya
-- pola ini aman diulang di lingkungan mana pun (idempotent, tidak menganggap
-- tabel kosong).

alter table public.salurun_pendaftaran
  add column if not exists angkatan text,
  add column if not exists metode   text;

-- Backfill baris lama (jika ada) sebelum kolom dikunci NOT NULL / CHECK.
update public.salurun_pendaftaran
  set angkatan = coalesce(angkatan, '-')
  where angkatan is null;

update public.salurun_pendaftaran
  set metode = coalesce(metode, 'Transfer Bank')
  where metode is null;

alter table public.salurun_pendaftaran
  alter column angkatan set not null,
  alter column metode   set not null,
  alter column metode   set default 'Transfer Bank';

alter table public.salurun_pendaftaran
  drop constraint if exists salurun_pendaftaran_metode_check;
alter table public.salurun_pendaftaran
  add constraint salurun_pendaftaran_metode_check
  check (metode in ('Transfer Bank', 'QRIS'));

comment on column public.salurun_pendaftaran.angkatan is
  'Angkatan peserta (tahun masuk Polban), diisi baik oleh mahasiswa maupun alumni.';
comment on column public.salurun_pendaftaran.metode is
  'Metode pembayaran yang dipilih peserta: Transfer Bank atau QRIS.';

-- Perbarui WITH CHECK insert publik agar mewajibkan angkatan & membatasi metode.
drop policy if exists salurun_pendaftaran_public_insert on public.salurun_pendaftaran;
create policy salurun_pendaftaran_public_insert
  on public.salurun_pendaftaran for insert to anon, authenticated
  with check (
    is_verified = false
    and nama          is not null and length(btrim(nama))     > 0
    and whatsapp      is not null and length(btrim(whatsapp)) > 0
    and angkatan      is not null and length(btrim(angkatan)) > 0
    and kategori in ('mahasiswa', 'alumni')
    and ukuran_jersey in ('S', 'M', 'L', 'XL', 'XXL')
    and metode in ('Transfer Bank', 'QRIS')
    and nominal > 0
  );
