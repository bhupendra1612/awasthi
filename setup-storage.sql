-- =====================================================
-- SETUP STORAGE BUCKET FOR AWASTHI PROJECT
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create storage bucket for course files (thumbnails, PDFs, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'course-files', 
    'course-files', 
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800;

-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Anyone can view course files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload course files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete course files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update course files" ON storage.objects;

-- Create storage policies
-- Anyone can view/download files
CREATE POLICY "Anyone can view course files" ON storage.objects 
    FOR SELECT USING (bucket_id = 'course-files');

-- Admins can upload files
CREATE POLICY "Admins can upload course files" ON storage.objects 
    FOR INSERT WITH CHECK (
        bucket_id = 'course-files' AND
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

-- Admins can update files
CREATE POLICY "Admins can update course files" ON storage.objects 
    FOR UPDATE USING (
        bucket_id = 'course-files' AND
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

-- Admins can delete files
CREATE POLICY "Admins can delete course files" ON storage.objects 
    FOR DELETE USING (
        bucket_id = 'course-files' AND
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

-- Verify bucket was created
SELECT id, name, public FROM storage.buckets WHERE id = 'course-files';