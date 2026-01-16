-- =====================================================
-- COMPLETE FIX FOR RLS POLICIES
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Disable RLS temporarily to fix the issue
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies on profiles table
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
    END LOOP;
END $$;

-- Step 3: Create/Update the admin profile while RLS is disabled
INSERT INTO profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Admin User'),
    'admin'
FROM auth.users 
WHERE email = 'thedeeptrading24@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin',
    email = EXCLUDED.email;

-- Step 4: Verify profile exists
SELECT 'Profile check:' as info, id, email, full_name, role 
FROM profiles 
WHERE email = 'thedeeptrading24@gmail.com';

-- Step 5: Create simple, non-recursive policies
CREATE POLICY "profiles_select_own" ON profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles 
    FOR UPDATE USING (auth.uid() = id);

-- Step 6: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Final verification
SELECT 'Final check:' as info, id, email, full_name, role 
FROM profiles 
WHERE email = 'thedeeptrading24@gmail.com';