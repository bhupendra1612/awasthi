-- =====================================================
-- RESTORE ADMIN ACCESS - Emergency Fix
-- Run this immediately in Supabase SQL Editor
-- =====================================================

-- 1. First, let's check what's in the profiles table
SELECT 'Current profiles:' as info;
SELECT id, email, full_name, role FROM profiles ORDER BY created_at;

-- 2. Make sure your admin email has admin role
-- Replace 'thedeeptrading24@gmail.com' with your actual admin email if different
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'thedeeptrading24@gmail.com';

-- If the profile doesn't exist, let's create it
-- First get the user ID from auth.users
DO $$
DECLARE
    admin_user_id UUID;
    profile_exists BOOLEAN;
BEGIN
    -- Get the user ID for the admin email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'thedeeptrading24@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Check if profile exists
        SELECT EXISTS(SELECT 1 FROM profiles WHERE id = admin_user_id) INTO profile_exists;
        
        IF NOT profile_exists THEN
            -- Create the admin profile
            INSERT INTO profiles (id, email, full_name, role)
            VALUES (admin_user_id, 'thedeeptrading24@gmail.com', 'Admin User', 'admin');
            RAISE NOTICE 'Created admin profile for user %', admin_user_id;
        ELSE
            -- Update existing profile to admin
            UPDATE profiles SET role = 'admin' WHERE id = admin_user_id;
            RAISE NOTICE 'Updated existing profile to admin for user %', admin_user_id;
        END IF;
    ELSE
        RAISE NOTICE 'No user found with email thedeeptrading24@gmail.com in auth.users';
    END IF;
END $$;

-- 3. Temporarily disable RLS on profiles table to ensure admin access
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 4. Re-enable RLS and create a more permissive admin policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing profiles policies
DROP POLICY IF EXISTS "profiles_view_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_full_access" ON profiles;

-- Create new, more permissive policies
CREATE POLICY "profiles_read_own_or_admin" ON profiles
    FOR SELECT
    USING (
        auth.uid() = id 
        OR 
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
        OR
        -- Fallback: if user email is admin email, allow access
        EXISTS (
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid()
            AND u.email = 'thedeeptrading24@gmail.com'
        )
    );

CREATE POLICY "profiles_update_own_or_admin" ON profiles
    FOR UPDATE
    USING (
        auth.uid() = id 
        OR 
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
        OR
        -- Fallback: if user email is admin email, allow access
        EXISTS (
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid()
            AND u.email = 'thedeeptrading24@gmail.com'
        )
    );

CREATE POLICY "profiles_insert_admin" ON profiles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
        OR
        -- Fallback: if user email is admin email, allow access
        EXISTS (
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid()
            AND u.email = 'thedeeptrading24@gmail.com'
        )
    );

-- 5. Also update courses policies to be more permissive for admin
DROP POLICY IF EXISTS "courses_public_read_policy" ON courses;
DROP POLICY IF EXISTS "courses_admin_full_access" ON courses;
DROP POLICY IF EXISTS "courses_teacher_manage_own" ON courses;

CREATE POLICY "courses_public_read" ON courses
    FOR SELECT
    USING (is_published = true);

CREATE POLICY "courses_admin_all_access" ON courses
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
        OR
        -- Fallback: if user email is admin email, allow access
        EXISTS (
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid()
            AND u.email = 'thedeeptrading24@gmail.com'
        )
    );

CREATE POLICY "courses_teacher_manage" ON courses
    FOR ALL
    USING (
        teacher_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'teacher'
        )
    );

-- 6. Update site_settings policy to be more permissive
DROP POLICY IF EXISTS "site_settings_admin_manage" ON site_settings;

CREATE POLICY "site_settings_admin_access" ON site_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
        OR
        -- Fallback: if user email is admin email, allow access
        EXISTS (
            SELECT 1 FROM auth.users u
            WHERE u.id = auth.uid()
            AND u.email = 'thedeeptrading24@gmail.com'
        )
    );

-- 7. Verification
SELECT 'Admin user verification:' as info;
SELECT 
    u.email,
    p.role,
    p.full_name,
    CASE 
        WHEN p.role = 'admin' THEN '✅ Admin access granted'
        ELSE '❌ Not admin'
    END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'thedeeptrading24@gmail.com';

SELECT '✅ ADMIN ACCESS RESTORED!' as result;
SELECT 'You should now be able to access the admin panel.' as note;
SELECT 'Try logging out and logging back in if you still have issues.' as tip;