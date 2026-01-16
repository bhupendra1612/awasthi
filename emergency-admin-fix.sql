-- =====================================================
-- EMERGENCY ADMIN FIX - Bypass RLS completely
-- Run this NOW in Supabase SQL Editor
-- =====================================================

-- 1. TEMPORARILY DISABLE RLS on profiles table completely
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Check if your profile exists and create/update it
DO $$
DECLARE
    admin_user_id UUID := '32fdc538-32ba-4dba-8ce5-11e3f5a3fdc8';
    profile_exists BOOLEAN;
BEGIN
    -- Check if profile exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = admin_user_id) INTO profile_exists;
    
    IF NOT profile_exists THEN
        -- Create the admin profile
        INSERT INTO profiles (id, email, full_name, role)
        VALUES (admin_user_id, 'thedeeptrading24@gmail.com', 'Admin User', 'admin');
        RAISE NOTICE 'Created admin profile';
    ELSE
        -- Update existing profile to admin
        UPDATE profiles SET role = 'admin', email = 'thedeeptrading24@gmail.com' WHERE id = admin_user_id;
        RAISE NOTICE 'Updated profile to admin';
    END IF;
END $$;

-- 3. Verify the profile was created/updated
SELECT 'Profile verification:' as info;
SELECT id, email, full_name, role FROM profiles WHERE id = '32fdc538-32ba-4dba-8ce5-11e3f5a3fdc8';

-- 4. TEMPORARILY DISABLE RLS on all other tables too
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- If videos table exists, disable RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'videos') THEN
        ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- If documents table exists, disable RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'documents') THEN
        ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- If enrollments table exists, disable RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enrollments') THEN
        ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

SELECT '✅ EMERGENCY FIX APPLIED!' as result;
SELECT 'RLS has been temporarily disabled on all tables.' as note;
SELECT 'Your admin profile has been created/updated.' as status;
SELECT 'Try accessing admin panel now.' as action;