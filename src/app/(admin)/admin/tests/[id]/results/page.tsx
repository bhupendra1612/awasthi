"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    ArrowLeft,
    Loader2,
    Users,
    Trophy,
    TrendingUp,
    Clock,
    Download,
    Search,
    CheckCircle,
    XCircle,
} from "lucide-react";

interface TestAttempt {
    id: string;
    user_id: string;
    started_at: string;
    submitted_at: string;
    time_taken_seconds: number;
    status: string;
    total_questions: number;
    attempted: number;
    correct: number;
    wrong: number;
    skipped: number;
    marks_obtained: number;
    total_marks: number;
    percentage: number;
    rank: number;
    profiles?: {
        full_name: string;
        email: string;
        phone: string;
    };
}

interface Test {
    id: string;
    title: string;
    category: string;
    subject: string;
    total_questions: number;
    total_marks: number;
    passing_marks: number;
}

export default function TestResultsPage() {
    const params = useParams();
    const testId = params?.id as string;
    const supabase = createClient();

    const [test, setTest] = useState<Test | null>(null);
    const [attempts, setAttempts] = useState<TestAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (testId) fetchData();
    }, [testId]);

    async function fetchData() {
        try {
            // Fetch test
            const { data: testData } = await supabase
                .from("tests")
                .select("*")
                .eq("id", testId)
                .single();

            setTest(testData);

            // Fetch attempts with user profiles
            const { data: attemptsData } = await supabase
                .from("test_attempts")
                .select(`
                    *,
                    profiles:user_id (
                        full_name,
                        email,
                        phone
                    )
                `)
                .eq("test_id", testId)
                .eq("status", "submitted")
                .order("marks_obtained", { ascending: false });

            // Add rank
            const rankedAttempts = (attemptsData || []).map((attempt, index) => ({
                ...attempt,
                rank: index + 1,
            }));

            setAttempts(rankedAttempts);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredAttempts = attempts.filter((attempt) => {
        const name = attempt.profiles?.full_name?.toLowerCase() || "";
        const email = attempt.profiles?.email?.toLowerCase() || "";
        return name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
    });

    // Stats
    const totalAttempts = attempts.length;
    const avgScore = totalAttempts > 0
        ? (attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts).toFixed(1)
        : 0;
    const passedCount = attempts.filter((a) => a.percentage >= (test?.passing_marks || 40)).length;
    const topScore = attempts.length > 0 ? attempts[0]?.percentage : 0;

    function formatTime(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }

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
            <div>
                <Link href="/admin/tests" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2">
                    <ArrowLeft size={18} /> Back to Tests
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">{test?.title} - Results</h1>
                <p className="text-gray-500">{test?.category} • {test?.subject}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{totalAttempts}</p>
                            <p className="text-sm text-gray-500">Total Attempts</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
                            <p className="text-sm text-gray-500">Average Score</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <CheckCircle className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{passedCount}</p>
                            <p className="text-sm text-gray-500">Passed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Trophy className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{topScore}%</p>
                            <p className="text-sm text-gray-500">Top Score</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Results Table */}
            {filteredAttempts.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <Users className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
                    <p className="text-gray-500">No students have attempted this test yet</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Rank</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Score</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Correct/Wrong</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Time Taken</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAttempts.map((attempt) => {
                                    const passed = attempt.percentage >= (test?.passing_marks || 40);
                                    return (
                                        <tr key={attempt.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${attempt.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                                                        attempt.rank === 2 ? "bg-gray-200 text-gray-700" :
                                                            attempt.rank === 3 ? "bg-orange-100 text-orange-700" :
                                                                "bg-gray-100 text-gray-600"
                                                    }`}>
                                                    {attempt.rank}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {attempt.profiles?.full_name || "Unknown"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {attempt.profiles?.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-gray-900">
                                                        {attempt.marks_obtained}/{attempt.total_marks}
                                                    </p>
                                                    <p className={`text-sm font-medium ${attempt.percentage >= 80 ? "text-green-600" :
                                                            attempt.percentage >= 60 ? "text-blue-600" :
                                                                attempt.percentage >= 40 ? "text-yellow-600" :
                                                                    "text-red-600"
                                                        }`}>
                                                        {attempt.percentage.toFixed(1)}%
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <span className="text-green-600 flex items-center gap-1">
                                                        <CheckCircle size={14} />
                                                        {attempt.correct}
                                                    </span>
                                                    <span className="text-red-600 flex items-center gap-1">
                                                        <XCircle size={14} />
                                                        {attempt.wrong}
                                                    </span>
                                                    <span className="text-gray-400">
                                                        {attempt.skipped} skipped
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {formatTime(attempt.time_taken_seconds || 0)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${passed
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {passed ? "Passed" : "Failed"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(attempt.submitted_at).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}