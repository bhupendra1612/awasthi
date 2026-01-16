"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Sparkles, Plus, Play, Edit, Trash2, Clock, FileText,
    CheckCircle, XCircle, AlertCircle, Zap, RefreshCw,
    BookOpen, Target, Brain, Calculator, Languages
} from "lucide-react";
import Link from "next/link";

interface Template {
    id: string;
    name: string;
    exam_category: string;
    subject: string;
    difficulty: string;
    questions_count: number;
    duration_minutes: number;
    ai_prompt: string;
    is_active: boolean;
    created_at: string;
}

interface GeneratedTest {
    id: string;
    title: string;
    exam_category: string;
    subject: string;
    status: string;
    test_date: string;
    generated_at: string;
    approval_deadline: string | null;
    questions_count: number;
}

const subjectIcons: Record<string, React.ReactNode> = {
    "General Knowledge": <BookOpen size={20} />,
    "Mathematics": <Calculator size={20} />,
    "Reasoning": <Brain size={20} />,
    "Hindi": <Languages size={20} />,
    "English": <Languages size={20} />,
};

const categoryColors: Record<string, string> = {
    "SSC": "bg-blue-100 text-blue-700",
    "Railway": "bg-green-100 text-green-700",
    "Bank": "bg-purple-100 text-purple-700",
    "RPSC": "bg-orange-100 text-orange-700",
    "Police": "bg-red-100 text-red-700",
    "RSMSSB": "bg-cyan-100 text-cyan-700",
};

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    "pending_approval": { bg: "bg-yellow-100", text: "text-yellow-700", icon: <AlertCircle size={14} /> },
    "approved": { bg: "bg-blue-100", text: "text-blue-700", icon: <CheckCircle size={14} /> },
    "published": { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle size={14} /> },
    "rejected": { bg: "bg-red-100", text: "text-red-700", icon: <XCircle size={14} /> },
};

export default function DailyTestsPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [generatedTests, setGeneratedTests] = useState<GeneratedTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"templates" | "generated">("templates");
    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);

        // Fetch templates
        const { data: templatesData } = await supabase
            .from("daily_test_templates")
            .select("*")
            .order("created_at", { ascending: false });

        // Fetch generated tests
        const { data: testsData } = await supabase
            .from("generated_daily_tests")
            .select("*")
            .order("generated_at", { ascending: false })
            .limit(20);

        setTemplates(templatesData || []);
        setGeneratedTests(testsData || []);
        setLoading(false);
    }

    async function generateTest(template: Template) {
        setGenerating(template.id);

        try {
            const response = await fetch("/api/generate-daily-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templateId: template.id }),
            });

            const result = await response.json();

            if (result.success) {
                alert("✅ Test generated successfully! Check the Generated Tests tab.");
                fetchData();
            } else {
                alert("❌ Failed to generate test: " + result.error);
            }
        } catch (error) {
            alert("❌ Error generating test. Please try again.");
        }

        setGenerating(null);
    }

    async function approveTest(testId: string) {
        const { error } = await supabase
            .from("generated_daily_tests")
            .update({
                status: "published",
                approved_at: new Date().toISOString(),
                published_at: new Date().toISOString()
            })
            .eq("id", testId);

        if (!error) {
            alert("✅ Test approved and published!");
            fetchData();
        }
    }

    async function rejectTest(testId: string) {
        const { error } = await supabase
            .from("generated_daily_tests")
            .update({ status: "rejected" })
            .eq("id", testId);

        if (!error) {
            alert("Test rejected.");
            fetchData();
        }
    }

    async function deleteTemplate(id: string) {
        if (!confirm("Are you sure you want to delete this template?")) return;

        const { error } = await supabase
            .from("daily_test_templates")
            .delete()
            .eq("id", id);

        if (!error) {
            fetchData();
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="text-yellow-500" />
                        AI Daily Practice Tests
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Generate daily practice tests using AI for government exam preparation
                    </p>
                </div>
                <Link
                    href="/admin/daily-tests/new-template"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition"
                >
                    <Plus size={18} />
                    New Template
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Target className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{templates.length}</p>
                            <p className="text-sm text-gray-500">Templates</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {generatedTests.filter(t => t.status === "published").length}
                            </p>
                            <p className="text-sm text-gray-500">Published</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {generatedTests.filter(t => t.status === "pending_approval").length}
                            </p>
                            <p className="text-sm text-gray-500">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Zap className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{generatedTests.length}</p>
                            <p className="text-sm text-gray-500">Total Generated</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab("templates")}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition ${activeTab === "templates"
                                ? "bg-primary-50 text-primary-600 border-b-2 border-primary-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        📋 Test Templates ({templates.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("generated")}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition ${activeTab === "generated"
                                ? "bg-primary-50 text-primary-600 border-b-2 border-primary-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        🤖 Generated Tests ({generatedTests.length})
                    </button>
                </div>

                <div className="p-4">
                    {activeTab === "templates" ? (
                        /* Templates Grid */
                        templates.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="bg-gray-50 rounded-xl p-4 border hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                                                    {subjectIcons[template.subject] || <FileText size={20} />}
                                                </div>
                                                <div>
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[template.exam_category] || "bg-gray-100 text-gray-700"}`}>
                                                        {template.exam_category}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Link
                                                    href={`/admin/daily-tests/edit/${template.id}`}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => deleteTemplate(template.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{template.subject}</p>

                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                            <span className="flex items-center gap-1">
                                                <FileText size={12} />
                                                {template.questions_count} Questions
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {template.duration_minutes} min
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded text-xs ${template.difficulty === "easy" ? "bg-green-100 text-green-700" :
                                                    template.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-red-100 text-red-700"
                                                }`}>
                                                {template.difficulty}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => generateTest(template)}
                                            disabled={generating === template.id}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                                        >
                                            {generating === template.id ? (
                                                <>
                                                    <RefreshCw size={16} className="animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={16} />
                                                    Generate Test
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="text-gray-400" size={32} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">No templates yet</h3>
                                <p className="text-gray-500 mb-4">Create your first AI test template to get started</p>
                                <Link
                                    href="/admin/daily-tests/new-template"
                                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg"
                                >
                                    <Plus size={18} />
                                    Create Template
                                </Link>
                            </div>
                        )
                    ) : (
                        /* Generated Tests List */
                        generatedTests.length > 0 ? (
                            <div className="space-y-3">
                                {generatedTests.map((test) => (
                                    <div
                                        key={test.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
                                                <Sparkles size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{test.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[test.exam_category] || "bg-gray-100"}`}>
                                                        {test.exam_category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{test.subject}</span>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(test.generated_at).toLocaleDateString("en-IN")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${statusColors[test.status]?.bg} ${statusColors[test.status]?.text}`}>
                                                {statusColors[test.status]?.icon}
                                                {test.status.replace("_", " ")}
                                            </span>

                                            {test.status === "pending_approval" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => approveTest(test.id)}
                                                        className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600"
                                                    >
                                                        <CheckCircle size={14} />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => rejectTest(test.id)}
                                                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600"
                                                    >
                                                        <XCircle size={14} />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            <Link
                                                href={`/admin/daily-tests/preview/${test.id}`}
                                                className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-300"
                                            >
                                                <Play size={14} />
                                                Preview
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="text-gray-400" size={32} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">No tests generated yet</h3>
                                <p className="text-gray-500">Click "Generate Test" on any template to create an AI-powered test</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
