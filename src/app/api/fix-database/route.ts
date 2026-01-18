import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = createClient();

        // Add missing columns to courses table
        const coursesQuery = `
            ALTER TABLE courses 
            ADD COLUMN IF NOT EXISTS board TEXT DEFAULT 'CBSE',
            ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '6 months',
            ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;
        `;

        // Add missing columns to blogs table
        const blogsQuery = `
            ALTER TABLE blogs 
            ADD COLUMN IF NOT EXISTS image_url TEXT,
            ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Education',
            ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Awasthi Classes';
        `;

        // Update existing blogs
        const updateBlogsQuery = `
            UPDATE blogs SET 
                image_url = COALESCE(image_url, cover_image),
                category = COALESCE(category, 'Education'),
                author = COALESCE(author, 'Awasthi Classes')
            WHERE image_url IS NULL OR category IS NULL OR author IS NULL;
        `;

        // Execute queries
        const { error: coursesError } = await supabase.rpc('exec_sql', { sql: coursesQuery });
        if (coursesError) {
            console.error('Error updating courses table:', coursesError);
        }

        const { error: blogsError } = await supabase.rpc('exec_sql', { sql: blogsQuery });
        if (blogsError) {
            console.error('Error updating blogs table:', blogsError);
        }

        const { error: updateError } = await supabase.rpc('exec_sql', { sql: updateBlogsQuery });
        if (updateError) {
            console.error('Error updating blog data:', updateError);
        }

        return NextResponse.json({
            success: true,
            message: 'Database schema updated successfully',
            errors: {
                courses: coursesError,
                blogs: blogsError,
                update: updateError
            }
        });

    } catch (error) {
        console.error('Error fixing database:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update database schema'
        }, { status: 500 });
    }
}