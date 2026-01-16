-- =====================================================
-- DISABLE RLS COMPLETELY ON ALL TABLES
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Disable RLS on all existing tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Disable RLS on test tables
ALTER TABLE tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE test_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers DISABLE ROW LEVEL SECURITY;

-- Disable RLS on other tables if they exist
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

-- 2. Drop ALL existing RLS policies to prevent conflicts
DO $$
DECLARE
    policy_record RECORD;
    table_name TEXT;
BEGIN
    -- List of tables to clean policies from
    FOR table_name IN VALUES ('profiles'), ('courses'), ('tests'), ('questions'), ('test_enrollments'), ('test_attempts'), ('test_answers'), ('videos'), ('documents'), ('enrollments'), ('site_settings'), ('settings'), ('payments'), ('blogs'), ('teachers')
    LOOP
        -- Drop all existing policies for this table
        FOR policy_record IN 
            SELECT policyname FROM pg_policies WHERE tablename = table_name
        LOOP
            BEGIN
                EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON ' || table_name;
                RAISE NOTICE 'Dropped policy "%" from table "%"', policy_record.policyname, table_name;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop policy "%" from table "%": %', policy_record.policyname, table_name, SQLERRM;
            END;
        END LOOP;
    END LOOP;
END $$;

-- 3. Verify RLS is disabled
SELECT 'RLS Status Check:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('profiles', 'courses', 'tests', 'questions', 'test_enrollments', 'test_attempts', 'test_answers')
ORDER BY tablename;

-- 4. Check remaining policies
SELECT 'Remaining Policies:' as info;
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE tablename IN ('profiles', 'courses', 'tests', 'questions', 'test_enrollments', 'test_attempts', 'test_answers')
ORDER BY tablename, policyname;

SELECT '✅ RLS completely disabled on all tables!' as result;