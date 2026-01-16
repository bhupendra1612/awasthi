import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function BlogPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: blog } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

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

    return (
        <>
            <Header />
            <main className="pt-20 min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-primary-600 via-blue-600 to-purple-700 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
                        >
                            <ArrowLeft size={20} />
                            Back to Blogs
                        </Link>

                        <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">
                            {blog.category}
                        </span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-white/80">
                            <div className="flex items-center gap-2">
                                <User size={18} />
                                <span>{blog.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} />
                                <span>{formatDate(blog.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {/* Featured Image */}
                        {blog.image_url && (
                            <div className="relative h-64 sm:h-96">
                                <Image
                                    src={blog.image_url}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Blog Content */}
                        <div className="p-8 sm:p-12">
                            {blog.excerpt && (
                                <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed border-l-4 border-primary-500 pl-4">
                                    {blog.excerpt}
                                </p>
                            )}

                            <div
                                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600 prose-strong:text-gray-900"
                                dangerouslySetInnerHTML={{ __html: blog.content || "" }}
                            />
                        </div>
                    </article>

                    {/* Back to Blogs */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition font-medium"
                        >
                            <BookOpen size={20} />
                            Read More Blogs
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
