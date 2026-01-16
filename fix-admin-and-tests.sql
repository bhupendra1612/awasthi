-- =====================================================
-- FIX ADMIN ACCESS + TEST TABLES
-- Run this immediately in Supabase SQL Editor
-- =====================================================

-- 1. DISABLE RLS on all tables to restore admin access
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Disable RLS on test tables if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        ALTER TABLE tests DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'questions') THEN
        ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'test_enrollments') THEN
        ALTER TABLE test_enrollments DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'test_attempts') THEN
        ALTER TABLE test_attempts DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'test_answers') THEN
        ALTER TABLE test_answers DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Disable RLS on other tables
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'videos') THEN
        ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'documents') THEN
        ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enrollments') THEN
        ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings') THEN
        ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'settings') THEN
        ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
        ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blogs') THEN
        ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'teachers') THEN
        ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 2. Make sure admin profile exists and has admin role
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'thedeeptrading24@gmail.com';

-- Also update by user ID if email update didn't work
UPDATE profiles 
SET role = 'admin' 
WHERE id = '32fdc538-32ba-4dba-8ce5-11e3f5a3fdc8';

-- 3. Verify admin status
SELECT 'Admin verification:' as info;
SELECT id, email, full_name, role FROM profiles 
WHERE email = 'thedeeptrading24@gmail.com' OR id = '32fdc538-32ba-4dba-8ce5-11e3f5a3fdc8';

-- 4. Verify test tables exist
SELECT 'Test tables status:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('tests', 'questions', 'test_enrollments', 'test_attempts', 'test_answers')
ORDER BY table_name;

SELECT '✅ Admin access restored! RLS disabled on all tables.' as result;