"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, BookOpen, Target, Video, FileText, Info, Save, CheckCircle } from "lucide-react";
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

export default function EditTeacherCoursePage() {
    const params = useParams();
    const courseId = params.id as string;
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [course, setCourse] = useState<any>(null);

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
    });

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    async function fetchCourse() {
        const { data } = await supabase
            .from("courses")
            .select("*")
            .eq("id", courseId)
            .single();

        if (data) {
            setCourse(data);
            setFormData({
                title: data.title || "",
                description: data.description || "",
                exam_category: data.class || "SSC", // Reading from 'class' column
                subject: data.subject || "Mathematics",
                difficulty: "Intermediate", // Default since column doesn't exist
                price: data.price?.toString() || "",
                original_price: data.original_price?.toString() || "",
                duration: "6 Months", // Default since column doesn't exist
                is_combo: data.is_combo || false,
                thumbnail_url: data.thumbnail_url || null,
                language: "Hindi", // Default since column doesn't exist
            });
        }
        setLoading(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const { error } = await supabase
                .from("courses")
                .update({
                    title: formData.title,
                    description: formData.description,
                    class: formData.exam_category,
                    subject: formData.subject,
                    price: parseInt(formData.price) || 0,
                    original_price: formData.original_price ? parseInt(formData.original_price) : null,
                    is_combo: formData.is_combo,
                    thumbnail_url: formData.thumbnail_url,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", courseId);

            if (error) throw error;

            setSuccess("Course updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update course");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary-600 mx-auto mb-4" size={40} />
                    <p className="text-gray-500">Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-gray-400" size={36} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
                <p className="text-gray-500 mb-4">This course doesn't exist or you don't have access.</p>
                <Link href="/teacher/courses" className="text-primary-600 hover:underline">
                    ← Back to Courses
                </Link>
            </div>
        );
    }

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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Edit Course</h2>
                                <p className="text-primary-100">Update your course details</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-2">
                            <CheckCircle className="text-green-500" size={20} />
                            <span className="text-green-700">{success}</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-2">
                            <Info className="text-red-500" size={20} />
                            <span className="text-red-700">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Thumbnail */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
                            <ImageUploader
                                currentImageUrl={formData.thumbnail_url}
                                onImageChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                                folder="course-thumbnails"
                                label="Upload Thumbnail"
                                aspectRatio="video"
                            />
                        </div>

                        {/* Title & Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what students will learn..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
                            />
                        </div>

                        {/* Exam & Subject */}
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
                        </div>

                        {/* Duration & Language */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
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

                        {/* Pricing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="999"
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.original_price}
                                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                    placeholder="1499"
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Combo Checkbox */}
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

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
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

            {/* Content Management */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                            <Video className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Course Content</h3>
                            <p className="text-gray-500 text-sm">Add videos and documents to this course</p>
                        </div>
                    </div>
                    <Link
                        href={`/teacher/courses/${courseId}/content`}
                        className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-5 py-2.5 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition font-medium flex items-center gap-2"
                    >
                        <FileText size={18} />
                        Manage Content
                    </Link>
                </div>
            </div>
        </div>
    );
}
