import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, BookOpen, ArrowRight, Clock, Tag, TrendingUp } from "lucide-react";

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

    // Get featured blog (most recent)
    const featuredBlog = blogs && blogs.length > 0 ? blogs[0] : null;
    const regularBlogs = blogs && blogs.length > 1 ? blogs.slice(1) : [];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                {/* Spacer for fixed header */}
                <div className="h-16"></div>

                {/* Hero Section - Compact */}
                <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-12 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Blogs</h1>
                        <p className="text-base md:text-lg text-white/90">
                            Stay updated with latest tips, study guides, and educational insights
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <BookOpen size={16} />
                                <span>{blogs?.length || 0} Articles</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <TrendingUp size={16} />
                                <span>Expert Tips</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Tag size={16} />
                                <span>Study Guides</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {blogs && blogs.length > 0 ? (
                        <>
                            {/* Featured Blog */}
                            {featuredBlog && (
                                <div className="mb-16">
                                    <div className="flex items-center gap-2 mb-6">
                                        <TrendingUp className="text-purple-600" size={24} />
                                        <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
                                    </div>
                                    <Link
                                        href={`/blog/${featuredBlog.slug}`}
                                        className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                                    >
                                        <div className="grid md:grid-cols-2 gap-0">
                                            {/* Image */}
                                            <div className="relative h-64 md:h-full bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                                                {featuredBlog.cover_image ? (
                                                    <Image
                                                        src={featuredBlog.cover_image}
                                                        alt={featuredBlog.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <BookOpen className="text-purple-300" size={80} />
                                                    </div>
                                                )}
                                                <div className="absolute top-6 left-6">
                                                    <span className="inline-flex items-center gap-1 bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                                        <TrendingUp size={14} />
                                                        FEATURED
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                                {/* Meta */}
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={16} className="text-purple-600" />
                                                        <span>{formatDate(featuredBlog.created_at)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <User size={16} className="text-purple-600" />
                                                        <span>{featuredBlog.profiles?.full_name || 'Awasthi Classes'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={16} className="text-purple-600" />
                                                        <span>5 min read</span>
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition">
                                                    {featuredBlog.title}
                                                </h3>

                                                {/* Excerpt */}
                                                {featuredBlog.excerpt && (
                                                    <p className="text-gray-600 text-base mb-6 line-clamp-3">
                                                        {featuredBlog.excerpt}
                                                    </p>
                                                )}

                                                {/* Read More */}
                                                <div className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-4 transition-all">
                                                    Read Full Article
                                                    <ArrowRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Regular Blogs Grid */}
                            {regularBlogs.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <BookOpen className="text-purple-600" size={24} />
                                        <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {regularBlogs.map((blog, index) => (
                                            <article
                                                key={blog.id}
                                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 opacity-0"
                                                style={{
                                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                                                }}
                                            >
                                                {/* Image */}
                                                <Link href={`/blog/${blog.slug}`}>
                                                    <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                                                        {blog.cover_image ? (
                                                            <Image
                                                                src={blog.cover_image}
                                                                alt={blog.title}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <BookOpen className="text-purple-300" size={60} />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                                    </div>
                                                </Link>

                                                {/* Content */}
                                                <div className="p-6">
                                                    {/* Meta */}
                                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            <span>{formatDate(blog.created_at)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={12} />
                                                            <span>5 min</span>
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <Link href={`/blog/${blog.slug}`}>
                                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                                                            {blog.title}
                                                        </h3>
                                                    </Link>

                                                    {/* Excerpt */}
                                                    {blog.excerpt && (
                                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                                            {blog.excerpt}
                                                        </p>
                                                    )}

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                                <User size={14} className="text-purple-600" />
                                                            </div>
                                                            <span className="text-xs text-gray-600 font-medium">
                                                                {blog.profiles?.full_name || 'Awasthi Classes'}
                                                            </span>
                                                        </div>
                                                        <Link
                                                            href={`/blog/${blog.slug}`}
                                                            className="inline-flex items-center gap-1 text-purple-600 text-sm font-medium hover:gap-2 transition-all"
                                                        >
                                                            Read
                                                            <ArrowRight size={14} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-32">
                            <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No blogs available yet</h2>
                            <p className="text-gray-600">
                                Check back later for educational content and study tips.
                            </p>
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Start Your Preparation?
                        </h2>
                        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                            Join thousands of successful students who achieved their dreams with Awasthi Classes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/browse-courses"
                                className="bg-white text-purple-600 px-8 py-3 rounded-xl hover:bg-gray-100 transition font-semibold shadow-lg hover:shadow-xl"
                            >
                                View Courses
                            </Link>
                            <Link
                                href="#contact"
                                className="border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-purple-600 transition font-semibold"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}