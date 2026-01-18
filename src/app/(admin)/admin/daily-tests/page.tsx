"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    Plus,
    Search,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    Calendar,
    Brain,
    Settings,
    Clock,
    FileText,
} from "lucide-react";

interface DailyTest {
    id: string;
    title: string;
    exam_category: string;
    subject: string;
    difficulty: string;
    questions_count: number;
    duration_minutes: number;
    status: 'pending_approval' | 'approved' | 'published' | 'rejected';
    test_date: string;
    generated_at: string;
    template_id?: string;
}

interface Template {
    id: string;
    name: string;
    exam_category: string;
    subject: string;
    difficulty: string;
    questions_count: number;
    duration_minutes: number;
    is_active: boolean;
}

export default function AdminDailyTestsPage() {
    const supabase = createClient();
    const [dailyTests, setDailyTests] = useState<DailyTest[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            // Fetch daily tests
            const { data: testsData, error: testsError } = await supabase
                .from("generated_daily_tests")
                .select("*")
                .order("generated_at", { ascending: false });

            if (testsError) throw testsError;
            setDailyTests(testsData || []);

            // Fetch templates
            const { data: templatesData, error: templatesError } = await supabase
                .from("daily_test_templates")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false });

            if (templatesError) throw templatesError;
            setTemplates(templatesData || []);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function generateTest(templateId: string) {
        setGenerating(templateId);
        try {
            const response = await fetch("/api/generate-daily-test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ templateId }),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                fetchData(); // Refresh the data
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Error generating test:", error);
            alert("Failed to generate test");
        } finally {
            setGenerating(null);
        }
    }

    async function updateTestStatus(id: string, status: 'approved' | 'published' | 'rejected') {
        try {
            const updates: any = { status };

            if (status === 'approved') {
                updates.approved_at = new Date().toISOString();
            } else if (status === 'published') {
                updates.published_at = new Date().toISOString();
                updates.approved_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from("generated_daily_tests")
                .update(updates)
                .eq("id", id);

            if (error) throw error;

            setDailyTests(dailyTests.map((t) =>
                t.id === id ? { ...t, ...updates } : t
            ));
        } catch (error) {
            console.error("Error updating test status:", error);
            alert("Failed to update test status");
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700';
            case 'approved': return 'bg-blue-100 text-blue-700';
            case 'pending_approval': return 'bg-yellow-100 text-yellow-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'published': return <CheckCircle size={16} />;
            case 'approved': return <CheckCircle size={16} />;
            case 'pending_approval': return <AlertCircle size={16} />;
            case 'rejected': return <XCircle size={16} />;
            default: return <AlertCircle size={16} />;
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daily Practice Tests</h1>
                    <p className="text-gray-500 mt-1">AI-generated daily practice tests for students</p>
                </div>
                <Link
                    href="/admin/daily-tests/new-template"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition font-medium"
                >
                    <Settings size={20} />
                    New Template
                </Link>
            </div>

            {/* Generate Tests Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Tests</h2>
                {templates.length === 0 ? (
                    <div className="text-center py-8">
                        <Settings className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No active templates</h3>
                        <p className="text-gray-500 mb-4">Create templates to generate daily tests</p>
                        <Link
                            href="/admin/daily-tests/new-template"
                            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                        >
                            <Plus size={18} />
                            Create Template
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="mb-3">
                                    <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                                    <p className="text-sm text-gray-500">{template.exam_category} • {template.subject}</p>
                                </div>

                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Questions:</span>
                                        <span className="text-gray-900">{template.questions_count}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Duration:</span>
                                        <span className="text-gray-900">{template.duration_minutes} min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Difficulty:</span>
                                        <span className="text-gray-900 capitalize">{template.difficulty}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => generateTest(template.id)}
                                    disabled={generating === template.id}
                                    className="w-full px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {generating === template.id ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Brain size={16} />
                                            Generate Test
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Generated Tests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Generated Tests ({dailyTests.length})</h2>
                </div>

                <div className="p-6">
                    {dailyTests.length === 0 ? (
                        <div className="text-center py-12">
                            <Brain className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No daily tests generated yet</h3>
                            <p className="text-gray-500">Generate tests from templates to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Test</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Category</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Details</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                                        <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {dailyTests.map((test) => (
                                        <tr key={test.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{test.title}</p>
                                                    <p className="text-xs text-gray-500">{test.subject}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                    {test.exam_category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <FileText size={12} />
                                                        {test.questions_count} Questions
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {test.duration_minutes} min
                                                    </div>
                                                    <div className="text-xs text-gray-500 capitalize">
                                                        {test.difficulty}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(test.test_date).toLocaleDateString("en-IN")}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(test.status)}`}>
                                                    {getStatusIcon(test.status)}
                                                    {test.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    {test.status === 'pending_approval' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateTestStatus(test.id, 'approved')}
                                                                className="px-2 py-1 text-green-600 hover:bg-green-50 rounded text-xs font-medium"
                                                                title="Approve"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => updateTestStatus(test.id, 'rejected')}
                                                                className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium"
                                                                title="Reject"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {test.status === 'approved' && (
                                                        <button
                                                            onClick={() => updateTestStatus(test.id, 'published')}
                                                            className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium"
                                                            title="Publish"
                                                        >
                                                            Publish
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/admin/daily-tests/preview/${test.id}`}
                                                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                                                        title="Preview"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}