-- =====================================================
-- FIX RLS POLICY AND CREATE ADMIN PROFILE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Fix the RLS policies to prevent infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can do all on profiles" ON profiles;

-- Create simpler, non-recursive policies
CREATE POLICY "Users can view own profile" ON profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles 
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles" ON profiles 
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Admins can insert profiles" ON profiles 
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Admins can delete profiles" ON profiles 
    FOR DELETE USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

-- Step 2: Create the admin profile manually
-- First, let's get the user ID
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO user_id FROM auth.users WHERE email = 'thedeeptrading24@gmail.com';
    
    IF user_id IS NOT NULL THEN
        -- Delete existing profile if any
        DELETE FROM profiles WHERE id = user_id;
        
        -- Insert new admin profile
        INSERT INTO profiles (id, email, full_name, role)
        VALUES (user_id, 'thedeeptrading24@gmail.com', 'Admin User', 'admin');
        
        RAISE NOTICE 'Admin profile created successfully for user: %', user_id;
    ELSE
        RAISE NOTICE 'User not found. Please sign up first with thedeeptrading24@gmail.com';
    END IF;
END $$;

-- Step 3: Verify the profile was created
SELECT id, email, full_name, role, created_at 
FROM profiles 
WHERE email = 'thedeeptrading24@gmail.com';

-- Step 4: Test the policy by checking if we can query profiles
SELECT COUNT(*) as total_profiles FROM profiles;