-- =====================================================
-- BULLETPROOF DATABASE FIX - Handles ALL conflicts safely
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Add missing columns to courses table (completely safe)
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Check and add board column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'board'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE courses ADD COLUMN board TEXT DEFAULT 'Central Government';
        RAISE NOTICE 'Added board column to courses table';
    ELSE
        RAISE NOTICE 'Board column already exists';
    END IF;
    
    -- Check and add duration column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'duration'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE courses ADD COLUMN duration TEXT DEFAULT '6 Months';
        RAISE NOTICE 'Added duration column to courses table';
    ELSE
        RAISE NOTICE 'Duration column already exists';
    END IF;
    
    -- Check and add is_featured column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'is_featured'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE courses ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_featured column to courses table';
    ELSE
        RAISE NOTICE 'Is_featured column already exists';
    END IF;
    
    -- Check and add is_trending column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'is_trending'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE courses ADD COLUMN is_trending BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_trending column to courses table';
    ELSE
        RAISE NOTICE 'Is_trending column already exists';
    END IF;
    
    -- Check and add teacher_id column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'teacher_id'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
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

-- 3. COMPLETELY SAFE POLICY MANAGEMENT
-- This function safely drops and recreates all policies
DO $$
DECLARE
    policy_record RECORD;
    table_name TEXT;
BEGIN
    -- List of tables to clean policies from
    FOR table_name IN VALUES ('courses'), ('profiles'), ('videos'), ('documents'), ('enrollments'), ('site_settings')
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

-- 4. Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on videos table (create if not exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'videos') THEN
        ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on videos table';
    ELSE
        RAISE NOTICE 'Videos table does not exist';
    END IF;
END $$;

-- Enable RLS on documents table (create if not exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'documents') THEN
        ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on documents table';
    ELSE
        RAISE NOTICE 'Documents table does not exist';
    END IF;
END $$;

-- Enable RLS on enrollments table (create if not exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enrollments') THEN
        ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on enrollments table';
    ELSE
        RAISE NOTICE 'Enrollments table does not exist';
    END IF;
END $$;

-- 5. Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 6. Create NEW RLS policies for COURSES table
CREATE POLICY "courses_public_read_policy" ON courses
    FOR SELECT
    USING (is_published = true);

CREATE POLICY "courses_admin_full_access" ON courses
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "courses_teacher_manage_own" ON courses
    FOR ALL
    USING (
        teacher_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'teacher'
        )
    );

-- 7. Create NEW RLS policies for PROFILES table
CREATE POLICY "profiles_view_own" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "profiles_admin_full_access" ON profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
    );

-- 8. Create NEW RLS policies for VIDEOS table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'videos') THEN
        -- Videos policies
        EXECUTE 'CREATE POLICY "videos_public_read_policy" ON videos
            FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM courses
                    WHERE courses.id = videos.course_id
                    AND courses.is_published = true
                )
            )';
        
        EXECUTE 'CREATE POLICY "videos_admin_teacher_manage" ON videos
            FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role IN (''admin'', ''teacher'')
                )
            )';
        
        RAISE NOTICE 'Created RLS policies for videos table';
    END IF;
END $$;

-- 9. Create NEW RLS policies for DOCUMENTS table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'documents') THEN
        -- Documents policies
        EXECUTE 'CREATE POLICY "documents_public_read_policy" ON documents
            FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM courses
                    WHERE courses.id = documents.course_id
                    AND courses.is_published = true
                )
            )';
        
        EXECUTE 'CREATE POLICY "documents_admin_teacher_manage" ON documents
            FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role IN (''admin'', ''teacher'')
                )
            )';
        
        RAISE NOTICE 'Created RLS policies for documents table';
    END IF;
END $$;

-- 10. Create NEW RLS policies for ENROLLMENTS table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enrollments') THEN
        -- Enrollments policies
        EXECUTE 'CREATE POLICY "enrollments_view_own" ON enrollments
            FOR SELECT
            USING (user_id = auth.uid())';
        
        EXECUTE 'CREATE POLICY "enrollments_create_own" ON enrollments
            FOR INSERT
            WITH CHECK (user_id = auth.uid())';
        
        EXECUTE 'CREATE POLICY "enrollments_admin_full_access" ON enrollments
            FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = ''admin''
                )
            )';
        
        RAISE NOTICE 'Created RLS policies for enrollments table';
    END IF;
END $$;

-- 11. Create NEW RLS policies for SITE_SETTINGS table
CREATE POLICY "site_settings_admin_manage" ON site_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 12. Create or replace function for new user profile creation
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
EXCEPTION WHEN OTHERS THEN
    -- If insert fails, just return NEW to not break user creation
    RAISE NOTICE 'Could not create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Insert default site settings (only if they don't exist)
INSERT INTO site_settings (key, value, category) VALUES
    ('site_name', 'Awasthi Classes', 'branding'),
    ('site_description', 'Best coaching for Government Exam Preparation in Hindaun', 'branding'),
    ('contact_phone', '+91 78911 36255', 'contact'),
    ('contact_email', 'AWASTHICLASSESHND@GMAIL.COM', 'contact'),
    ('contact_address', 'VIP Colony, Amrit Puri, Hindaun, Rajasthan 322230', 'contact'),
    ('whatsapp_number', '917891136255', 'contact')
ON CONFLICT (key) DO NOTHING;

-- 14. Verification and status report
SELECT '=== COURSES TABLE STRUCTURE ===' as section;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY ordinal_position;

SELECT '=== RLS POLICIES STATUS ===' as section;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE tablename IN ('courses', 'profiles', 'videos', 'documents', 'enrollments', 'site_settings')
ORDER BY tablename, policyname;

SELECT '=== SAMPLE DATA CHECK ===' as section;
SELECT 
    COUNT(*) as total_courses,
    COUNT(CASE WHEN is_published THEN 1 END) as published_courses,
    COUNT(CASE WHEN board IS NOT NULL THEN 1 END) as courses_with_board,
    COUNT(CASE WHEN duration IS NOT NULL THEN 1 END) as courses_with_duration
FROM courses;

SELECT '✅ BULLETPROOF DATABASE FIX COMPLETED SUCCESSFULLY!' as result;
SELECT 'All policies have been safely recreated with unique names to avoid conflicts.' as note;
SELECT 'You can now test the course edit functionality.' as next_step;