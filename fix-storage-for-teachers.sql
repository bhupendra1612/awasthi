-- =====================================================
-- FIX STORAGE POLICIES FOR TEACHERS
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing policies on course-files bucket
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read course files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Create permissive policies for course-files bucket
CREATE POLICY "Anyone can read course files"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-files');

CREATE POLICY "Authenticated users can upload to course-files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'course-files' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update course-files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'course-files' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete from course-files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'course-files' 
    AND auth.role() = 'authenticated'
);

-- Make sure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-files', 'course-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- =====================================================
-- DONE! Teachers can now upload files
-- =====================================================
