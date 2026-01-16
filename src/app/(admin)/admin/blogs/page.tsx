import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Eye, EyeOff, BookOpen, Calendar } from "lucide-react";
import DeleteBlogButton from "./DeleteBlogButton";
import ToggleBlogPublishButton from "./ToggleBlogPublishButton";

export default async function AdminBlogsPage() {
    const supabase = await createClient();

    const { data: blogs } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
                    <p className="text-gray-500 mt-1">Manage your blog posts</p>
                </div>
                <Link
                    href="/admin/blogs/new"
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                    <Plus size={20} />
                    New Blog
                </Link>
            </div>

            {blogs && blogs.length > 0 ? (
                <div className="grid gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-white rounded-xl shadow-sm p-6 flex gap-6"
                        >
                            {/* Thumbnail */}
                            <div className="w-40 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                {blog.image_url ? (
                                    <Image
                                        src={blog.image_url}
                                        alt={blog.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="text-gray-300" size={32} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${blog.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {blog.is_published ? "Published" : "Draft"}
                                            </span>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                {blog.category}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                            {blog.title}
                                        </h3>
                                        {blog.excerpt && (
                                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                                {blog.excerpt}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(blog.created_at)}
                                            </div>
                                            <span>By {blog.author}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <ToggleBlogPublishButton
                                            blogId={blog.id}
                                            isPublished={blog.is_published}
                                        />
                                        <Link
                                            href={`/admin/blogs/${blog.id}`}
                                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <DeleteBlogButton blogId={blog.id} title={blog.title} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No blogs yet</h2>
                    <p className="text-gray-500 mb-6">Create your first blog post to share with students</p>
                    <Link
                        href="/admin/blogs/new"
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                    >
                        <Plus size={20} />
                        Create Blog
                    </Link>
                </div>
            )}
        </div>
    );
}
