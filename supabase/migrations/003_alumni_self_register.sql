-- Pendaftaran alumni mandiri (form publik /daftar, tanpa login).
-- Mengizinkan role anon & authenticated meng-INSERT record alumni PENDING,
-- dibatasi ketat lewat WITH CHECK agar tidak bisa:
--   - membuat row yang sudah terverifikasi (is_verified harus false),
--   - mengklaim kepemilikan (auth_user_id harus null),
--   - mengirim data tanpa identitas minimum (nama, angkatan, email wajib).
--
-- Row pending TIDAK tampil publik karena view alumni_public memfilter
-- is_verified = true, dan otomatis masuk antrian "Belum Terverifikasi" di
-- panel admin (/admin/alumni?filter=unverified) untuk di-approve. Setelah
-- di-approve, alumni login via magic link memakai email yang didaftarkan
-- (trigger auto-link mencocokkan berdasarkan email).

create policy alumni_self_register_insert
on public.alumni
for insert
to anon, authenticated
with check (
  is_verified = false
  and is_form_filled = true
  and auth_user_id is null
  and nama is not null
  and angkatan is not null
  and email is not null
);
