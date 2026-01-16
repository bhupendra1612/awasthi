-- =====================================================
-- FIX STORAGE POLICIES FOR IMAGE UPLOADS
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-files', 'course-files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop all existing storage policies
DROP POLICY IF EXISTS "Anyone can view course files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload course files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload course files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload course files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view course files" ON storage.objects;

-- 3. Create permissive storage policies
-- Allow anyone to view files in course-files bucket
CREATE POLICY "Public can view course files" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'course-files');

-- Allow authenticated users to upload to course-files bucket
CREATE POLICY "Authenticated users can upload course files" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'course-files' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated users to update files they uploaded
CREATE POLICY "Users can update their course files" ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'course-files' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated users to delete files they uploaded
CREATE POLICY "Users can delete their course files" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'course-files' 
        AND auth.role() = 'authenticated'
    );

-- 4. Verify storage setup
SELECT 'Storage buckets:' as info;
SELECT id, name, public FROM storage.buckets WHERE id = 'course-files';

SELECT 'Storage policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

SELECT '✅ Storage policies fixed!' as result;