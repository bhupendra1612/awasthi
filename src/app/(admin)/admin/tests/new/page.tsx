"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function CreateTestPage() {
    const router = useRouter();
    const supabase = createClient();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

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
        instructions: `1. इस परीक्षा में कुल प्रश्न होंगे।
2. प्रत्येक प्रश्न के लिए 1 अंक निर्धारित है।
3. गलत उत्तर के लिए 0.25 अंक की नकारात्मक अंकन होगी।
4. परीक्षा का समय 60 मिनट है।
5. एक बार उत्तर सबमिट करने के बाद बदला नहीं जा सकता।
6. परीक्षा समाप्त होने पर स्वतः सबमिट हो जाएगी।`,
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const testData = {
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
                created_by: user.id,
            };

            const { data, error } = await supabase
                .from("tests")
                .insert(testData)
                .select()
                .single();

            if (error) throw error;

            console.log("Test created successfully:", data);

            // Temporary redirect to tests list to verify test was created
            // router.push(`/admin/tests/${data.id}/questions`);
            router.push(`/admin/tests`);
        } catch (err) {
            console.error("Error creating test:", err);
            setError(err instanceof Error ? err.message : "Failed to create test");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <Link href="/admin/tests" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
                <ArrowLeft size={20} /> Back to Tests
            </Link>

            <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Test</h2>
                <p className="text-gray-500 mb-6">Set up test details, then add questions</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Thumbnail */}
                    <ImageUploader
                        currentImageUrl={formData.thumbnail_url}
                        onImageChange={(url) => setFormData({ ...formData, thumbnail_url: url || "" })}
                        folder="test-thumbnails"
                        label="Test Thumbnail (Optional)"
                        aspectRatio="video"
                    />

                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Test Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., SSC CGL Mock Test - 1"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the test..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    {/* Category & Subject */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Category *</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
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
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Marks/Question</label>
                                <input
                                    type="number"
                                    value={formData.marks_per_question}
                                    onChange={(e) => setFormData({ ...formData, marks_per_question: e.target.value })}
                                    step="0.5"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Negative Marks</label>
                                <input
                                    type="number"
                                    value={formData.negative_marks}
                                    onChange={(e) => setFormData({ ...formData, negative_marks: e.target.value })}
                                    step="0.25"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Passing %</label>
                                <input
                                    type="number"
                                    value={formData.passing_marks}
                                    onChange={(e) => setFormData({ ...formData, passing_marks: e.target.value })}
                                    min="0"
                                    max="100"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
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
                                <span className="text-gray-700">Free Test</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={!formData.is_free}
                                    onChange={() => setFormData({ ...formData, is_free: false })}
                                    className="w-4 h-4 text-primary-600"
                                />
                                <span className="text-gray-700">Paid Test</span>
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
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Original Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.original_price}
                                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                        min="0"
                                        placeholder="For showing discount"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Test Instructions (Hindi/English)</label>
                        <textarea
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
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
                            <span className="text-gray-700">Featured Test</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.show_on_homepage}
                                onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span className="text-gray-700">Show on Homepage</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_published}
                                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span className="text-gray-700">Publish immediately</span>
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
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Create Test & Add Questions
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}