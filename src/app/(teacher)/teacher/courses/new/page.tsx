"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, BookOpen, Target, Clock, IndianRupee, Info, CheckCircle } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

const examCategories = [
    { value: "SSC", label: "SSC (CGL, CHSL, MTS)" },
    { value: "Railway", label: "Railway (NTPC, Group D, ALP)" },
    { value: "Bank", label: "Bank (IBPS, SBI, RBI)" },
    { value: "RPSC", label: "RPSC (RAS, 1st Grade, 2nd Grade)" },
    { value: "RSMSSB", label: "RSMSSB (Patwari, LDC, JE)" },
    { value: "Police", label: "Police (Constable, SI)" },
    { value: "REET", label: "REET (Level 1 & 2)" },
    { value: "Other", label: "Other Government Exams" },
];

const subjects = [
    { value: "Mathematics", label: "Mathematics / Quantitative Aptitude" },
    { value: "Reasoning", label: "Reasoning / Mental Ability" },
    { value: "English", label: "English Language" },
    { value: "Hindi", label: "Hindi Language" },
    { value: "General Knowledge", label: "General Knowledge" },
    { value: "Current Affairs", label: "Current Affairs" },
    { value: "Rajasthan GK", label: "Rajasthan GK" },
    { value: "Science", label: "General Science" },
    { value: "Computer", label: "Computer Knowledge" },
    { value: "Complete Course", label: "Complete Course (All Subjects)" },
];

const durations = [
    { value: "1 Month", label: "1 Month" },
    { value: "3 Months", label: "3 Months" },
    { value: "6 Months", label: "6 Months" },
    { value: "1 Year", label: "1 Year (Full Course)" },
    { value: "Until Exam", label: "Until Exam" },
];

const difficultyLevels = [
    { value: "Beginner", label: "Beginner (Basic Concepts)" },
    { value: "Intermediate", label: "Intermediate (Practice Level)" },
    { value: "Advanced", label: "Advanced (Exam Ready)" },
];

export default function NewTeacherCoursePage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        exam_category: "SSC",
        subject: "Mathematics",
        difficulty: "Intermediate",
        price: "",
        original_price: "",
        duration: "6 Months",
        is_combo: false,
        thumbnail_url: null as string | null,
        language: "Hindi",
        includes_notes: true,
        includes_tests: true,
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
                class: formData.exam_category,
                subject: formData.subject,
                price: parseInt(formData.price) || 0,
                original_price: formData.original_price ? parseInt(formData.original_price) : null,
                is_combo: formData.is_combo,
                thumbnail_url: formData.thumbnail_url,
                is_published: false,
                teacher_id: user.id,
                created_by: user.id,
                created_by_role: "teacher",
                approval_status: "pending",
                submitted_at: new Date().toISOString(),
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
        <div className="max-w-3xl mx-auto">
            <Link
                href="/teacher/courses"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition"
            >
                <ArrowLeft size={20} />
                Back to Courses
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Create New Course</h2>
                            <p className="text-primary-100">For Government Exam Preparation</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm border border-red-200 flex items-center gap-2">
                            <Info size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Thumbnail Upload */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                Course Thumbnail
                            </h3>
                            <ImageUploader
                                currentImageUrl={formData.thumbnail_url}
                                onImageChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                                folder="course-thumbnails"
                                label="Upload Thumbnail"
                                aspectRatio="video"
                            />
                            <p className="text-xs text-gray-500 mt-2">Recommended: 1280x720px (16:9 ratio)</p>
                        </div>

                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                Basic Information
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., SSC CGL Mathematics Complete Course"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
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
                                        placeholder="Describe what students will learn, topics covered, and why this course is helpful for exam preparation..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Exam & Subject */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                Exam & Subject Details
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Target size={16} className="text-primary-600" />
                                        Target Exam *
                                    </label>
                                    <select
                                        value={formData.exam_category}
                                        onChange={(e) => setFormData({ ...formData, exam_category: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    >
                                        {examCategories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <BookOpen size={16} className="text-primary-600" />
                                        Subject *
                                    </label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    >
                                        {subjects.map(sub => (
                                            <option key={sub.value} value={sub.value}>{sub.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty Level
                                    </label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    >
                                        {difficultyLevels.map(level => (
                                            <option key={level.value} value={level.value}>{level.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Language
                                    </label>
                                    <select
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    >
                                        <option value="Hindi">Hindi</option>
                                        <option value="English">English</option>
                                        <option value="Hindi + English">Hindi + English (Bilingual)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Duration & Pricing */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                Duration & Pricing
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Clock size={16} className="text-primary-600" />
                                        Duration
                                    </label>
                                    <select
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    >
                                        {durations.map(dur => (
                                            <option key={dur.value} value={dur.value}>{dur.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <IndianRupee size={16} className="text-primary-600" />
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="999"
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter 0 for free course</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Original Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.original_price}
                                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                        placeholder="1499"
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">For showing discount</p>
                                </div>
                            </div>
                        </div>

                        {/* Course Features */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                                Course Features
                            </h3>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                                    <input
                                        type="checkbox"
                                        checked={formData.includes_notes}
                                        onChange={(e) => setFormData({ ...formData, includes_notes: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Includes PDF Notes</span>
                                        <p className="text-sm text-gray-500">Downloadable study materials</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                                    <input
                                        type="checkbox"
                                        checked={formData.includes_tests}
                                        onChange={(e) => setFormData({ ...formData, includes_tests: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Includes Practice Tests</span>
                                        <p className="text-sm text-gray-500">MCQ tests for practice</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_combo}
                                        onChange={(e) => setFormData({ ...formData, is_combo: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Combo Course</span>
                                        <p className="text-sm text-gray-500">Multiple subjects in one course</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Info Note */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Info className="text-yellow-600" size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 mb-1">Approval Required</p>
                                    <p className="text-sm text-gray-600">
                                        Your course will be submitted for admin approval. Once approved, it will be visible to students. You can add videos and documents while waiting for approval.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        Submit for Approval
                                    </>
                                )}
                            </button>
                            <Link
                                href="/teacher/courses"
                                className="px-6 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-center font-medium"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
