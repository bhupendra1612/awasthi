"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Sparkles, Info } from "lucide-react";
import Link from "next/link";

const examCategories = [
    "SSC",
    "Railway",
    "Bank",
    "RPSC",
    "RSMSSB",
    "Police",
    "UPSC",
    "State PSC",
    "Teaching",
    "Other"
];

const subjects = [
    "General Knowledge",
    "Mathematics",
    "Reasoning",
    "English",
    "Hindi",
    "Current Affairs",
    "Computer",
    "Science",
    "History",
    "Geography",
    "Polity",
    "Economics"
];

const defaultPrompt = `Generate 10 multiple choice questions for exam preparation. Include questions on various topics relevant to the exam.

Each question should have 4 options (A, B, C, D) with only one correct answer.
Include brief explanation for each answer.

Format your response as JSON array with this structure:
[{
  "question": "Question text here?",
  "option_a": "Option A",
  "option_b": "Option B",
  "option_c": "Option C",
  "option_d": "Option D",
  "correct_option": "A",
  "explanation": "Brief explanation of the correct answer"
}]`;

export default function NewTemplatePage() {
    const router = useRouter();
    const supabase = createClient();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        exam_category: "SSC",
        subject: "General Knowledge",
        difficulty: "medium",
        questions_count: 10,
        duration_minutes: 10,
        ai_prompt: defaultPrompt,
        is_active: true
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from("daily_test_templates")
                .insert({
                    ...formData,
                    created_by: user?.id
                });

            if (error) throw error;

            alert("✅ Template created successfully!");
            router.push("/admin/daily-tests");
        } catch (error: any) {
            alert("❌ Error: " + error.message);
        }

        setSaving(false);
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/daily-tests"
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="text-yellow-500" />
                        Create AI Test Template
                    </h1>
                    <p className="text-gray-500">Configure how AI should generate questions</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Template Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., SSC CGL - General Knowledge"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Exam Category *
                            </label>
                            <select
                                required
                                value={formData.exam_category}
                                onChange={(e) => setFormData({ ...formData, exam_category: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                {examCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject *
                            </label>
                            <select
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                {subjects.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Difficulty Level
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Questions
                            </label>
                            <input
                                type="number"
                                min="5"
                                max="50"
                                value={formData.questions_count}
                                onChange={(e) => setFormData({ ...formData, questions_count: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                min="5"
                                max="180"
                                value={formData.duration_minutes}
                                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700">
                                Template is active
                            </label>
                        </div>
                    </div>
                </div>

                {/* AI Prompt */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold">AI Instructions (Prompt)</h2>
                            <p className="text-sm text-gray-500">Tell ChatGPT how to generate questions</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            <Info size={12} />
                            Powered by GPT-4
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Tips for better questions:</strong>
                        </p>
                        <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside space-y-1">
                            <li>Specify topics to cover (e.g., "2 questions on Indian History")</li>
                            <li>Mention difficulty level and target exam</li>
                            <li>Ask for explanations with each answer</li>
                            <li>Keep the JSON format at the end for proper parsing</li>
                        </ul>
                    </div>

                    <textarea
                        required
                        rows={15}
                        value={formData.ai_prompt}
                        onChange={(e) => setFormData({ ...formData, ai_prompt: e.target.value })}
                        placeholder="Enter instructions for AI..."
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                    />

                    <p className="text-xs text-gray-500 mt-2">
                        The JSON format at the end is required for the system to parse questions correctly.
                    </p>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Link
                        href="/admin/daily-tests"
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Create Template"}
                    </button>
                </div>
            </form>
        </div>
    );
}
