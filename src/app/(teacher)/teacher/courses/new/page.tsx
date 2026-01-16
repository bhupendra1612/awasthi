"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

export default function NewTeacherCoursePage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        class: "Class 9",
        subject: "Maths",
        board: "CBSE & RBSE",
        price: "",
        original_price: "",
        duration: "Full Year",
        is_combo: false,
        thumbnail_url: null as string | null,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase.from("courses").insert({
                title: formData.title,
                description: formData.description,
                class: formData.class,
                subject: formData.subject,
                board: formData.board,
                price: parseInt(formData.price),
                original_price: formData.original_price ? parseInt(formData.original_price) : null,
                duration: formData.duration,
                is_combo: formData.is_combo,
                thumbnail_url: formData.thumbnail_url,
                teacher_id: user.id,
                approval_status: "pending", // Requires admin approval
                is_published: false,
                is_featured: false,
            });

            if (error) throw error;

            router.push("/teacher/courses");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <Link
                href="/teacher/courses"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Courses
            </Link>

            <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Course</h2>
                <p className="text-gray-500 mb-6">Your course will be reviewed by admin before publishing</p>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Thumbnail Upload */}
                    <ImageUploader
                        currentImageUrl={formData.thumbnail_url}
                        onImageChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                        folder="courses"
                        label="Course Thumbnail"
                        aspectRatio="video"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Class 10 Mathematics"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Course description..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class *
                            </label>
                            <select
                                value={formData.class}
                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            >
                                <option>Class 6</option>
                                <option>Class 7</option>
                                <option>Class 8</option>
                                <option>Class 9</option>
                                <option>Class 10</option>
                                <option>Class 11</option>
                                <option>Class 12</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            >
                                <option>Maths</option>
                                <option>Science</option>
                                <option>Physics</option>
                                <option>Chemistry</option>
                                <option>Biology</option>
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Social Science</option>
                                <option>All Subjects</option>
                                <option>PCM</option>
                                <option>PCB</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Board
                            </label>
                            <select
                                value={formData.board}
                                onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            >
                                <option>CBSE & RBSE</option>
                                <option>CBSE</option>
                                <option>RBSE</option>
                                <option>ICSE</option>
                                <option>State Board</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration
                            </label>
                            <select
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            >
                                <option>Full Year</option>
                                <option>6 Months</option>
                                <option>3 Months</option>
                                <option>1 Month</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="10000"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Original Price (₹)
                            </label>
                            <input
                                type="number"
                                value={formData.original_price}
                                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                placeholder="12000"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">For showing discount</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                        <input
                            type="checkbox"
                            id="is_combo"
                            checked={formData.is_combo}
                            onChange={(e) => setFormData({ ...formData, is_combo: e.target.checked })}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="is_combo" className="text-sm text-gray-700">
                            This is a combo course (multiple subjects)
                        </label>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-700">
                            <strong>Note:</strong> Your course will be submitted for admin review.
                            Once approved, it will be visible to students. You can add content while waiting for approval.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit for Approval"}
                        </button>
                        <Link
                            href="/teacher/courses"
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
