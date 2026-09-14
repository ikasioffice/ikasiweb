-- Daftar peserta publik SALURUN 2026 (nama + angkatan saja, tanpa PII).
--
-- Mengikuti pola beasiswa_donasi_public: view TANPA security_invoker (mirip
-- alumni_public), berjalan sebagai owner sehingga anon bisa membaca baris
-- terverifikasi tanpa perlu -- dan tanpa pernah diberi -- policy SELECT di
-- tabel salurun_pendaftaran (yang memuat whatsapp/email/bukti_path).
--
-- Migration ini MURNI ADITIF: hanya menambah satu view + grant.

create or replace view public.salurun_pendaftaran_public as
  select id, nama, angkatan, kategori, created_at
  from public.salurun_pendaftaran
  where is_verified = true;

comment on view public.salurun_pendaftaran_public is
  'Daftar peserta SALURUN 2026 untuk halaman publik: hanya baris terverifikasi, '
  'kolom nama + angkatan + kategori saja, tanpa PII (whatsapp/email/bukti_path).';

revoke all on public.salurun_pendaftaran_public from anon, authenticated;
grant select on public.salurun_pendaftaran_public to anon, authenticated;
