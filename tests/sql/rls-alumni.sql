-- Test 1: alumni_public returns rows (anon can read)
SET ROLE anon;
SELECT
  CASE
    WHEN COUNT(*) > 0 THEN 'PASS: alumni_public returns rows'
    ELSE 'FAIL: alumni_public empty'
  END as test_1
FROM public.alumni_public;

-- Test 2: kolom sensitif tidak ada di alumni_public
SELECT column_name FROM information_schema.columns
WHERE table_name = 'alumni_public' AND column_name IN ('email', 'no_hp', 'tanggal_lahir');
-- Expected: 0 rows

-- Test 3: anonymous tidak bisa UPDATE alumni
SET ROLE anon;
DO $$
BEGIN
  BEGIN
    UPDATE public.alumni SET nama = 'HACK' WHERE id = (SELECT id FROM public.alumni LIMIT 1);
    RAISE EXCEPTION 'FAIL: anon was able to UPDATE alumni';
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    RAISE NOTICE 'PASS: anon cannot UPDATE alumni';
  END;
END $$;

RESET ROLE;
