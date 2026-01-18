import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, BookOpen } from "lucide-react";

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

    // Fetch the main blog
    const { data: blog, error } = await supabase
        .from("blogs")
        .select(`
            *,
            profiles!blogs_author_id_fkey(full_name, email)
        `)
        .eq("slug", params.slug)
        .eq("is_published", true)
        .single() as { data: BlogData | null; error: any };

    if (error || !blog) {
        notFound();
    }

    // Fetch related blogs (excluding current blog)
    const { data: relatedBlogs } = await supabase
        .from("blogs")
        .select(`
            id,
            title,
            slug,
            excerpt,
            cover_image,
            created_at,
            profiles!blogs_author_id_fkey(full_name, email)
        `)
        .eq("is_published", true)
        .neq("id", blog.id)
        .order("created_at", { ascending: false })
        .limit(3) as { data: RelatedBlogData[] | null };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatContent = (content: string) => {
        return content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                    <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                        {paragraph.replace(/\*\*/g, '')}
                    </h3>
                );
            }

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

            return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                </p>
            );
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
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
                            className="inline-flex items-center gap-2 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-600 hover:text-white transition font-medium"
                        >
                            View All Blogs
                            <ArrowLeft className="rotate-180" size={18} />
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}