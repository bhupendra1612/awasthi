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
    IndianRupee,
    Filter,
    Loader2,
    CheckCircle,
    Trophy,
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
    original_price: number;
    is_featured: boolean;
    thumbnail_url: string;
}

interface Enrollment {
    test_id: string;
    payment_status: string;
    attempts_used: number;
    attempts_allowed: number;
}

export default function TestsPage() {
    const supabase = createClient();
    const [tests, setTests] = useState<Test[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");

    const categories = [
        "SSC", "Railway", "Bank", "RPSC", "RSMSSB",
        "Police", "UPSC", "Teaching", "Defence"
    ];

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            // Fetch published tests
            const { data: testsData } = await supabase
                .from("tests")
                .select("*")
                .eq("is_published", true)
                .order("is_featured", { ascending: false })
                .order("created_at", { ascending: false });

            setTests(testsData || []);

            // Fetch user's enrollments
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: enrollmentsData } = await supabase
                    .from("test_enrollments")
                    .select("test_id, payment_status, attempts_used, attempts_allowed")
                    .eq("user_id", user.id);

                setEnrollments(enrollmentsData || []);
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
        return matchesSearch && matchesCategory && matchesPrice;
    });

    const isEnrolled = (testId: string) => {
        const enrollment = enrollments.find((e) => e.test_id === testId);
        return enrollment && (enrollment.payment_status === "paid" || enrollment.payment_status === "free");
    };

    const getEnrollment = (testId: string) => {
        return enrollments.find((e) => e.test_id === testId);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">Test Series</h1>
                    <p className="text-primary-100">
                        Practice with mock tests designed for government exam preparation
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
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
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="all">All Tests</option>
                            <option value="free">Free Tests</option>
                            <option value="paid">Paid Tests</option>
                        </select>
                    </div>
                </div>

                {/* Tests Grid */}
                {filteredTests.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
                        <p className="text-gray-500">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTests.map((test) => {
                            const enrolled = isEnrolled(test.id);
                            const enrollment = getEnrollment(test.id);
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
                                                canAttempt ? (
                                                    <Link
                                                        href={`/tests/${test.id}/start`}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                                                    >
                                                        Start Test
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/tests/${test.id}/result`}
                                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                                                    >
                                                        View Result
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
                )}
            </div>
        </div>
    );
}