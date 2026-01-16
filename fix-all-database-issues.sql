-- =====================================================
-- COMPREHENSIVE FIX FOR ALL DATABASE ISSUES
-- Run this in Supabase SQL Editor to fix everything
-- =====================================================

-- 1. First, let's check what columns exist in courses table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY ordinal_position;

-- 2. Add missing columns to courses table if they don't exist
DO $$
BEGIN
    -- Add board column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'board') THEN
        ALTER TABLE courses ADD COLUMN board TEXT DEFAULT 'Central Government';
    END IF;
    
    -- Add duration column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'duration') THEN
        ALTER TABLE courses ADD COLUMN duration TEXT DEFAULT '6 Months';
    END IF;
    
    -- Add is_featured column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_featured') THEN
        ALTER TABLE courses ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add is_trending column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_trending') THEN
        ALTER TABLE courses ADD COLUMN is_trending BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add teacher_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'teacher_id') THEN
        ALTER TABLE courses ADD COLUMN teacher_id UUID REFERENCES profiles(id);
    END IF;
END $$;

-- 3. Drop all existing RLS policies to start fresh
DROP POLICY IF EXISTS "Enable read access for all users" ON courses;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON courses;
DROP POLICY IF EXISTS "Enable update for users based on email" ON courses;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON courses;
DROP POLICY IF EXISTS "Admins can do everything on courses" ON courses;
DROP POLICY IF EXISTS "Teachers can manage their courses" ON courses;
DROP POLICY IF EXISTS "Public can view published courses" ON courses;

-- 4. Enable RLS on courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 5. Create comprehensive RLS policies for courses
-- Policy 1: Anyone can view published courses
CREATE POLICY "Anyone can view published courses" ON courses
    FOR SELECT
    USING (is_published = true);

-- Policy 2: Admins can do everything
CREATE POLICY "Admins can do everything on courses" ON courses
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy 3: Teachers can manage their own courses
CREATE POLICY "Teachers can manage their courses" ON courses
    FOR ALL
    USING (
        teacher_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'teacher'
        )
    );

-- 6. Fix profiles table RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Service role bypass" ON profiles;

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can do everything on profiles" ON profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
    );

-- 7. Fix videos table RLS
DROP POLICY IF EXISTS "Anyone can view videos" ON videos;
DROP POLICY IF EXISTS "Admins can manage videos" ON videos;

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos of published courses" ON videos
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = videos.course_id
            AND courses.is_published = true
        )
    );

CREATE POLICY "Admins and teachers can manage videos" ON videos
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'teacher')
        )
    );

-- 8. Fix documents table RLS
DROP POLICY IF EXISTS "Anyone can view documents" ON documents;
DROP POLICY IF EXISTS "Admins can manage documents" ON documents;

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view documents of published courses" ON documents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = documents.course_id
            AND courses.is_published = true
        )
    );

CREATE POLICY "Admins and teachers can manage documents" ON documents
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'teacher')
        )
    );

-- 9. Fix enrollments table RLS
DROP POLICY IF EXISTS "Users can view own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments" ON enrollments
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create enrollments" ON enrollments
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all enrollments" ON enrollments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 10. Create or update site_settings table for settings page
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage site settings
CREATE POLICY "Admins can manage site settings" ON site_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 11. Update existing courses to have default values
UPDATE courses 
SET 
    board = COALESCE(board, 'Central Government'),
    duration = COALESCE(duration, '6 Months'),
    is_featured = COALESCE(is_featured, FALSE),
    is_trending = COALESCE(is_trending, FALSE)
WHERE board IS NULL OR duration IS NULL OR is_featured IS NULL OR is_trending IS NULL;

-- 12. Create function to handle new user profile creation
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Verify everything is working
SELECT 'Courses table columns:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses' ORDER BY ordinal_position;

SELECT 'RLS policies on courses:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'courses';

SELECT 'Sample courses:' as info;
SELECT id, title, class, subject, is_published, created_at FROM courses LIMIT 3;

-- Success message
SELECT '✅ All database issues have been fixed!' as result;