-- Fix RLS policies for profiles table to allow admins to see all teachers
-- Run this in Supabase SQL Editor

-- First, let's check existing policies
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Drop existing policies if they're too restrictive
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can do anything" ON profiles;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy: Admins can view ALL profiles (including teachers)
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Admins can update ALL profiles
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Admins can insert profiles (for creating teachers)
CREATE POLICY "Admins can insert profiles" ON profiles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Allow service role to bypass RLS (for API routes with admin client)
CREATE POLICY "Service role bypass" ON profiles
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Also ensure the profiles table has all required columns
DO $$
BEGIN
    -- Add subject column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subject') THEN
        ALTER TABLE profiles ADD COLUMN subject TEXT;
    END IF;
    
    -- Add experience_years column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'experience_years') THEN
        ALTER TABLE profiles ADD COLUMN experience_years INTEGER;
    END IF;
    
    -- Add qualification column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'qualification') THEN
        ALTER TABLE profiles ADD COLUMN qualification TEXT;
    END IF;
    
    -- Add specialization column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'specialization') THEN
        ALTER TABLE profiles ADD COLUMN specialization TEXT;
    END IF;
    
    -- Add bio column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
    
    -- Add is_active column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_active') THEN
        ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Verify: Check all teachers in the system
SELECT id, email, full_name, role, subject, is_active, created_at 
FROM profiles 
WHERE role = 'teacher'
ORDER BY created_at DESC;
