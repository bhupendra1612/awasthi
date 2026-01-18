"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, Loader2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image?: string | null;
    author_id?: string;
    created_at: string;
    profiles?: {
        full_name?: string;
        email?: string;
    } | null;
    author?: {
        full_name?: string;
        email?: string;
    } | null;
}

export default function Blogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { data, error } = await supabase
                .from("blogs")
                .select(`
                    id, 
                    title, 
                    slug, 
                    excerpt, 
                    cover_image, 
                    author_id,
                    created_at,
                    profiles!blogs_author_id_fkey(full_name, email)
                `)
                .eq("is_published", true)
                .order("created_at", { ascending: false })
                .limit(3);

            if (error) {
                console.error("Error fetching blogs:", {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
            } else {
                // Process the data to match our interface
                const processedBlogs = (data || []).map(blog => ({
                    ...blog,
                    author: blog.profiles ? {
                        full_name: blog.profiles.full_name,
                        email: blog.profiles.email
                    } : null
                }));
                setBlogs(processedBlogs);
            }
        } catch (err) {
            console.error("Error in fetchBlogs:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <Loader2 className="animate-spin text-primary-600" size={40} />
                </div>
            </section>
        );
    }

    if (blogs.length === 0) {
        return null; // Don't show section if no blogs
    }

    return (
        <section id="blogs" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <BookOpen size={16} />
                        Latest Updates
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        Our{" "}
                        <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Blogs
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Stay updated with the latest tips, study guides, and educational insights.
                    </p>
                </div>

                {/* Blogs Grid */}
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
                                        <span>{blog.author?.full_name || 'Awasthi Classes'}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
                                    {blog.title}
                                </h3>

                                {/* Excerpt */}
                                {blog.excerpt && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
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

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-xl hover:bg-primary-600 hover:text-white transition font-medium"
                    >
                        View All Blogs
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
