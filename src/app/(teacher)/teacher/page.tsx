"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    FileText,
    BookOpen,
    Users,
    TrendingUp,
    Clock,
    CheckCircle,
    Star,
    IndianRupee,
    Loader2,
    Plus,
    Eye,
    BarChart3,
} from "lucide-react";

interface Stats {
    totalTests: number;
    publishedTests: number;
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
}

interface RecentTest {
    id: string;
    title: string;
    category: string;
    total_questions: number;
    is_published: boolean;
    created_at: string;
}

export default function TeacherDashboard() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        totalTests: 0,
        publishedTests: 0,
        totalCourses: 0,
        totalStudents: 0,
        totalRevenue: 0,
    });
    const [recentTests, setRecentTests] = useState<RecentTest[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch tests stats
            const { data: tests } = await supabase
                .from("tests")
                .select("*")
                .eq("created_by", user.id);

            const totalTests = tests?.length || 0;
            const publishedTests = tests?.filter((t) => t.is_published).length || 0;

            // Fetch recent tests
            const { data: recent } = await supabase
                .from("tests")
                .select("id, title, category, total_questions, is_published, created_at")
                .eq("created_by", user.id)
                .order("created_at", { ascending: false })
                .limit(5);

            setStats({
                totalTests,
                publishedTests,
                totalCourses: 0, // TODO: Implement courses
                totalStudents: 0, // TODO: Implement students count
                totalRevenue: 0, // TODO: Implement revenue tracking
            });

            setRecentTests(recent || []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
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
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, Teacher! 👋</h1>
                <p className="text-purple-100">
                    Manage your tests, courses, and students all in one place
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Tests */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalTests}</h3>
                    <p className="text-gray-500 text-sm mt-1">Total Tests</p>
                    <Link
                        href="/teacher/tests"
                        className="text-blue-600 text-sm font-medium mt-3 inline-block hover:underline"
                    >
                        View all →
                    </Link>
                </div>

                {/* Published Tests */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <span className="text-xs text-gray-500">
                            {stats.totalTests > 0
                                ? Math.round((stats.publishedTests / stats.totalTests) * 100)
                                : 0}
                            %
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.publishedTests}</h3>
                    <p className="text-gray-500 text-sm mt-1">Published Tests</p>
                    <Link
                        href="/teacher/tests"
                        className="text-green-600 text-sm font-medium mt-3 inline-block hover:underline"
                    >
                        Manage →
                    </Link>
                </div>

                {/* Total Courses */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <BookOpen className="text-purple-600" size={24} />
                        </div>
                        <Clock className="text-gray-400" size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalCourses}</h3>
                    <p className="text-gray-500 text-sm mt-1">My Courses</p>
                    <Link
                        href="/teacher/courses"
                        className="text-purple-600 text-sm font-medium mt-3 inline-block hover:underline"
                    >
                        View courses →
                    </Link>
                </div>

                {/* Total Students */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 rounded-xl">
                            <Users className="text-orange-600" size={24} />
                        </div>
                        <Star className="text-yellow-500" size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalStudents}</h3>
                    <p className="text-gray-500 text-sm mt-1">Total Students</p>
                    <Link
                        href="/teacher/students"
                        className="text-orange-600 text-sm font-medium mt-3 inline-block hover:underline"
                    >
                        View students →
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/teacher/tests/new"
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition">
                            <Plus className="text-primary-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Create New Test</h3>
                            <p className="text-sm text-gray-500">Add questions manually or use AI</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/teacher/tests"
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition">
                            <Eye className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">View All Tests</h3>
                            <p className="text-sm text-gray-500">Manage your test series</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/teacher/students"
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition">
                            <BarChart3 className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Student Analytics</h3>
                            <p className="text-sm text-gray-500">Track student performance</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Tests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Tests</h2>
                        <Link
                            href="/teacher/tests"
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            View all →
                        </Link>
                    </div>
                </div>
                <div className="p-6">
                    {recentTests.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText className="mx-auto text-gray-300 mb-3" size={48} />
                            <p className="text-gray-500 mb-4">No tests created yet</p>
                            <Link
                                href="/teacher/tests/new"
                                className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                            >
                                <Plus size={18} />
                                Create Your First Test
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTests.map((test) => (
                                <Link
                                    key={test.id}
                                    href={`/teacher/tests/${test.id}`}
                                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition border border-gray-100"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FileText className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{test.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-gray-500">{test.category}</span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-xs text-gray-500">
                                                    {test.total_questions} questions
                                                </span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(test.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${test.is_published
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {test.is_published ? "Published" : "Draft"}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3">💡 Teacher Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Use AI to generate questions quickly and save time</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-purple-600 mt-0.5">•</span>
                        <span>You can publish tests directly without admin approval</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-pink-600 mt-0.5">•</span>
                        <span>Mix AI-generated and manual questions for best results</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-orange-600 mt-0.5">•</span>
                        <span>Set appropriate difficulty levels to match student capabilities</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
