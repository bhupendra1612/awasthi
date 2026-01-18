# Blog Routing Troubleshooting Guide

## Current Status
The blog routing was showing 404 errors. I've created a simplified version to test the routing.

## Files Created/Modified

### 1. Simplified Blog Page
- **File**: `src/app/blog/[slug]/page.tsx` (simplified version)
- **Backup**: `src/app/blog/[slug]/page-backup.tsx` (original complex version)
- **Test Version**: `src/app/blog/[slug]/page-with-supabase.tsx` (gradual testing)

### 2. Debug Pages
- `src/app/debug-blog/page.tsx` - Shows all blogs in database
- `src/app/test-blog-links/page.tsx` - Tests blog links
- `src/app/blog/not-found.tsx` - Custom 404 page

### 3. Sample Data
- `fix-blog-routing.sql` - Adds sample blogs with clean slugs

## Testing Steps

### Step 1: Test Basic Routing
1. Visit: `http://localhost:4002/blog/any-slug-here`
2. You should see: "✅ Blog Routing Works!" page
3. If you see 404, the issue is with Next.js routing

### Step 2: Test Database Connection
1. Visit: `http://localhost:4002/debug-blog`
2. Check if blogs are shown in the database
3. If no blogs, run the SQL script: `fix-blog-routing.sql`

### Step 3: Test Blog Links
1. Visit: `http://localhost:4002/test-blog-links`
2. Click on the blog links to test routing
3. This will show if the issue is with link generation

### Step 4: Test Supabase Integration
1. Replace `page.tsx` with `page-with-supabase.tsx`
2. Visit a blog URL to see if Supabase queries work
3. Check for any database connection errors

## Common Issues & Solutions

### Issue 1: 404 on All Blog URLs
**Cause**: Next.js routing not working
**Solution**: 
- Restart development server
- Check file structure: `src/app/blog/[slug]/page.tsx`
- Ensure brackets are correct in folder name

### Issue 2: Routing Works but No Data
**Cause**: No published blogs in database
**Solution**: Run `fix-blog-routing.sql` in Supabase

### Issue 3: Supabase Connection Errors
**Cause**: Database connection or RLS policies
**Solution**: 
- Check `.env.local` file
- Verify Supabase credentials
- Check RLS policies on blogs table

### Issue 4: Complex Query Errors
**Cause**: Join syntax or missing columns
**Solution**: Use simplified queries first, then add complexity

## Recovery Steps

### To Restore Full Functionality:
1. Confirm basic routing works with simple page
2. Run SQL script to add sample data
3. Replace simple page with complex version:
   ```bash
   # In src/app/blog/[slug]/ directory
   mv page.tsx page-simple.tsx
   mv page-backup.tsx page.tsx
   ```

### To Add Sample Data:
```sql
-- Run this in Supabase SQL Editor
-- (Content of fix-blog-routing.sql)
```

## File Structure
```
src/app/blog/
├── [slug]/
│   ├── page.tsx (current: simple test version)
│   ├── page-backup.tsx (original complex version)
│   ├── page-with-supabase.tsx (gradual test version)
│   └── page-simple.tsx (basic test version)
├── layout.tsx
└── not-found.tsx
```

## Next Steps
1. Test the simplified routing first
2. If routing works, the issue was with the complex Supabase query
3. Gradually add back functionality to identify the exact problem
4. Once working, restore the full blog page with related blogs feature