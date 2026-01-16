-- =====================================================
-- ADD SHOW ON HOMEPAGE COLUMN TO TESTS TABLE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add show_on_homepage column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tests' AND column_name = 'show_on_homepage'
    ) THEN
        ALTER TABLE tests ADD COLUMN show_on_homepage BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added show_on_homepage column to tests table';
    ELSE
        RAISE NOTICE 'show_on_homepage column already exists';
    END IF;
END $$;

-- Verify
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'tests' AND column_name = 'show_on_homepage';

SELECT '✅ show_on_homepage column added!' as result;