"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, BookOpen, Sparkles, TrendingUp, Star, Info } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

// Government Exam Categories
const examCategories = [
    { value: "SSC", label: "SSC (Staff Selection Commission)" },
    { value: "Railway", label: "Railway (RRB)" },
    { value: "Bank", label: "Banking (IBPS/SBI)" },
    { value: "RPSC", label: "RPSC (Rajasthan PSC)" },
    { value: "RSMSSB", label: "RSMSSB" },
    { value: "Police", label: "Rajasthan Police" },
    { value: "UPSC", label: "UPSC (Civil Services)" },
    { value: "State PSC", label: "State PSC" },
    { value: "Defence", label: "Defence (CDS/NDA/AFCAT)" },
    { value: "Teaching", label: "Teaching (REET/CTET)" },
    { value: "Other", label: "Other Exams" },
];

// Specific Exams based on category
const examsByCategory: Record<string, string[]> = {
    "SSC": ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD", "SSC CPO", "SSC Stenographer", "SSC JE"],
    "Railway": ["RRB NTPC", "RRB Group D", "RRB JE", "RRB ALP", "RRB Ministerial"],
    "Bank": ["IBPS PO", "IBPS Clerk", "IBPS SO", "SBI PO", "SBI Clerk", "RBI Grade B", "RBI Assistant"],
    "RPSC": ["RAS Pre", "RAS Mains", "RPSC 1st Grade", "RPSC 2nd Grade", "RPSC School Lecturer"],
    "RSMSSB": ["Patwari", "LDC", "VDO", "Lab Assistant", "Pharmacist", "Supervisor", "JE"],
    "Police": ["Constable", "SI", "ASI", "Head Constable", "Jail Prahari"],
    "UPSC": ["Prelims", "Mains", "Interview", "Complete Course"],
    "State PSC": ["Prelims", "Mains", "Complete Course"],
    "Defence": ["CDS", "NDA", "AFCAT", "Agniveer"],
    "Teaching": ["REET Level 1", "REET Level 2", "CTET Paper 1", "CTET Paper 2", "KVS", "NVS"],
    "Other": ["Custom Exam"],
};

// Subjects for government exams
const subjects = [
    "Complete Course",
    "Maths / Quantitative Aptitude",
    "Reasoning",
    "General Knowledge",
    "Current Affairs",
    "English",
    "Hindi",
    "General Science",
    "Rajasthan GK",
    "Indian History",
    "Indian Geography",
    "Indian Polity",
    "Economics",
    "Computer Knowledge",
    "All Subjects Combo",
];

// Duration options
const durations = [
    { value: "1 Year", label: "1 Year (Full Course)" },
    { value: "6 Months", label: "6 Months" },
    { value: "3 Months", label: "3 Months (Crash Course)" },
    { value: "45 Days", label: "45 Days (Revision)" },
    { value: "1 Month", label: "1 Month" },
    { value: "15 Days", label: "15 Days (Quick Revision)" },
    { value: "Lifetime", label: "Lifetime Access" },
];

// Language options
const languages = [
    { value: "Hindi", label: "Hindi" },
    { value: "English", label: "English" },
    { value: "Bilingual", label: "Bilingual (Hindi + English)" },
];

