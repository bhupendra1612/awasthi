"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function EditTestPage() {
    const params = useParams();
    const testId = params?.id as string;
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "SSC",
        subject: "General Knowledge",
        duration_minutes: "60",
        marks_per_question: "1",
        negative_marks: "0.25",
        passing_marks: "40",
        is_free: true,
        price: "0",
        original_price: "",
        is_published: false,
        is_featured: false,
        show_on_homepage: true,
        instructions: "",
        thumbnail_url: "",
    });

    const categories = [
        "SSC", "Railway", "Bank", "RPSC", "RSMSSB",
        "Police", "UPSC", "Teaching", "Defence", "Other"
    ];

    const subjects = [
        "General Knowledge", "Reasoning", "Mathematics", "English",
        "Hindi", "Current Affairs", "Computer", "Science",
        "History", "Geography", "Polity", "Economics", "Complete Test"
    ];

    useEffect(() => {
        if (testId) fetchTest();
    }, [testId]);

    async function fetchTest() {
        try {
            const { data, error } = await supabase
                .from("tests")
                .select("*")
                .eq("id", testId)
                .single();

            if (error) throw error;

            setFormData({
                title: data.title || "",
                description: data.description || "",
                category: data.category || "SSC",
                subject: data.subject || "General Knowledge",
                duration_minutes: data.duration_minutes?.toString() || "60",
                marks_per_question: data.marks_per_question?.toString() || "1",
                negative_marks: data.negative_marks?.toString() || "0.25",
                passing_marks: data.passing_marks?.toString() || "40",
                is_free: data.is_free ?? true,
                price: data.price?.toString() || "0",
                original_price: data.original_price?.toString() || "",
                is_published: data.is_published ?? false,
                is_featured: data.is_featured ?? false,
                show_on_homepage: data.show_on_homepage ?? true,
                instructions: data.instructions || "",
                thumbnail_url: data.thumbnail_url || "",
            });
        } catch (err) {
            console.error("Error fetching test:", err);
            setError("Failed to load test");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const updateData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                subject: formData.subject,
                duration_minutes: parseInt(formData.duration_minutes) || 60,
                marks_per_question: parseFloat(formData.marks_per_question) || 1,
                negative_marks: parseFloat(formData.negative_marks) || 0,
                passing_marks: parseFloat(formData.passing_marks) || 40,
                is_free: formData.is_free,
                price: formData.is_free ? 0 : parseFloat(formData.price) || 0,
                original_price: formData.original_price ? parseFloat(formData.original_price) : null,
                is_published: formData.is_published,
                is_featured: formData.is_featured,
                show_on_homepage: formData.show_on_homepage,
                instructions: formData.instructions,
                thumbnail_url: formData.thumbnail_url || null,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from("tests")
                .update(updateData)
                .eq("id", testId);

            if (error) throw error;

            setSuccess("Test updated successfully!");
            setTimeout(() => router.push("/admin/tests"), 1500);
        } catch (err) {
            console.error("Error updating test:", err);
            setError(err instanceof Error ? err.message : "Failed to update test");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            <Link href="/admin/tests" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
                <ArrowLeft size={20} /> Back to Tests
            </Link>

            <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Test</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Thumbnail */}
                    <ImageUploader
                        currentImageUrl={formData.thumbnail_url}
                        onImageChange={(url) => setFormData({ ...formData, thumbnail_url: url || "" })}
                        folder="test-thumbnails"
                        label="Test Thumbnail"
                        aspectRatio="video"
                    />

                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Test Title *</label>
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
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    {/* Category & Subject */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                {subjects.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Test Configuration */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <h3 className="font-medium text-gray-900">Test Configuration</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Duration (min)</label>
                                <input
                                    type="number"
                                    value={formData.duration_minutes}
                                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Marks/Question</label>
                                <input
                                    type="number"
                                    value={formData.marks_per_question}
                                    onChange={(e) => setFormData({ ...formData, marks_per_question: e.target.value })}
                                    step="0.5"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Negative Marks</label>
                                <input
                                    type="number"
                                    value={formData.negative_marks}
                                    onChange={(e) => setFormData({ ...formData, negative_marks: e.target.value })}
                                    step="0.25"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Passing %</label>
                                <input
                                    type="number"
                                    value={formData.passing_marks}
                                    onChange={(e) => setFormData({ ...formData, passing_marks: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <h3 className="font-medium text-gray-900">Pricing</h3>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={formData.is_free}
                                    onChange={() => setFormData({ ...formData, is_free: true, price: "0" })}
                                    className="w-4 h-4 text-primary-600"
                                />
                                <span>Free Test</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={!formData.is_free}
                                    onChange={() => setFormData({ ...formData, is_free: false })}
                                    className="w-4 h-4 text-primary-600"
                                />
                                <span>Paid Test</span>
                            </label>
                        </div>
                        {!formData.is_free && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Original Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.original_price}
                                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                        <textarea
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm"
                        />
                    </div>

                    {/* Options */}
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span>Featured Test</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.show_on_homepage}
                                onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span>Show on Homepage</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_published}
                                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span>Published</span>
                        </label>
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
                            href={`/admin/tests/${testId}/questions`}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
                        >
                            Manage Questions
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}