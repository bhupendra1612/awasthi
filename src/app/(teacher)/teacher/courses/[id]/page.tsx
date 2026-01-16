"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

export default function EditTeacherCoursePage() {
    const params = useParams();
    const courseId = params.id as string;
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [course, setCourse] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        class: "SSC",
        subject: "General Knowledge",
        board: "Central Government",
        price: "",
        original_price: "",
        duration: "6 Months",
        is_combo: false,
        thumbnail_url: null as string | null,
    });

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    async function fetchCourse() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("courses")
            .select("*")
            .eq("id", courseId)
            .eq("teacher_id", user.id)
            .single();

        if (data) {
            setCourse(data);
            setFormData({
                title: data.title || "",
                description: data.description || "",
                class: data.class || "SSC",
                subject: data.subject || "General Knowledge",
                board: data.board || "Central Government",
                price: data.price?.toString() || "",
                original_price: data.original_price?.toString() || "",
                duration: data.duration || "6 Months",
                is_combo: data.is_combo || false,
                thumbnail_url: data.thumbnail_url || null,
            });
        }
        setLoading(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            // If course was rejected, resubmit for approval
            const newStatus = course.approval_status === "rejected" ? "pending" : course.approval_status;

            const { error } = await supabase
                .from("courses")
                .update({
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
                    approval_status: newStatus,
                    rejection_reason: newStatus === "pending" ? null : course.rejection_reason,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", courseId);

            if (error) throw error;

            router.push("/teacher/courses");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update course");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
                <p className="text-gray-500">This course doesn't exist or you don't have access.</p>
            </div>
        );
    }

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
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${course.approval_status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        course.approval_status === "approved" ? "bg-green-100 text-green-700" :
                            "bg-red-100 text-red-700"
                        }`}>
                        {course.approval_status === "pending" && <Clock size={14} />}
                        {course.approval_status === "approved" && <CheckCircle size={14} />}
                        {course.approval_status === "rejected" && <XCircle size={14} />}
                        {course.approval_status}
                    </span>
                </div>

                {/* Rejection Reason */}
                {course.approval_status === "rejected" && course.rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-600 font-medium">Rejection Reason:</p>
                        <p className="text-red-700">{course.rejection_reason}</p>
                        <p className="text-sm text-red-600 mt-2">
                            Make the necessary changes and save to resubmit for approval.
                        </p>
                    </div>
                )}

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-semibold text-purple-800 mb-2">📚 Government Exam Course Guidelines</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Choose the appropriate exam category (SSC, Railway, Bank, etc.)</li>
                        <li>• Select relevant subjects for the chosen exam type</li>
                        <li>• Set competitive pricing for government exam preparation</li>
                        <li>• Use clear, descriptive titles mentioning the exam name</li>
                    </ul>
                </div>

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
                            placeholder="e.g., SSC CGL Complete Course 2024"
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
                            placeholder="Comprehensive preparation course for government competitive exams..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Category *</label>
                            <select
                                value={formData.class}
                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            >
                                <option value="SSC">SSC (Staff Selection Commission)</option>
                                <option value="Railway">Railway Recruitment</option>
                                <option value="Bank">Banking Exams</option>
                                <option value="RPSC">RPSC (Rajasthan PSC)</option>
                                <option value="RSMSSB">RSMSSB (Rajasthan Subordinate)</option>
                                <option value="Police">Police Recruitment</option>
                                <option value="UPSC">UPSC Civil Services</option>
                                <option value="State PSC">State PSC</option>
                                <option value="Defense">Defense Exams</option>
                                <option value="Teaching">Teaching Exams</option>
                                <option value="Other">Other Government Exams</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            >
                                <option value="General Knowledge">General Knowledge</option>
                                <option value="Current Affairs">Current Affairs</option>
                                <option value="Reasoning">Reasoning & Logic</option>
                                <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                                <option value="English">English Language</option>
                                <option value="Hindi">Hindi Language</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="General Science">General Science</option>
                                <option value="Computer Knowledge">Computer Knowledge</option>
                                <option value="Geography">Geography</option>
                                <option value="History">History</option>
                                <option value="Polity">Indian Polity</option>
                                <option value="Economics">Economics</option>
                                <option value="All Subjects">All Subjects (Complete Package)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Level</label>
                            <select
                                value={formData.board}
                                onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            >
                                <option value="Central Government">Central Government</option>
                                <option value="State Government">State Government</option>
                                <option value="Rajasthan State">Rajasthan State</option>
                                <option value="All India">All India Level</option>
                                <option value="Regional">Regional Level</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Course Duration</label>
                            <select
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            >
                                <option value="1 Month">1 Month</option>
                                <option value="2 Months">2 Months</option>
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                                <option value="1 Year">1 Year</option>
                                <option value="18 Months">18 Months</option>
                                <option value="2 Years">2 Years</option>
                                <option value="Until Selection">Until Selection</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="e.g., 2999 for SSC, 4999 for Railway"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Suggested: SSC ₹2999, Railway ₹4999, Bank ₹3999</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                            <input
                                type="number"
                                value={formData.original_price}
                                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                placeholder="e.g., 4999 (for discount display)"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Optional: Show original price for discount effect</p>
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
                            Complete Package (multiple subjects/topics)
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 flex items-center justify-center"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> :
                                course.approval_status === "rejected" ? "Resubmit for Approval" : "Save Changes"}
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

            {/* Content Management Link */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Content</h3>
                <p className="text-gray-500 text-sm mb-4">Add videos and documents to this course</p>
                <Link
                    href={`/teacher/courses/${courseId}/content`}
                    className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                    Manage Content →
                </Link>
            </div>
        </div>
    );
}
