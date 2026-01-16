-- Add new fields to profiles table for teacher information
-- Run this SQL in your Supabase SQL editor

-- Add subject field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subject TEXT;

-- Add experience_years field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;

-- Add qualification field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS qualification TEXT;

-- Add specialization field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialization TEXT;

-- Add bio field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add is_active field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update the updated_at trigger to include new columns
-- (The trigger should already exist from the main schema)

-- Optional: Add some sample data validation
-- You can add CHECK constraints if needed
-- ALTER TABLE profiles ADD CONSTRAINT check_experience_years CHECK (experience_years >= 0 AND experience_years <= 50);