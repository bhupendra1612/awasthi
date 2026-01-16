-- Add is_featured column to teachers table
-- Run this in Supabase SQL Editor

ALTER TABLE teachers ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
