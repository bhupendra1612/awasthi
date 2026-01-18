-- =====================================================
-- ADD TEACHER COURSE APPROVAL SYSTEM
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add teacher_id and approval columns to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'approved';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_approval_status ON courses(approval_status);

-- Update existing courses to be approved (admin-created courses)
UPDATE courses SET approval_status = 'approved' WHERE teacher_id IS NULL AND approval_status IS NULL;

-- =====================================================
-- Create videos table if it doesn't exist
-- =====================================================
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL,
    duration INTEGER,
    order_index INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_videos_course ON videos(course_id);
CREATE INDEX IF NOT EXISTS idx_documents_course ON documents(course_id);

-- =====================================================
-- DISABLE RLS ON ALL TABLES (to avoid access issues)
-- =====================================================
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- DONE! Database is ready for teacher approval system
-- =====================================================
