import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, BookOpen, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function BlogsPage() {
    const supabase = await createClient();

    const { data: blogs } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Get unique categories
    const categories = [...new Set(blogs?.map(b => b.category) || [])];

    return (
        <>
            <Header />
            <main className="pt-20 min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-primary-600 via-blue-600 to-purple-700 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <BookOpen size={16} />
                            Knowledge Hub
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                            Our Blogs
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Explore study tips, exam strategies, and educational insights to boost your learning journey.
                        </p>
                    </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-wrap gap-3 justify-center">
                            <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                All
                            </span>
                            {categories.map((category) => (
                                <span
                                    key={category}
                                    className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-50 hover:text-primary-600 transition cursor-pointer border border-gray-200"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Blogs Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {blogs && blogs.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <article
                                    key={blog.id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-primary-100 to-blue-100 overflow-hidden">
                                        {blog.image_url ? (
                                            <Image
                                                src={blog.image_url}
                                                alt={blog.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <BookOpen className="text-primary-300" size={60} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                {blog.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>{formatDate(blog.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User size={14} />
                                                <span>{blog.author}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
                                            {blog.title}
                                        </h3>

                                        {blog.excerpt && (
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                                {blog.excerpt}
                                            </p>
                                        )}

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
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="text-gray-400" size={40} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs yet</h3>
                            <p className="text-gray-500">Check back soon for new articles and updates.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
