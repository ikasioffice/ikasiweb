-- SALURUN 2026: ukuran jersey sampai 5XL + donasi tambahan opsional saat daftar.
--
-- Migration ini MURNI ADITIF/PENYESUAIAN CHECK CONSTRAINT saja -- tidak
-- mengubah data yang sudah ada (tabel salurun_pendaftaran masih kosong saat
-- migration ini ditulis, tapi ditulis idempotent supaya aman diulang).

-- ---------- 1. Perluas pilihan ukuran jersey ----------
alter table public.salurun_pendaftaran
  drop constraint if exists salurun_pendaftaran_ukuran_jersey_check;
alter table public.salurun_pendaftaran
  add constraint salurun_pendaftaran_ukuran_jersey_check
  check (ukuran_jersey in ('S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'));

-- ---------- 2. Kolom donasi tambahan (opsional, di luar biaya pendaftaran) ----------
alter table public.salurun_pendaftaran
  add column if not exists donasi bigint not null default 0 check (donasi >= 0);

comment on column public.salurun_pendaftaran.donasi is
  'Donasi tambahan opsional di luar biaya pendaftaran tetap, ditambahkan peserta saat mendaftar.';
comment on column public.salurun_pendaftaran.nominal is
  'Total yang perlu/sudah dibayar peserta = biaya pendaftaran tetap (sesuai kategori) + donasi opsional.';

-- ---------- 3. Perbarui WITH CHECK insert publik ----------
drop policy if exists salurun_pendaftaran_public_insert on public.salurun_pendaftaran;
create policy salurun_pendaftaran_public_insert
  on public.salurun_pendaftaran for insert to anon, authenticated
  with check (
    is_verified = false
    and nama          is not null and length(btrim(nama))     > 0
    and whatsapp      is not null and length(btrim(whatsapp)) > 0
    and angkatan      is not null and length(btrim(angkatan)) > 0
    and kategori in ('mahasiswa', 'alumni')
    and ukuran_jersey in ('S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL')
    and metode in ('Transfer Bank', 'QRIS')
    and donasi >= 0
    and nominal > 0
  );
