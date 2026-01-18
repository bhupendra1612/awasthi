"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

interface Course {
    id: string;
    title: string;
    description: string;
    class: string;
    subject: string;
    price: number;
    original_price?: number;
    duration?: string;
    is_combo: boolean;
    is_published: boolean;
    is_featured?: boolean;
    is_trending?: boolean;
    thumbnail_url?: string;
}

export default function EditCoursePage() {
    const params = useParams();
    const courseId = params?.id as string;
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [course, setCourse] = useState<Course | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        class: "SSC",
        subject: "General Knowledge",
        price: "0",
        original_price: "",
        duration: "6 Months",
        is_combo: false,
        is_published: false,
        is_featured: false,
        is_trending: false,
        thumbnail_url: "",
    });

    useEffect(() => {
        if (!courseId || courseId === 'undefined') {
            setError("Invalid course ID");
            setLoading(false);
            return;
        }
        fetchCourse();
    }, [courseId]);

    async function fetchCourse() {
        try {
            setLoading(true);
            setError("");

            const { data, error } = await supabase
                .from("courses")
                .select("id, title, description, class, subject, price, original_price, duration, is_combo, is_published, is_featured, is_trending, thumbnail_url")
                .eq("id", courseId)
                .single();

            if (error) {
                console.error("Fetch error:", error);
                setError(`Failed to load course: ${error.message}`);
                return;
            }

            if (!data) {
                setError("Course not found");
                return;
            }

            setCourse(data);
            setFormData({
                title: data.title || "",
                description: data.description || "",
                class: data.class || "SSC",
                subject: data.subject || "General Knowledge",
                price: data.price?.toString() || "0",
                original_price: data.original_price?.toString() || "",
                duration: data.duration || "6 Months",
                is_combo: data.is_combo ?? false,
                is_published: data.is_published ?? false,
                is_featured: data.is_featured ?? false,
                is_trending: data.is_trending ?? false,
                thumbnail_url: data.thumbnail_url || "",
            });
        } catch (err) {
            console.error("Fetch course error:", err);
            setError("Failed to load course");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!courseId || courseId === 'undefined') {
            setError("Invalid course ID");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            // Prepare clean update data - only include defined values
            const updateData: any = {};

            // Only add fields that have actual values
            if (formData.title?.trim()) updateData.title = formData.title.trim();
            if (formData.description?.trim()) updateData.description = formData.description.trim();
            if (formData.class) updateData.class = formData.class;
            if (formData.subject) updateData.subject = formData.subject;
            if (formData.duration) updateData.duration = formData.duration;
            if (formData.price) updateData.price = formData.price;
            if (formData.original_price) updateData.original_price = formData.original_price;

            // Boolean values - always include
            updateData.is_combo = formData.is_combo;
            updateData.is_published = formData.is_published;
            updateData.is_featured = formData.is_featured;
            updateData.is_trending = formData.is_trending;

            // Thumbnail - only if it exists
            if (formData.thumbnail_url) {
                updateData.thumbnail_url = formData.thumbnail_url;
            }

            console.log("Updating course via API:", courseId, "with data:", updateData);

            // Use API route instead of direct Supabase call
            const response = await fetch(`/api/admin/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.details || result.error || "Failed to update course");
            }

            console.log("Update successful:", result);
            setSuccess("Course updated successfully!");

            // Redirect after a short delay
            setTimeout(() => {
                router.push("/admin/courses");
            }, 1500);

        } catch (err) {
            console.error("Submit error:", err);
            setError(err instanceof Error ? err.message : "Failed to update course");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-600" size={32} />
                <span className="ml-3 text-gray-600">Loading course...</span>
            </div>
        );
    }

    if (error && !course) {
        return (
            <div className="max-w-2xl">
                <Link href="/admin/courses" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
                    <ArrowLeft size={20} /> Back to Courses
                </Link>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Course</h2>
                    <p className="text-red-700">{error}</p>
                    <button onClick={fetchCourse} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <Link href="/admin/courses" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
                <ArrowLeft size={20} /> Back to Courses
            </Link>

            <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Course</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <Save size={18} />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Course Thumbnail */}
                    <div>
                        <ImageUploader
                            currentImageUrl={formData.thumbnail_url}
                            onImageChange={(url) => setFormData({ ...formData, thumbnail_url: url || "" })}
                            folder="course-thumbnails"
                            label="Course Thumbnail"
                            aspectRatio="video"
                        />
                    </div>

                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    {/* Exam Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Category *</label>
                            <select
                                value={formData.class}
                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="SSC">SSC</option>
                                <option value="Railway">Railway</option>
                                <option value="Bank">Bank</option>
                                <option value="RPSC">RPSC</option>
                                <option value="RSMSSB">RSMSSB</option>
                                <option value="Police">Police</option>
                                <option value="UPSC">UPSC</option>
                                <option value="Teaching">Teaching</option>
                                <option value="Defence">Defence</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="General Knowledge">General Knowledge</option>
                                <option value="Reasoning">Reasoning</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Current Affairs">Current Affairs</option>
                                <option value="Complete Course">Complete Course</option>
                            </select>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                min="0"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                            <input
                                type="number"
                                value={formData.original_price}
                                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                min="0"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_combo"
                                checked={formData.is_combo}
                                onChange={(e) => setFormData({ ...formData, is_combo: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <label htmlFor="is_combo" className="text-sm text-gray-700">Complete Package</label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_featured"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                                ⭐ Featured Course
                                <span className="block text-xs text-gray-500 font-normal">Show on homepage and student dashboard</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_trending"
                                checked={formData.is_trending}
                                onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <label htmlFor="is_trending" className="text-sm font-medium text-gray-700">
                                🔥 Trending Course
                                <span className="block text-xs text-gray-500 font-normal">Mark as popular/trending</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_published"
                                checked={formData.is_published}
                                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <label htmlFor="is_published" className="text-sm text-gray-700">Published (visible to students)</label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save Changes
                                </>
                            )}
                        </button>
                        <Link
                            href="/admin/courses"
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