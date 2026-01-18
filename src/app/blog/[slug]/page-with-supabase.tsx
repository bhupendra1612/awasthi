import { createClient } from "@/lib/supabase/server";

export default async function BlogPageWithSupabase({ params }: { params: { slug: string } }) {
    let blog = null;
    let error = null;

    try {
        const supabase = await createClient();

        // Simple query first
        const result = await supabase
            .from("blogs")
            .select("*")
            .eq("slug", params.slug)
            .eq("is_published", true)
            .single();

        blog = result.data;
        error = result.error;
    } catch (err) {
        error = err;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Blog Page with Supabase</h1>
                <p className="text-lg mb-4">Slug: <code className="bg-gray-200 px-2 py-1 rounded">{params.slug}</code></p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <h2 className="font-semibold mb-2">❌ Supabase Error:</h2>
                        <pre className="text-sm overflow-auto">{JSON.stringify(error, null, 2)}</pre>
                    </div>
                )}

                {blog ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        <h2 className="font-semibold mb-2">✅ Blog Found:</h2>
                        <div className="text-sm space-y-1">
                            <p><strong>Title:</strong> {blog.title}</p>
                            <p><strong>Slug:</strong> {blog.slug}</p>
                            <p><strong>Published:</strong> {blog.is_published ? 'Yes' : 'No'}</p>
                            <p><strong>Created:</strong> {new Date(blog.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                ) : !error && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                        <h2 className="font-semibold mb-2">⚠️ No Blog Found</h2>
                        <p>No published blog found with slug: <code>{params.slug}</code></p>
                    </div>
                )}

                <div className="space-y-4">
                    <a href="/debug-blog" className="block text-blue-600 hover:underline">
                        → Debug All Blogs
                    </a>
                    <a href="/test-blog-links" className="block text-blue-600 hover:underline">
                        → Test Blog Links
                    </a>
                    <a href="/blogs" className="block text-blue-600 hover:underline">
                        ← Back to All Blogs
                    </a>
                </div>
            </div>
        </div>
    );
}