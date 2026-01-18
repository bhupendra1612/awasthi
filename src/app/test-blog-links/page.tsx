import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function TestBlogLinksPage() {
    const supabase = await createClient();

    const { data: blogs } = await supabase
        .from("blogs")
        .select("id, title, slug, is_published")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Test Blog Links</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Published Blogs:</h2>
                {blogs && blogs.length > 0 ? (
                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <div key={blog.id} className="border border-gray-200 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">Slug: <code className="bg-gray-100 px-1 rounded">{blog.slug}</code></p>

                                <div className="space-y-2">
                                    <div>
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                        >
                                            View Blog (Next.js Link)
                                        </Link>
                                    </div>

                                    <div>
                                        <a
                                            href={`/blog/${blog.slug}`}
                                            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                        >
                                            View Blog (HTML Link)
                                        </a>
                                    </div>

                                    <div>
                                        <a
                                            href={`/blog/${blog.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                                        >
                                            Open in New Tab
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                        <p><strong>No published blogs found!</strong></p>
                        <p className="mt-2">Please run the <code>fix-blog-routing.sql</code> script in Supabase to add sample blogs.</p>
                    </div>
                )}
            </div>

            <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Navigation Links:</h2>
                <div className="space-x-4">
                    <Link href="/" className="text-blue-600 hover:underline">← Homepage</Link>
                    <Link href="/blogs" className="text-blue-600 hover:underline">All Blogs</Link>
                    <Link href="/debug-blog" className="text-blue-600 hover:underline">Debug Blog</Link>
                </div>
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Run <code>fix-blog-routing.sql</code> in Supabase SQL Editor</li>
                    <li>Refresh this page to see the blogs</li>
                    <li>Click on the blog links to test routing</li>
                    <li>If 404 error persists, check Next.js dev server logs</li>
                    <li>Try restarting the development server</li>
                </ol>
            </div>
        </div>
    );
}