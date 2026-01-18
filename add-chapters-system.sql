-- =====================================================
-- ADD CHAPTERS/SECTIONS SYSTEM FOR COURSE CONTENT
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add chapter_id to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL;

-- Add chapter_id to documents table  
ALTER TABLE documents ADD COLUMN IF NOT EXISTS chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL;

-- Add video_type column to videos (youtube or uploaded)
ALTER TABLE videos ADD COLUMN IF NOT EXISTS video_type TEXT DEFAULT 'youtube';

-- Add video_url column for uploaded videos
ALTER TABLE videos ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chapters_course ON chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_videos_chapter ON videos(chapter_id);
CREATE INDEX IF NOT EXISTS idx_documents_chapter ON documents(chapter_id);

-- Disable RLS
ALTER TABLE chapters DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- DONE! Chapters system is ready
-- =====================================================
