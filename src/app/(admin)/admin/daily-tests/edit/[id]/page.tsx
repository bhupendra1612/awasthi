"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Sparkles, Info, Trash2 } from "lucide-react";
import Link from "next/link";

const examCategories = [
    "SSC", "Railway", "Bank", "RPSC", "RSMSSB", "Police", "UPSC", "State PSC", "Teaching", "Other"
];

const subjects = [
    "General Knowledge", "Mathematics", "Reasoning", "English", "Hindi",
    "Current Affairs", "Computer", "Science", "History", "Geography", "Polity", "Economics"
];

export default function EditTemplatePage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        exam_category: "SSC",
        subject: "General Knowledge",
        difficulty: "medium",
        questions_count: 10,
        duration_minutes: 10,
        ai_prompt: "",
        is_active: true
    });

    useEffect(() => {
        fetchTemplate();
    }, [params.id]);

    async function fetchTemplate() {
        const { data } = await supabase
            .from("daily_test_templates")
            .select("*")
            .eq("id", params.id)
            .single();

        if (data) {
            setFormData({
                name: data.name,
                exam_category: data.exam_category,
                subject: data.subject,
                difficulty: data.difficulty,
                questions_count: data.questions_count,
                duration_minutes: data.duration_minutes,
                ai_prompt: data.ai_prompt,
                is_active: data.is_active
            });
        }
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from("daily_test_templates")
                .update(formData)
                .eq("id", params.id);

            if (error) throw error;

            alert("✅ Template updated successfully!");
            router.push("/admin/daily-tests");
        } catch (error: any) {
            alert("❌ Error: " + error.message);
        }

        setSaving(false);
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this template?")) return;

        const { error } = await supabase
            .from("daily_test_templates")
            .delete()
            .eq("id", params.id);

        if (!error) {
            router.push("/admin/daily-tests");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/daily-tests" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="text-yellow-500" />
                            Edit Template
                        </h1>
                        <p className="text-gray-500">Update AI test template configuration</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"
                >
                    <Trash2 size={18} />
                    Delete
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Category *</label>
                            <select
                                value={formData.exam_category}
                                onChange={(e) => setFormData({ ...formData, exam_category: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                {examCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                {subjects.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                            <input
                                type="number"
                                min="5"
                                max="50"
                                value={formData.questions_count}
                                onChange={(e) => setFormData({ ...formData, questions_count: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                            <input
                                type="number"
                                min="5"
                                max="180"
                                value={formData.duration_minutes}
                                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">AI Instructions</h2>
                    <textarea
                        required
                        rows={15}
                        value={formData.ai_prompt}
                        onChange={(e) => setFormData({ ...formData, ai_prompt: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Link href="/admin/daily-tests" className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
