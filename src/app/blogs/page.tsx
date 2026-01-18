import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, BookOpen, ArrowRight } from "lucide-react";

export default async function BlogsPage() {
    const supabase = await createClient();

    const { data: blogs } = await supabase
        .from("blogs")
        .select(`
            *,
            profiles!blogs_author_id_fkey(full_name, email)
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Our Blogs
                    </h1>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                        Stay updated with the latest tips, study guides, and educational insights from Awasthi Classes experts.
                    </p>
                </div>
            </div>

            {/* Blogs Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {blogs && blogs.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <article
                                key={blog.id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                {/* Image */}
                                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-blue-100 overflow-hidden">
                                    {blog.cover_image ? (
                                        <Image
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen className="text-primary-300" size={60} />
                                        </div>
                                    )}
                                    {/* Category badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            Education
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>{formatDate(blog.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={14} />
                                            <span>{blog.profiles?.full_name || 'Awasthi Classes'}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
                                        {blog.title}
                                    </h3>

                                    {/* Excerpt */}
                                    {blog.excerpt && (
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                            {blog.excerpt}
                                        </p>
                                    )}

                                    {/* Read More */}
                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all"
                                    >
                                        Read More
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No blogs available</h2>
                        <p className="text-gray-600">
                            Check back later for educational content and study tips.
                        </p>
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Start Your Preparation?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of successful students who achieved their dreams with Awasthi Classes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/courses"
                            className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-medium"
                        >
                            View Courses
                        </Link>
                        <Link
                            href="/contact"
                            className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition font-medium"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}