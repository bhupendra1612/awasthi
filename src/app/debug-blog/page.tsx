import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DebugBlogPage() {
    const supabase = await createClient();

    const { data: blogs, error } = await supabase
        .from("blogs")
        .select("id, title, slug, is_published, created_at")
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Blog Debug Page</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error.message}
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">All Blogs in Database:</h2>
                {blogs && blogs.length > 0 ? (
                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <div key={blog.id} className="border p-4 rounded">
                                <h3 className="font-semibold">{blog.title}</h3>
                                <p className="text-sm text-gray-600">Slug: {blog.slug}</p>
                                <p className="text-sm text-gray-600">Published: {blog.is_published ? 'Yes' : 'No'}</p>
                                <p className="text-sm text-gray-600">Created: {new Date(blog.created_at).toLocaleDateString()}</p>

                                {blog.is_published && (
                                    <div className="mt-2 space-x-2">
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View Blog →
                                        </Link>
                                        <span className="text-gray-400">|</span>
                                        <a
                                            href={`/blog/${blog.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:underline"
                                        >
                                            Open in New Tab →
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No blogs found in database.</p>
                )}
            </div>

            <div className="space-y-2">
                <Link href="/blogs" className="block text-blue-600 hover:underline">
                    → Go to Blogs Page
                </Link>
                <Link href="/" className="block text-blue-600 hover:underline">
                    → Go to Homepage
                </Link>
            </div>
        </div>
    );
}