-- Check current blogs and their slugs
SELECT 
    id,
    title,
    slug,
    is_published,
    created_at
FROM blogs 
WHERE is_published = true
ORDER BY created_at DESC;

-- If no blogs exist, let's add a simple test blog
INSERT INTO blogs (
    title,
    slug,
    content,
    excerpt,
    cover_image,
    author_id,
    is_published,
    created_at
) 
SELECT 
    'Test Blog Post',
    'test-blog-post-' || extract(epoch from now())::text,
    'This is a test blog post to verify the routing is working correctly. 

**Key Points:**
- Blog routing should work properly
- Related blogs should display
- Navigation should be smooth

This content is formatted with basic markdown-style formatting that gets converted to proper HTML display.',
    'A simple test blog post to verify the blog system is working correctly.',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
    profiles.id,
    true,
    NOW()
FROM profiles 
WHERE role = 'admin' 
LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM blogs WHERE title = 'Test Blog Post');