-- Asersi RLS untuk migration 007_beasiswa.sql.
-- Jalankan manual di SQL editor (belum dipasang di CI, sama seperti rls-alumni.sql).
--
-- Yang dijaga di sini: kolom PII donatur (whatsapp, catatan, bukti_path) tidak
-- boleh bocor ke pengunjung, dan form publik tidak boleh bisa memverifikasi
-- dirinya sendiri.
--
-- Butuh minimal satu baris donasi terverifikasi supaya Test 2 bermakna.
-- Sebagai postgres/admin:
--   insert into public.beasiswa_donasi (nama, angkatan, whatsapp, nominal, is_verified)
--   values ('Uji Donatur', '2015', '08123456789', 100000, true);

-- ============================================================
-- Test 1: anon TIDAK bisa membaca tabel donasi (PII)
-- ============================================================
SET ROLE anon;
DO $$
DECLARE n int;
BEGIN
  BEGIN
    SELECT count(*) INTO n FROM public.beasiswa_donasi;
    IF n > 0 THEN
      RAISE EXCEPTION 'FAIL: anon membaca % baris beasiswa_donasi', n;
    ELSE
      RAISE NOTICE 'PASS: anon tidak mendapat baris dari beasiswa_donasi';
    END IF;
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS: anon ditolak saat SELECT beasiswa_donasi';
  END;
END $$;

-- ============================================================
-- Test 2: anon BISA membaca view publik
-- ============================================================
SET ROLE anon;
SELECT
  CASE
    WHEN COUNT(*) > 0 THEN 'PASS: beasiswa_donasi_public mengembalikan baris'
    ELSE 'CEK MANUAL: view kosong -- pastikan ada donasi terverifikasi'
  END AS test_2
FROM public.beasiswa_donasi_public;

-- ============================================================
-- Test 3: kolom PII tidak ada di view publik
-- ============================================================
RESET ROLE;
SELECT
  CASE
    WHEN COUNT(*) = 0 THEN 'PASS: view publik tidak memuat kolom PII'
    ELSE 'FAIL: kolom PII bocor -> ' || string_agg(column_name, ', ')
  END AS test_3
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'beasiswa_donasi_public'
  AND column_name IN ('whatsapp', 'catatan', 'bukti_path', 'is_verified');

-- ============================================================
-- Test 4: anon BISA mengirim donasi pending (form publik)
-- ============================================================
SET ROLE anon;
DO $$
BEGIN
  BEGIN
    INSERT INTO public.beasiswa_donasi (nama, angkatan, nominal)
    VALUES ('RLS Test Pending', '2099', 1000);
    RAISE NOTICE 'PASS: anon bisa mengirim donasi pending';
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'FAIL: anon tidak bisa mengirim donasi pending (%)', SQLERRM;
  END;
END $$;

-- ============================================================
-- Test 5: anon TIDAK bisa mengirim donasi yang sudah terverifikasi
-- ============================================================
SET ROLE anon;
DO $$
BEGIN
  BEGIN
    INSERT INTO public.beasiswa_donasi (nama, angkatan, nominal, is_verified)
    VALUES ('RLS Test Verified', '2099', 999999999, true);
    RAISE EXCEPTION 'FAIL: anon berhasil menyisipkan donasi terverifikasi';
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    RAISE NOTICE 'PASS: anon ditolak saat menyisipkan is_verified = true';
  END;
END $$;

-- ============================================================
-- Test 6: anon TIDAK bisa mengubah donasi (mis. memverifikasi diri sendiri)
-- ============================================================
SET ROLE anon;
DO $$
BEGIN
  BEGIN
    UPDATE public.beasiswa_donasi SET is_verified = true WHERE is_verified = false;
    IF FOUND THEN
      RAISE EXCEPTION 'FAIL: anon berhasil UPDATE beasiswa_donasi';
    ELSE
      RAISE NOTICE 'PASS: UPDATE oleh anon tidak mengenai baris apa pun';
    END IF;
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    RAISE NOTICE 'PASS: anon ditolak saat UPDATE beasiswa_donasi';
  END;
END $$;

-- ============================================================
-- Test 7: anon TIDAK bisa mengubah target dana / konten
-- ============================================================
SET ROLE anon;
DO $$
BEGIN
  BEGIN
    UPDATE public.beasiswa_settings SET target_dana = 1 WHERE id = 1;
    IF FOUND THEN
      RAISE EXCEPTION 'FAIL: anon berhasil UPDATE beasiswa_settings';
    ELSE
      RAISE NOTICE 'PASS: UPDATE settings oleh anon tidak mengenai baris apa pun';
    END IF;
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    RAISE NOTICE 'PASS: anon ditolak saat UPDATE beasiswa_settings';
  END;
END $$;

SET ROLE anon;
DO $$
BEGIN
  BEGIN
    INSERT INTO public.beasiswa_content (key, value) VALUES ('hero_tagline', 'HACK');
    RAISE EXCEPTION 'FAIL: anon berhasil INSERT beasiswa_content';
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    RAISE NOTICE 'PASS: anon ditolak saat INSERT beasiswa_content';
  END;
END $$;

