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
-- Bersih-bersih baris uji (jalankan sebagai postgres/admin)
-- ============================================================
DELETE FROM public.beasiswa_donasi WHERE angkatan = '2099';