export default function NewCoursePage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        class: "SSC", // Exam Category
        subject: "Complete Course",
        exam_name: "", // Specific exam
        language: "Hindi",
        price: "",
        original_price: "",
        duration: "1 Year",
        is_combo: false,
        is_featured: false,
        is_trending: false,
        thumbnail_url: null as string | null,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const courseTitle = formData.exam_name
                ? `${formData.exam_name} - ${formData.subject}`
                : formData.title;

            const { error } = await supabase.from("courses").insert({
                title: formData.title || courseTitle,
                description: formData.description,
                class: formData.class, // Exam Category
                subject: formData.subject,
                price: parseInt(formData.price) || 0,
                original_price: formData.original_price ? parseInt(formData.original_price) : null,
                is_combo: formData.is_combo,
                thumbnail_url: formData.thumbnail_url,
                is_published: false,
            });

            if (error) throw error;

            router.push("/admin/courses");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    const isFree = !formData.price || parseInt(formData.price) === 0;
    const availableExams = examsByCategory[formData.class] || [];
    const discount = formData.original_price && formData.price
        ? Math.round(((parseInt(formData.original_price) - parseInt(formData.price)) / parseInt(formData.original_price)) * 100)
        : 0;

    return (
        <div className="max-w-4xl">
            <Link
                href="/admin/courses"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Courses
            </Link>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Create New Course</h2>
                            <p className="text-white/80">Add a new government exam preparation course</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                            <Info size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Thumbnail Upload */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Thumbnail</h3>
                            <ImageUploader
                                currentImageUrl={formData.thumbnail_url}
                                onImageChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                                folder="courses"
                                label="Upload Course Image (16:9 recommended)"
                                aspectRatio="video"
                            />
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Course Information</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., SSC CGL Complete Course 2025"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
                                    placeholder="Describe what students will learn in this course..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Exam Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Exam Details</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Exam Category *
                                    </label>
                                    <select
                                        value={formData.class}
                                        onChange={(e) => setFormData({ ...formData, class: e.target.value, exam_name: "" })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                                    >
                                        {examCategories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Specific Exam
                                    </label>
                                    <select
                                        value={formData.exam_name}
                                        onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="">Select Exam</option>
                                        {availableExams.map((exam) => (
                                            <option key={exam} value={exam}>{exam}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                                    >
                                        {subjects.map((sub) => (
                                            <option key={sub} value={sub}>{sub}</option>
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Duration
                                </label>
                                <select
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                                >
                                    {durations.map((dur) => (
                                        <option key={dur.value} value={dur.value}>{dur.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Selling Price (₹) {isFree && <span className="text-green-600 font-semibold">(Free)</span>}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="e.g., 2999"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave empty or 0 for free course</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Original Price (₹) {discount > 0 && <span className="text-green-600 font-semibold">({discount}% OFF)</span>}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.original_price}
                                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                        placeholder="e.g., 5999"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">For showing discount (strikethrough price)</p>
                                </div>
                            </div>

                            {/* Price Preview */}
                            {formData.price && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-600 mb-2">Price Preview:</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-primary-600">
                                            ₹{parseInt(formData.price).toLocaleString("en-IN")}
                                        </span>
                                        {formData.original_price && parseInt(formData.original_price) > parseInt(formData.price) && (
                                            <>
                                                <span className="text-lg text-gray-400 line-through">
                                                    ₹{parseInt(formData.original_price).toLocaleString("en-IN")}
                                                </span>
                                                <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">
                                                    {discount}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Course Options */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Course Options</h3>

                            <div className="bg-gray-50 p-5 rounded-xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_combo"
                                        checked={formData.is_combo}
                                        onChange={(e) => setFormData({ ...formData, is_combo: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="is_combo" className="flex items-center gap-2 text-gray-700">
                                        <Sparkles size={18} className="text-yellow-500" />
                                        <span className="font-medium">Combo Course</span>
                                        <span className="text-sm text-gray-500">(Multiple subjects included)</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="is_featured" className="flex items-center gap-2 text-gray-700">
                                        <Star size={18} className="text-blue-500" />
                                        <span className="font-medium">Featured Course</span>
                                        <span className="text-sm text-gray-500">(Show prominently on homepage)</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_trending"
                                        checked={formData.is_trending}
                                        onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                                        className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                                    />
                                    <label htmlFor="is_trending" className="flex items-center gap-2 text-gray-700">
                                        <TrendingUp size={18} className="text-orange-500" />
                                        <span className="font-medium">🔥 Trending Course</span>
                                        <span className="text-sm text-gray-500">(Show in trending section)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen size={20} />
                                        Create Course
                                    </>
                                )}
                            </button>
                            <Link
                                href="/admin/courses"
                                className="px-8 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
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
