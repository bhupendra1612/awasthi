"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
    ClipboardList,
    Clock,
    Users,
    Star,
    Filter,
    X,
    Eye,
    ArrowRight,
    Sparkles,
    CheckCircle,
    Award,
    Calendar,
    FileText,
    Target,
} from "lucide-react";

interface DailyTest {
    id: string;
    title: string;
    exam_category: string;
    subject: string;
    difficulty: string;
    questions_count: number;
    duration_minutes: number;
    status: string;
    test_date: string;
    type: 'daily';
}

interface PracticeTest {
    id: string;
    title: string;
    description: string | null;
    duration_minutes: number;
    total_marks: number;
    passing_marks: number;
    is_free: boolean;
    price: number;
    is_published: boolean;
    created_at: string;
    type: 'practice';
}

type Test = DailyTest | PracticeTest;

export default function BrowseTestsPage() {
    const [dailyTests, setDailyTests] = useState<DailyTest[]>([]);
    const [practiceTests, setPracticeTests] = useState<PracticeTest[]>([]);
    const [filteredDailyTests, setFilteredDailyTests] = useState<DailyTest[]>([]);
    const [filteredPracticeTests, setFilteredPracticeTests] = useState<PracticeTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTestType, setSelectedTestType] = useState<string>("all");
    const [selectedPrice, setSelectedPrice] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);

    const testTypeFilters = [
        { value: "all", label: "All Tests" },
        { value: "daily", label: "Daily Tests" },
        { value: "practice", label: "Practice Tests" },
    ];

    const priceFilters = [
        { value: "all", label: "All" },
        { value: "free", label: "Free" },
        { value: "paid", label: "Paid" },
    ];

    useEffect(() => {
        fetchTests();
    }, []);

    useEffect(() => {
        filterTests();
    }, [selectedTestType, selectedPrice, dailyTests, practiceTests]);

    const fetchTests = async () => {
        try {
            const supabase = createClient();

            // Fetch daily tests
            const { data: dailyData, error: dailyError } = await supabase
                .from("generated_daily_tests")
                .select("*")
                .in("status", ["approved", "published"])
                .order("test_date", { ascending: false })
                .limit(10);

            if (dailyError) console.error("Error fetching daily tests:", dailyError);

            // Fetch practice tests
            const { data: practiceData, error: practiceError } = await supabase
                .from("tests")
                .select("*")
                .eq("is_published", true)
                .order("created_at", { ascending: false });

            if (practiceError) console.error("Error fetching practice tests:", practiceError);

            const processedDailyTests = (dailyData || []).map(test => ({
                ...test,
                type: 'daily' as const,
                description: test.description || 'Daily test to practice your skills',
            }));

            const processedPracticeTests = (practiceData || []).map(test => ({
                ...test,
                type: 'practice' as const,
                description: test.description || 'Practice test to improve your preparation',
                is_free: test.is_free || false,
                price: test.price || 0,
            }));

            setDailyTests(processedDailyTests);
            setPracticeTests(processedPracticeTests);
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterTests = () => {
        let filteredDaily = [...dailyTests];
        let filteredPractice = [...practiceTests];

        // Filter by test type
        if (selectedTestType === "daily") {
            filteredPractice = [];
        } else if (selectedTestType === "practice") {
            filteredDaily = [];
        }

        // Filter by price (only applies to practice tests)
        if (selectedPrice === "free") {
            filteredPractice = filteredPractice.filter(test => test.is_free || test.price === 0);
        } else if (selectedPrice === "paid") {
            filteredPractice = filteredPractice.filter(test => !test.is_free && test.price > 0);
        }

        setFilteredDailyTests(filteredDaily);
        setFilteredPracticeTests(filteredPractice);
    };

    const clearFilters = () => {
        setSelectedTestType("all");
        setSelectedPrice("all");
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <div className="h-16"></div>

                {/* Hero Section - Compact */}
                <div className="relative bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white py-12 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Test Series</h1>
                        <p className="text-base md:text-lg text-white/90">
                            Practice with daily tests and comprehensive test series
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>Daily Tests</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FileText size={16} />
                                <span>Practice Tests</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Target size={16} />
                                <span>Track Progress</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section - Compact */}
                <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        {/* Desktop Filters */}
                        <div className="hidden md:flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700">Filter by Type:</span>
                                <div className="flex gap-2">
                                    {testTypeFilters.map((filter) => (
                                        <button
                                            key={filter.value}
                                            onClick={() => setSelectedTestType(filter.value)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTestType === filter.value
                                                ? "bg-green-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700">Filter by Price:</span>
                                <div className="flex gap-2">
                                    {priceFilters.map((filter) => (
                                        <button
                                            key={filter.value}
                                            onClick={() => setSelectedPrice(filter.value)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedPrice === filter.value
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results & Clear - Desktop */}
                        <div className="hidden md:flex items-center justify-between mt-2">
                            <div className="text-sm text-gray-600">
                                Showing {filteredDailyTests.length + filteredPracticeTests.length} tests
                            </div>
                            {(selectedTestType !== "all" || selectedPrice !== "all") && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <X size={14} />
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg w-full justify-center"
                        >
                            <Filter size={18} />
                            Filters
                        </button>

                        {/* Mobile Filters */}
                        {showFilters && (
                            <div className="md:hidden mt-3 space-y-3 pb-2">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {testTypeFilters.map((filter) => (
                                            <button
                                                key={filter.value}
                                                onClick={() => setSelectedTestType(filter.value)}
                                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTestType === filter.value
                                                    ? "bg-green-600 text-white shadow-md"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Price</label>
                                    <div className="flex flex-wrap gap-2">
                                        {priceFilters.map((filter) => (
                                            <button
                                                key={filter.value}
                                                onClick={() => setSelectedPrice(filter.value)}
                                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedPrice === filter.value
                                                    ? "bg-blue-600 text-white shadow-md"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Showing {filteredDailyTests.length + filteredPracticeTests.length} tests
                                    </div>
                                    {(selectedTestType !== "all" || selectedPrice !== "all") && (
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <X size={14} />
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tests Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {loading ? (
                        <div className="text-center py-32">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
                            <p className="mt-6 text-gray-600 text-lg font-medium">Loading tests...</p>
                        </div>
                    ) : filteredDailyTests.length === 0 && filteredPracticeTests.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="text-gray-500 text-xl font-medium mb-4">No tests found</p>
                            <p className="text-gray-400">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <>
                            {/* Daily Tests Section */}
                            {filteredDailyTests.length > 0 && (
                                <div className="mb-16">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Calendar className="text-green-600" size={28} />
                                        <h2 className="text-2xl font-bold text-gray-900">Daily Tests</h2>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Free
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredDailyTests.map((test, index) => (
                                            <div
                                                key={test.id}
                                                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-green-100 hover:border-green-300"
                                                style={{
                                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                                }}
                                            >
                                                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 relative">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                                    <div className="relative">
                                                        <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                            <Calendar size={12} />
                                                            DAILY TEST
                                                        </span>
                                                        <h3 className="text-xl font-bold text-white mt-3">{test.subject}</h3>
                                                        <p className="text-white/80 text-sm mt-2">{test.exam_category} • {test.difficulty}</p>
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                                                            <ClipboardList className="mx-auto text-green-600 mb-1" size={20} />
                                                            <p className="text-lg font-bold text-gray-900">{test.questions_count}</p>
                                                            <p className="text-xs text-gray-500">Questions</p>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                                                            <Clock className="mx-auto text-green-600 mb-1" size={20} />
                                                            <p className="text-lg font-bold text-gray-900">{test.duration_minutes}</p>
                                                            <p className="text-xs text-gray-500">Minutes</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                            {test.difficulty}
                                                        </span>
                                                        <span className="text-lg font-bold text-green-600">FREE</span>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setSelectedTest(test)}
                                                            className="flex-1 flex items-center justify-center gap-1 border-2 border-green-600 text-green-600 py-2 rounded-xl hover:bg-green-50 transition text-sm font-medium"
                                                        >
                                                            <Eye size={16} />
                                                            Details
                                                        </button>
                                                        <Link
                                                            href="/signup"
                                                            className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition text-sm font-medium"
                                                        >
                                                            Start Test
                                                            <ArrowRight size={16} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Practice Tests Section */}
                            {filteredPracticeTests.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <FileText className="text-blue-600" size={28} />
                                        <h2 className="text-2xl font-bold text-gray-900">Practice Tests</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredPracticeTests.map((test, index) => {
                                            const isFree = test.is_free || test.price === 0;

                                            return (
                                                <div
                                                    key={test.id}
                                                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                                                    style={{
                                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                                    }}
                                                >
                                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 relative">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                                        <div className="relative">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                                    <FileText size={12} />
                                                                    PRACTICE TEST
                                                                </span>
                                                                {isFree && (
                                                                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                                        FREE
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className="text-xl font-bold text-white">{test.title}</h3>
                                                            <p className="text-white/80 text-sm mt-2 line-clamp-2">{test.description}</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-5">
                                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                                            <div className="bg-gray-50 rounded-lg p-2 text-center">
                                                                <Clock className="mx-auto text-blue-600 mb-1" size={18} />
                                                                <p className="text-sm font-bold text-gray-900">{test.duration_minutes}</p>
                                                                <p className="text-xs text-gray-500">Mins</p>
                                                            </div>
                                                            <div className="bg-gray-50 rounded-lg p-2 text-center">
                                                                <Target className="mx-auto text-blue-600 mb-1" size={18} />
                                                                <p className="text-sm font-bold text-gray-900">{test.total_marks}</p>
                                                                <p className="text-xs text-gray-500">Marks</p>
                                                            </div>
                                                            <div className="bg-gray-50 rounded-lg p-2 text-center">
                                                                <Award className="mx-auto text-blue-600 mb-1" size={18} />
                                                                <p className="text-sm font-bold text-gray-900">{test.passing_marks}</p>
                                                                <p className="text-xs text-gray-500">Pass</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between mb-4">
                                                            {isFree ? (
                                                                <span className="text-xl font-bold text-green-600">Free</span>
                                                            ) : (
                                                                <span className="text-xl font-bold text-blue-600">
                                                                    ₹{test.price.toLocaleString("en-IN")}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setSelectedTest(test)}
                                                                className="flex-1 flex items-center justify-center gap-1 border-2 border-blue-600 text-blue-600 py-2 rounded-xl hover:bg-blue-50 transition text-sm font-medium"
                                                            >
                                                                <Eye size={16} />
                                                                Details
                                                            </button>
                                                            <Link
                                                                href="/signup"
                                                                className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition text-sm font-medium"
                                                            >
                                                                Start Test
                                                                <ArrowRight size={16} />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <style jsx>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
            <Footer />

            {/* Test Detail Modal */}
            {selectedTest && (
                <TestModal test={selectedTest} onClose={() => setSelectedTest(null)} />
            )}
        </>
    );
}

function TestModal({ test, onClose }: { test: Test; onClose: () => void }) {
    const isDailyTest = test.type === 'daily';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`bg-gradient-to-br ${isDailyTest ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-indigo-600'} p-6 relative`}>
                    <div className="relative z-10">
                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                        >
                            <X className="text-white" size={20} />
                        </button>
                        <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
                            {isDailyTest ? 'Daily Test' : 'Practice Test'}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">{test.title}</h2>
                        {isDailyTest ? (
                            <p className="text-white/80 mt-2">{(test as DailyTest).exam_category} • {(test as DailyTest).subject}</p>
                        ) : (
                            <p className="text-white/80 mt-2">{(test as PracticeTest).description}</p>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {isDailyTest ? (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <ClipboardList className="mx-auto text-green-600 mb-2" size={24} />
                                    <p className="text-lg font-bold text-gray-900">{(test as DailyTest).questions_count}</p>
                                    <p className="text-sm text-gray-500">Questions</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <Clock className="mx-auto text-green-600 mb-2" size={24} />
                                    <p className="text-lg font-bold text-gray-900">{(test as DailyTest).duration_minutes} mins</p>
                                    <p className="text-sm text-gray-500">Duration</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3">Test Features:</h4>
                                <div className="space-y-2">
                                    {["Daily updated questions", "Instant results", "Performance tracking", "Free to attempt", "Difficulty: " + (test as DailyTest).difficulty].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-gray-600">
                                            <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <Clock className="mx-auto text-blue-600 mb-2" size={24} />
                                    <p className="text-lg font-bold text-gray-900">{(test as PracticeTest).duration_minutes}</p>
                                    <p className="text-sm text-gray-500">Minutes</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <Target className="mx-auto text-blue-600 mb-2" size={24} />
                                    <p className="text-lg font-bold text-gray-900">{(test as PracticeTest).total_marks}</p>
                                    <p className="text-sm text-gray-500">Total Marks</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <Award className="mx-auto text-blue-600 mb-2" size={24} />
                                    <p className="text-lg font-bold text-gray-900">{(test as PracticeTest).passing_marks}</p>
                                    <p className="text-sm text-gray-500">Passing</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3">Test Features:</h4>
                                <div className="space-y-2">
                                    {["Comprehensive questions", "Detailed solutions", "Performance analysis", "Exam pattern based", "Progress tracking"].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-gray-600">
                                            <CheckCircle className="text-blue-500 flex-shrink-0" size={18} />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                        <div>
                            {isDailyTest || (test as PracticeTest).is_free || (test as PracticeTest).price === 0 ? (
                                <span className="text-3xl font-bold text-green-600">Free</span>
                            ) : (
                                <span className="text-3xl font-bold text-blue-600">
                                    ₹{(test as PracticeTest).price.toLocaleString("en-IN")}
                                </span>
                            )}
                        </div>
                        <Link
                            href="/signup"
                            className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r ${isDailyTest ? 'from-green-600 to-emerald-600' : 'from-blue-600 to-indigo-600'} text-white px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium`}
                        >
                            Start Test Now
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
