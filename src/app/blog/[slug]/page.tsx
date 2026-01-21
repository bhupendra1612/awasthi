import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, BookOpen, Clock, Share2 } from "lucide-react";

interface BlogPageProps {
    params: {
        slug: string;
    };
}

interface BlogData {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    cover_image: string | null;
    author_id: string | null;
    created_at: string;
    profiles: {
        full_name: string | null;
        email: string | null;
    } | null;
}

interface RelatedBlogData {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    created_at: string;
    profiles: {
        full_name: string | null;
        email: string | null;
    } | null;
}

export default async function BlogPage({ params }: BlogPageProps) {
    const supabase = await createClient();

    let blog = null;
    let relatedBlogs = null;

    try {
        // Fetch the main blog - simplified query without foreign key syntax
        const blogResult = await supabase
            .from("blogs")
            .select(`
                id,
                title,
                slug,
                content,
                excerpt,
                cover_image,
                author_id,
                created_at
            `)
            .eq("slug", params.slug)
            .eq("is_published", true)
            .maybeSingle();

        // If there's an actual error (not just "not found"), log it
        if (blogResult.error && blogResult.error.code !== 'PGRST116') {
            console.error("Blog fetch error:", blogResult.error);
        }

        // If no blog found, show 404
        if (!blogResult.data) {
            notFound();
        }

        blog = blogResult.data as BlogData;

        // Fetch author profile separately if author_id exists
        if (blog.author_id) {
            const { data: profileData } = await supabase
                .from("profiles")
                .select("full_name, email")
                .eq("id", blog.author_id)
                .maybeSingle();

            blog.profiles = profileData;
        }

        // Fetch related blogs (excluding current blog)
        if (blog) {
            const relatedResult = await supabase
                .from("blogs")
                .select(`
                    id,
                    title,
                    slug,
                    excerpt,
                    cover_image,
                    created_at,
                    author_id
                `)
                .eq("is_published", true)
                .neq("id", blog.id)
                .order("created_at", { ascending: false })
                .limit(3);

            relatedBlogs = relatedResult.data || [];

            // Fetch profiles for related blogs
            if (relatedBlogs.length > 0) {
                const authorIds = relatedBlogs
                    .map(b => b.author_id)
                    .filter(id => id !== null);

                if (authorIds.length > 0) {
                    const { data: profilesData } = await supabase
                        .from("profiles")
                        .select("id, full_name, email")
                        .in("id", authorIds);

                    // Map profiles to related blogs
                    relatedBlogs = relatedBlogs.map(blog => ({
                        ...blog,
                        profiles: profilesData?.find(p => p.id === blog.author_id) || null
                    })) as RelatedBlogData[];
                }
            }
        }
    } catch (err) {
        console.error("Error fetching blog:", err);
        notFound();
    }

    if (!blog) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatContent = (content: string) => {
        if (!content) return [];

        return content.split('\n\n').map((paragraph, index) => {
            // Handle headings with **text**
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                    <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                        {paragraph.replace(/\*\*/g, '')}
                    </h3>
                );
            }

            // Handle paragraphs with bold text
            if (paragraph.includes('**')) {
                const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                        {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                    <strong key={partIndex} className="font-semibold text-gray-900">
                                        {part.replace(/\*\*/g, '')}
                                    </strong>
                                );
                            }
                            return part;
                        })}
                    </p>
                );
            }

            // Regular paragraphs
            return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                </p>
            );
        });
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                {/* Spacer for fixed header */}
                <div className="h-16"></div>

                {/* Back Button */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition"
                        >
                            <ArrowLeft size={20} />
                            Back to Blogs
                        </Link>
                    </div>
                </div>

                {/* Blog Content */}
                <article className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {/* Featured Image */}
                        {blog.cover_image && (
                            <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary-100 to-blue-100">
                                <Image
                                    src={blog.cover_image}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="p-6 md:p-8">
                            {/* Meta */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    <span>{formatDate(blog.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <User size={16} />
                                    <span>{blog.profiles?.full_name || 'Awasthi Classes'}</span>
                                </div>
                                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                                    Education
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {blog.title}
                            </h1>

                            {/* Excerpt */}
                            {blog.excerpt && (
                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    {blog.excerpt}
                                </p>
                            )}

                            {/* Content */}
                            <div className="prose prose-lg max-w-none">
                                {formatContent(blog.content)}
                            </div>

                            {/* CTA */}
                            <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100">
                                <div className="text-center">
                                    <BookOpen className="mx-auto text-primary-600 mb-3" size={40} />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Ready to Start Your Preparation?
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Join Awasthi Classes for expert guidance and comprehensive study materials.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link
                                            href="/courses"
                                            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-medium"
                                        >
                                            View Courses
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition font-medium"
                                        >
                                            Contact Us
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related Blogs Section */}
                {relatedBlogs && relatedBlogs.length > 0 && (
                    <section className="max-w-4xl mx-auto px-4 py-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Recommended Blogs
                            </h2>
                            <p className="text-gray-600">
                                Continue reading more educational content and study tips
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedBlogs.map((relatedBlog) => (
                                <article
                                    key={relatedBlog.id}
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                                >
                                    {/* Image */}
                                    <div className="relative h-40 bg-gradient-to-br from-primary-100 to-blue-100 overflow-hidden">
                                        {relatedBlog.cover_image ? (
                                            <Image
                                                src={relatedBlog.cover_image}
                                                alt={relatedBlog.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <BookOpen className="text-primary-300" size={40} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        {/* Meta */}
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                <span>{formatDate(relatedBlog.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User size={12} />
                                                <span>{relatedBlog.profiles?.full_name || 'Awasthi Classes'}</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
                                            {relatedBlog.title}
                                        </h3>

                                        {/* Excerpt */}
                                        {relatedBlog.excerpt && (
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                {relatedBlog.excerpt}
                                            </p>
                                        )}

                                        {/* Read More */}
                                        <Link
                                            href={`/blog/${relatedBlog.slug}`}
                                            className="inline-flex items-center gap-2 text-primary-600 font-medium text-sm hover:gap-3 transition-all"
                                        >
                                            Read More
                                            <ArrowLeft className="rotate-180" size={14} />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* View All Blogs Button */}
                        <div className="text-center mt-8">
                            <Link
                                href="/blogs"
                                className="inline-flex items-center gap-2 border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-600 hover:text-white transition font-semibold"
                            >
                                View All Blogs
                                <ArrowLeft className="rotate-180" size={18} />
                            </Link>
                        </div>
                    </section>
                )}
            </div>
            <Footer />
        </>
    );
}