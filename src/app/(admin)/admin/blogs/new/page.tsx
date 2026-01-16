"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

export default function NewBlogPage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Study Tips",
        author: "Bard of Maths",
        image_url: null as string | null,
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
            + "-" + Date.now().toString(36);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const slug = generateSlug(formData.title);

            const { error } = await supabase.from("blogs").insert({
                title: formData.title,
                slug,
                excerpt: formData.excerpt || null,
                content: formData.content,
                category: formData.category,
                author: formData.author,
                image_url: formData.image_url,
                is_published: false,
            });

            if (error) throw error;

            router.push("/admin/blogs");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <Link
                href="/admin/blogs"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Blogs
            </Link>

            <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Blog</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Featured Image */}
                    <ImageUploader
                        currentImageUrl={formData.image_url}
                        onImageChange={(url) => setFormData({ ...formData, image_url: url })}
                        folder="banners"
                        label="Featured Image"
                        aspectRatio="video"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Blog Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., 10 Tips to Score 95% in Maths"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Short Excerpt
                        </label>
                        <input
                            type="text"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Brief description for preview..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            >
                                <option>Study Tips</option>
                                <option>Exam Preparation</option>
                                <option>Mathematics</option>
                                <option>Science</option>
                                <option>Career Guidance</option>
                                <option>Announcements</option>
                                <option>General</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Author
                            </label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                placeholder="Author name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Write your blog content here..."
                            rows={12}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You can use basic formatting. Paragraphs are separated by blank lines.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Blog"}
                        </button>
                        <Link
                            href="/admin/blogs"
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