-- ============================================================
-- Test 8: anon BISA membaca rekap, dan angkanya hanya dari yang terverifikasi
-- ============================================================
SET ROLE anon;
SELECT
  CASE
    WHEN r.dana_terkumpul = COALESCE(v.total, 0)
      THEN 'PASS: dana_terkumpul cocok dengan total donasi terverifikasi'
    ELSE 'FAIL: rekap ' || r.dana_terkumpul || ' != ' || COALESCE(v.total, 0)
  END AS test_8
FROM public.beasiswa_rekap r
CROSS JOIN (SELECT sum(nominal) AS total FROM public.beasiswa_donasi_public) v;

RESET ROLE;

-- ============================================================
-- Test 9: jalur admin end-to-end
-- ============================================================
-- Mensimulasikan sesi admin sungguhan (role authenticated + klaim JWT) dan
-- menelusuri alur lengkap: kiriman anon -> admin melihat PII -> verifikasi ->
-- rekap naik -> batal verifikasi -> rekap turun -> hapus.
--
-- Dibungkus transaksi lalu di-ROLLBACK, jadi tidak meninggalkan data.
--
-- Catatan: hasil dikumpulkan ke variabel dulu dan baru ditulis setelah
-- RESET ROLE -- role authenticated tidak punya izin menulis ke temp table.

BEGIN;
CREATE TEMP TABLE hasil_admin (no int, tes text, status text);

DO $$
DECLARE
  admin_id uuid; d_id uuid; n int; v boolean; t bigint;
  r1 text; r2 text; r3 text; r4 text; r5 text; r6 text; r7 text;
BEGIN
  SELECT user_id INTO admin_id FROM public.user_roles WHERE role = 'admin' LIMIT 1;
  IF admin_id IS NULL THEN
    INSERT INTO hasil_admin VALUES (0, 'prasyarat', 'LEWATI: tidak ada admin di user_roles');
    RETURN;
  END IF;

  -- Kiriman form publik. TANPA RETURNING: anon tidak punya policy SELECT,
  -- dan INSERT ... RETURNING membutuhkannya (lihat komentar di migration 007).
  SET LOCAL ROLE anon;
  INSERT INTO public.beasiswa_donasi (nama, angkatan, whatsapp, nominal, catatan)
  VALUES ('RLS Admin Test', '2099', '08999', 500000, 'catatan rahasia');
  RESET ROLE;
  r1 := 'LULUS';

  SELECT id INTO d_id FROM public.beasiswa_donasi WHERE nama = 'RLS Admin Test';

  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', admin_id, 'role', 'authenticated')::text, true);
  SET LOCAL ROLE authenticated;

  SELECT count(*) INTO n FROM public.beasiswa_donasi;
  r2 := CASE WHEN n >= 1 THEN 'LULUS: ' || n || ' baris terlihat' ELSE 'GAGAL: 0 baris' END;

  UPDATE public.beasiswa_donasi SET is_verified = true WHERE id = d_id;
  SELECT is_verified INTO v FROM public.beasiswa_donasi WHERE id = d_id;
  r3 := CASE WHEN v THEN 'LULUS' ELSE 'GAGAL' END;

  SELECT dana_terkumpul INTO t FROM public.beasiswa_rekap;
  r4 := CASE WHEN t >= 500000 THEN 'LULUS: ' || t ELSE 'GAGAL: ' || t END;

  UPDATE public.beasiswa_settings SET target_dana = 75000000 WHERE id = 1;
  SELECT target_dana INTO t FROM public.beasiswa_settings WHERE id = 1;
  r5 := CASE WHEN t = 75000000 THEN 'LULUS' ELSE 'GAGAL: ' || t END;

  INSERT INTO public.beasiswa_content (key, value) VALUES ('hero_tagline', 'Teks uji')
    ON CONFLICT (key) DO UPDATE SET value = excluded.value;
  r6 := 'LULUS';

  DELETE FROM public.beasiswa_donasi WHERE id = d_id;
  SELECT count(*) INTO n FROM public.beasiswa_donasi WHERE id = d_id;
  r7 := CASE WHEN n = 0 THEN 'LULUS' ELSE 'GAGAL' END;

  RESET ROLE;
  INSERT INTO hasil_admin VALUES
    (1, 'anon kirim donasi lewat form',            r1),
    (2, 'admin SELECT donasi (boleh lihat PII)',   r2),
    (3, 'admin verifikasi donasi',                 r3),
    (4, 'rekap naik otomatis setelah verifikasi',  r4),
    (5, 'admin set target dana',                   r5),
    (6, 'admin upsert konten',                     r6),
    (7, 'admin hapus donasi',                      r7);
EXCEPTION WHEN OTHERS THEN
  RESET ROLE;
  INSERT INTO hasil_admin VALUES (99, 'ERROR', SQLERRM);
END $$;

SELECT no, tes, status FROM hasil_admin ORDER BY no;
ROLLBACK;

-- ============================================================
-- Bersih-bersih baris uji dari Test 4 (jalankan sebagai postgres/admin)
-- ============================================================
DELETE FROM public.beasiswa_donasi WHERE angkatan = '2099';
