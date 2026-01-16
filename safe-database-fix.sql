-- =====================================================
-- SAFE DATABASE FIX - Handles existing policies properly
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add missing columns to courses table (safe - only adds if not exists)
DO $$
BEGIN
    -- Add board column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'board') THEN
        ALTER TABLE courses ADD COLUMN board TEXT DEFAULT 'Central Government';
        RAISE NOTICE 'Added board column to courses table';
    ELSE
        RAISE NOTICE 'Board column already exists';
    END IF;
    
    -- Add duration column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'duration') THEN
        ALTER TABLE courses ADD COLUMN duration TEXT DEFAULT '6 Months';
        RAISE NOTICE 'Added duration column to courses table';
    ELSE
        RAISE NOTICE 'Duration column already exists';
    END IF;
    
    -- Add is_featured column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_featured') THEN
        ALTER TABLE courses ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_featured column to courses table';
    ELSE
        RAISE NOTICE 'Is_featured column already exists';
    END IF;
    
    -- Add is_trending column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_trending') THEN
        ALTER TABLE courses ADD COLUMN is_trending BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_trending column to courses table';
    ELSE
        RAISE NOTICE 'Is_trending column already exists';
    END IF;
    
    -- Add teacher_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'teacher_id') THEN
        ALTER TABLE courses ADD COLUMN teacher_id UUID REFERENCES profiles(id);
        RAISE NOTICE 'Added teacher_id column to courses table';
    ELSE
        RAISE NOTICE 'Teacher_id column already exists';
    END IF;
END $$;

-- 2. Update existing courses to have default values for new columns
UPDATE courses 
SET 
    board = COALESCE(board, 'Central Government'),
    duration = COALESCE(duration, '6 Months'),
    is_featured = COALESCE(is_featured, FALSE),
    is_trending = COALESCE(is_trending, FALSE)
WHERE board IS NULL OR duration IS NULL OR is_featured IS NULL OR is_trending IS NULL;

-- 3. Drop ALL existing RLS policies safely (using CASCADE to handle dependencies)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all policies on courses table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'courses'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON courses';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
    
    -- Drop all policies on profiles table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON profiles';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
    
    -- Drop all policies on videos table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'videos'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON videos';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
    
    -- Drop all policies on documents table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'documents'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON documents';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
    
    -- Drop all policies on enrollments table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'enrollments'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON enrollments';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- 4. Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- 5. Create new RLS policies for COURSES table
CREATE POLICY "courses_public_read" ON courses
    FOR SELECT
    USING (is_published = true);

CREATE POLICY "courses_admin_all" ON courses
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "courses_teacher_manage" ON courses
    FOR ALL
    USING (
        teacher_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'teacher'
        )
    );

-- 6. Create new RLS policies for PROFILES table
CREATE POLICY "profiles_own_read" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "profiles_own_update" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
    );

-- 7. Create new RLS policies for VIDEOS table
CREATE POLICY "videos_public_read" ON videos
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = videos.course_id
            AND courses.is_published = true
        )
    );

CREATE POLICY "videos_admin_teacher_all" ON videos
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'teacher')
        )
    );

-- 8. Create new RLS policies for DOCUMENTS table
CREATE POLICY "documents_public_read" ON documents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = documents.course_id
            AND courses.is_published = true
        )
    );

CREATE POLICY "documents_admin_teacher_all" ON documents
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'teacher')
        )
    );

-- 9. Create new RLS policies for ENROLLMENTS table
CREATE POLICY "enrollments_own_read" ON enrollments
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "enrollments_own_create" ON enrollments
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "enrollments_admin_all" ON enrollments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 10. Create or update site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on site_settings and create policy
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing site_settings policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'site_settings'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON site_settings';
    END LOOP;
END $$;

CREATE POLICY "site_settings_admin_all" ON site_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 11. Create or replace function for new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'student'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Verification queries
SELECT '=== COURSES TABLE COLUMNS ===' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY ordinal_position;

SELECT '=== RLS POLICIES ON COURSES ===' as info;
SELECT policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'courses'
ORDER BY policyname;

SELECT '=== SAMPLE COURSES ===' as info;
SELECT id, title, class, subject, is_published, board, duration, is_featured 
FROM courses 
LIMIT 3;

SELECT '✅ Database fix completed successfully!' as result;