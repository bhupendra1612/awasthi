"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    FileText,
    Users,
    Clock,
    IndianRupee,
    CheckCircle,
    XCircle,
    Star,
    BarChart3,
    Loader2,
} from "lucide-react";

interface Test {
    id: string;
    title: string;
    description: string;
    category: string;
    subject: string;
    duration_minutes: number;
    total_questions: number;
    total_marks: number;
    is_free: boolean;
    price: number;
    is_published: boolean;
    is_featured: boolean;
    created_at: string;
}

export default function AdminTestsPage() {
    const supabase = createClient();
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const categories = [
        "SSC", "Railway", "Bank", "RPSC", "RSMSSB",
        "Police", "UPSC", "Teaching", "Defence", "Other"
    ];

    useEffect(() => {
        fetchTests();
    }, []);

    async function fetchTests() {
        try {
            const { data, error } = await supabase
                .from("tests")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setTests(data || []);
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    }

    async function deleteTest(id: string) {
        if (!confirm("Are you sure you want to delete this test? All questions will also be deleted.")) return;

        try {
            const { error } = await supabase.from("tests").delete().eq("id", id);
            if (error) throw error;
            setTests(tests.filter((t) => t.id !== id));
        } catch (error) {
            console.error("Error deleting test:", error);
            alert("Failed to delete test");
        }
    }

    async function togglePublish(id: string, currentStatus: boolean) {
        try {
            const { error } = await supabase
                .from("tests")
                .update({ is_published: !currentStatus })
                .eq("id", id);

            if (error) throw error;
            setTests(tests.map((t) => (t.id === id ? { ...t, is_published: !currentStatus } : t)));
        } catch (error) {
            console.error("Error updating test:", error);
        }
    }

    const filteredTests = tests.filter((test) => {
        const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || test.category === categoryFilter;
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "published" && test.is_published) ||
            (statusFilter === "draft" && !test.is_published) ||
            (statusFilter === "free" && test.is_free) ||
            (statusFilter === "paid" && !test.is_free);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Stats
    const totalTests = tests.length;
    const publishedTests = tests.filter((t) => t.is_published).length;
    const freeTests = tests.filter((t) => t.is_free).length;
    const paidTests = tests.filter((t) => !t.is_free).length;

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
                    <h1 className="text-2xl font-bold text-gray-900">Test Series</h1>
                    <p className="text-gray-500 mt-1">Create and manage online tests for students</p>
                </div>
                <Link
                    href="/admin/tests/new"
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 transition font-medium"
                >
                    <Plus size={20} />
                    Create New Test
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{totalTests}</p>
                            <p className="text-sm text-gray-500">Total Tests</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{publishedTests}</p>
                            <p className="text-sm text-gray-500">Published</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Star className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{freeTests}</p>
                            <p className="text-sm text-gray-500">Free Tests</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <IndianRupee className="text-orange-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{paidTests}</p>
                            <p className="text-sm text-gray-500">Paid Tests</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>
            </div>

            {/* Tests List */}
            {filteredTests.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
                    <p className="text-gray-500 mb-4">Create your first test to get started</p>
                    <Link
                        href="/admin/tests/new"
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                        <Plus size={18} />
                        Create Test
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Test</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Questions</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Duration</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Price</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTests.map((test) => (
                                    <tr key={test.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{test.title}</p>
                                                <p className="text-sm text-gray-500 line-clamp-1">{test.subject}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                {test.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {test.total_questions} Q
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {test.duration_minutes} min
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {test.is_free ? (
                                                <span className="text-green-600 font-medium">Free</span>
                                            ) : (
                                                <span className="text-gray-900 font-medium">₹{test.price}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => togglePublish(test.id, test.is_published)}
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${test.is_published
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {test.is_published ? "Published" : "Draft"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/tests/${test.id}/questions`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Manage Questions"
                                                >
                                                    <FileText size={18} />
                                                </Link>
                                                <Link
                                                    href={`/admin/tests/${test.id}/results`}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                                                    title="View Results"
                                                >
                                                    <BarChart3 size={18} />
                                                </Link>
                                                <Link
                                                    href={`/admin/tests/${test.id}`}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                    title="Edit Test"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => deleteTest(test.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Delete Test"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}