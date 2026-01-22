"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    Clock,
    FileText,
    Star,
    Loader2,
    CheckCircle,
    Trophy,
} from "lucide-react";
import InDashboardTest from "@/components/InDashboardTest";

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
    original_price: number;
    is_featured: boolean;
    thumbnail_url: string;
}

interface DailyTest {
    id: string;
    title: string;
    exam_category: string;
    subject: string;
    difficulty: string;
    questions_count: number;
    duration_minutes: number;
    test_date: string;
    status: string;
}

interface DailyTestAttempt {
    daily_test_id: string;
    score: number;
    completed_at: string;
}

interface Enrollment {
    test_id: string;
    payment_status: string;
    attempts_used: number;
    attempts_allowed: number;
}

interface TestAttempt {
    test_id: string;
    score: number;
    created_at: string;
}

export default function TestsPage() {
    const supabase = createClient();
    const [tests, setTests] = useState<Test[]>([]);
    const [dailyTests, setDailyTests] = useState<DailyTest[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
    const [dailyAttempts, setDailyAttempts] = useState<DailyTestAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");
    const [testTypeFilter, setTestTypeFilter] = useState("all"); // New filter
    const [activeTestId, setActiveTestId] = useState<string | null>(null);
    const [activeTestType, setActiveTestType] = useState<'daily' | 'regular'>('daily');

    const categories = [
        "SSC", "Railway", "Bank", "RPSC", "RSMSSB",
        "Police", "UPSC", "Teaching", "Defence"
    ];

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Fetch published tests
            const { data: testsData } = await supabase
                .from("tests")
                .select("*")
                .eq("is_published", true)
                .order("is_featured", { ascending: false })
                .order("created_at", { ascending: false });

            setTests(testsData || []);

            // Fetch daily practice tests (last 30 days)
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
            const { data: dailyTestsData } = await supabase
                .from("generated_daily_tests")
                .select("*")
                .eq("status", "published")
                .gte("test_date", thirtyDaysAgo)
                .order("test_date", { ascending: false });

            setDailyTests(dailyTestsData || []);

            if (user) {
                // Fetch user's test enrollments
                const { data: enrollmentsData } = await supabase
                    .from("test_enrollments")
                    .select("test_id, payment_status, attempts_used, attempts_allowed")
                    .eq("user_id", user.id);

                setEnrollments(enrollmentsData || []);

                // Fetch user's test attempts
                const { data: testAttemptsData } = await supabase
                    .from("test_attempts")
                    .select("test_id, score, created_at")
                    .eq("user_id", user.id);

                setTestAttempts(testAttemptsData || []);

                // Fetch user's daily test attempts
                const { data: dailyAttemptsData } = await supabase
                    .from("daily_test_attempts")
                    .select("daily_test_id, score, completed_at")
                    .eq("user_id", user.id);

                setDailyAttempts(dailyAttemptsData || []);
            }
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredTests = tests.filter((test) => {
        const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || test.category === categoryFilter;
        const matchesPrice = priceFilter === "all" ||
            (priceFilter === "free" && test.is_free) ||
            (priceFilter === "paid" && !test.is_free);
        const matchesType = testTypeFilter === "all" || testTypeFilter === "regular";
        return matchesSearch && matchesCategory && matchesPrice && matchesType;
    });

    const filteredDailyTests = dailyTests.filter((test) => {
        const matchesSearch = test.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || test.exam_category === categoryFilter;
        const matchesType = testTypeFilter === "all" || testTypeFilter === "daily";
        return matchesSearch && matchesCategory && matchesType;
    });

    const isEnrolled = (testId: string) => {
        const enrollment = enrollments.find((e) => e.test_id === testId);
        return enrollment && (enrollment.payment_status === "paid" || enrollment.payment_status === "free");
    };

    const getEnrollment = (testId: string) => {
        return enrollments.find((e) => e.test_id === testId);
    };

    const isDailyTestAttempted = (testId: string) => {
        return dailyAttempts.some(attempt => attempt.daily_test_id === testId);
    };

    const getDailyTestScore = (testId: string) => {
        const attempt = dailyAttempts.find(attempt => attempt.daily_test_id === testId);
        return attempt?.score;
    };

    const hasTestAttempt = (testId: string) => {
        return testAttempts.some(attempt => attempt.test_id === testId);
    };

    const categoryColors: Record<string, string> = {
        "SSC": "from-blue-500 to-cyan-500",
        "Railway": "from-green-500 to-emerald-500",
        "Bank": "from-purple-500 to-pink-500",
        "RPSC": "from-orange-500 to-red-500",
        "Police": "from-red-500 to-rose-500",
        "RSMSSB": "from-cyan-500 to-teal-500",
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-primary-600" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* In-Dashboard Test Modal */}
            {activeTestId && (
                <InDashboardTest
                    testId={activeTestId}
                    testType={activeTestType}
                    onClose={() => {
                        setActiveTestId(null);
                        setActiveTestType('daily');
                        // Refresh data to update attempts
                        fetchData();
                    }}
                />
            )}
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Test Series</h1>
                <p className="text-gray-500 mt-1">Practice with mock tests designed for government exam preparation</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
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
                        value={testTypeFilter}
                        onChange={(e) => setTestTypeFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="all">All Tests</option>
                        <option value="regular">Test Series</option>
                        <option value="daily">Daily Practice</option>
                    </select>
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
                    {testTypeFilter !== "daily" && (
                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="all">All Prices</option>
                            <option value="free">Free Tests</option>
                            <option value="paid">Paid Tests</option>
                        </select>
                    )}
                </div>
            </div>

            {/* Tests Grid */}
            {(filteredTests.length === 0 && filteredDailyTests.length === 0) ? (
                <div className="bg-white rounded-xl p-12 text-center">
                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
                    <p className="text-gray-500">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Daily Practice Tests */}
                    {filteredDailyTests.length > 0 && (testTypeFilter === "all" || testTypeFilter === "daily") && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                    <Clock className="text-white" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Daily Practice Tests</h2>
                                    <p className="text-sm text-gray-500">Free AI-generated tests for quick practice</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredDailyTests.map((test) => {
                                    const isAttempted = isDailyTestAttempted(test.id);
                                    const score = getDailyTestScore(test.id);

                                    return (
                                        <div
                                            key={test.id}
                                            className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group ${isAttempted ? "ring-2 ring-green-500" : ""}`}
                                        >
                                            <div className={`h-2 bg-gradient-to-r ${categoryColors[test.exam_category] || "from-gray-400 to-gray-500"}`} />

                                            {/* Content */}
                                            <div className="p-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                                                        {test.exam_category}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                                                            Daily Practice
                                                        </span>
                                                        {isAttempted && (
                                                            <span className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">
                                                                <CheckCircle size={12} />
                                                                {score}/{test.questions_count}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
                                                    {test.subject}
                                                </h3>

                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <FileText size={14} />
                                                        {test.questions_count} Q
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {test.duration_minutes} min
                                                    </span>
                                                    <span className={`px-1.5 py-0.5 rounded text-xs ${test.difficulty === "easy" ? "bg-green-100 text-green-700" :
                                                        test.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                                                            "bg-red-100 text-red-700"
                                                        }`}>
                                                        {test.difficulty}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-green-600 font-bold">FREE</span>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(test.test_date).toLocaleDateString("en-IN", {
                                                                day: 'numeric',
                                                                month: 'short'
                                                            })}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            setActiveTestId(test.id);
                                                            setActiveTestType('daily');
                                                        }}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isAttempted
                                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            : "bg-primary-600 text-white hover:bg-primary-700"
                                                            }`}
                                                    >
                                                        {isAttempted ? "View Result" : "Start Test"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Regular Test Series */}
                    {filteredTests.length > 0 && (testTypeFilter === "all" || testTypeFilter === "regular") && (
                        <div>
                            {filteredDailyTests.length > 0 && (testTypeFilter === "all") && (
                                <div className="flex items-center gap-3 mb-6 mt-12">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center">
                                        <Trophy className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Test Series</h2>
                                        <p className="text-sm text-gray-500">Comprehensive mock tests for exam preparation</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTests.map((test) => {
                                    const enrolled = isEnrolled(test.id);
                                    const enrollment = getEnrollment(test.id);
                                    const hasAttempt = hasTestAttempt(test.id);
                                    const canAttempt = enrolled && (enrollment?.attempts_used || 0) < (enrollment?.attempts_allowed || 1);

                                    return (
                                        <div
                                            key={test.id}
                                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative h-40 bg-gradient-to-br from-primary-500 to-primary-700">
                                                {test.thumbnail_url ? (
                                                    <Image
                                                        src={test.thumbnail_url}
                                                        alt={test.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <FileText className="text-white/30" size={64} />
                                                    </div>
                                                )}
                                                {test.is_featured && (
                                                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                                        <Star size={12} />
                                                        Featured
                                                    </div>
                                                )}
                                                {enrolled && (
                                                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                                        <CheckCircle size={12} />
                                                        Enrolled
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                                                        {test.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{test.subject}</span>
                                                </div>

                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
                                                    {test.title}
                                                </h3>

                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <FileText size={14} />
                                                        {test.total_questions} Q
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {test.duration_minutes} min
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Trophy size={14} />
                                                        {test.total_marks} marks
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {test.is_free ? (
                                                            <span className="text-green-600 font-bold">FREE</span>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xl font-bold text-gray-900">₹{test.price}</span>
                                                                {test.original_price > test.price && (
                                                                    <span className="text-sm text-gray-400 line-through">
                                                                        ₹{test.original_price}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {enrolled ? (
                                                        hasAttempt ? (
                                                            <Link
                                                                href={`/tests/${test.id}/result`}
                                                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                                                            >
                                                                View Result
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={`/tests/${test.id}/start`}
                                                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                                                            >
                                                                Start Test
                                                            </Link>
                                                        )
                                                    ) : (
                                                        <Link
                                                            href={`/tests/${test.id}`}
                                                            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                                                        >
                                                            {test.is_free ? "Enroll Free" : "Enroll Now"}
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}