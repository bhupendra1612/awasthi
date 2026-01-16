"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Clock,
    FileText,
    Trophy,
    CheckCircle,
    AlertCircle,
    Loader2,
    Star,
    Users,
    Target,
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
    passing_marks: number;
    marks_per_question: number;
    negative_marks: number;
    is_free: boolean;
    price: number;
    original_price: number;
    is_featured: boolean;
    thumbnail_url: string;
    instructions: string;
}

export default function TestDetailPage() {
    const params = useParams();
    const testId = params?.id as string;
    const router = useRouter();
    const supabase = createClient();

    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [error, setError] = useState("");
    const [attemptCount, setAttemptCount] = useState(0);

    useEffect(() => {
        if (testId) fetchData();
    }, [testId]);

    async function fetchData() {
        try {
            // Fetch test details
            const { data: testData, error: testError } = await supabase
                .from("tests")
                .select("*")
                .eq("id", testId)
                .eq("is_published", true)
                .single();

            if (testError) throw testError;
            setTest(testData);

            // Check enrollment status
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: enrollment } = await supabase
                    .from("test_enrollments")
                    .select("*")
                    .eq("user_id", user.id)
                    .eq("test_id", testId)
                    .single();

                if (enrollment && (enrollment.payment_status === "paid" || enrollment.payment_status === "free")) {
                    setIsEnrolled(true);
                    setAttemptCount(enrollment.attempts_used || 0);
                }
            }
        } catch (err) {
            console.error("Error fetching test:", err);
            setError("Test not found");
        } finally {
            setLoading(false);
        }
    }

    async function handleEnroll() {
        setEnrolling(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login?redirect=/tests/" + testId);
                return;
            }

            if (test?.is_free) {
                // Free enrollment
                const { error } = await supabase
                    .from("test_enrollments")
                    .insert({
                        user_id: user.id,
                        test_id: testId,
                        payment_status: "free",
                        amount_paid: 0,
                        attempts_allowed: 3, // Allow 3 attempts for free tests
                    });

                if (error) throw error;
                setIsEnrolled(true);
            } else {
                // Paid enrollment - redirect to payment
                // For now, just show a message
                alert("Payment integration coming soon! For now, contact us to enroll.");
            }
        } catch (err) {
            console.error("Error enrolling:", err);
            setError("Failed to enroll. Please try again.");
        } finally {
            setEnrolling(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    if (error || !test) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Test Not Found</h2>
                    <Link href="/tests" className="text-primary-600 hover:underline">
                        Browse all tests
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/tests" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={18} />
                        Back to Tests
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Test Info Card */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {/* Thumbnail */}
                            <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700">
                                {test.thumbnail_url ? (
                                    <Image
                                        src={test.thumbnail_url}
                                        alt={test.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="text-white/30" size={80} />
                                    </div>
                                )}
                                {test.is_featured && (
                                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Star size={14} />
                                        Featured Test
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                        {test.category}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                        {test.subject}
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 mb-4">{test.title}</h1>

                                {test.description && (
                                    <p className="text-gray-600 mb-6">{test.description}</p>
                                )}

                                {/* Test Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <FileText className="mx-auto text-primary-600 mb-2" size={24} />
                                        <p className="text-2xl font-bold text-gray-900">{test.total_questions}</p>
                                        <p className="text-sm text-gray-500">Questions</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <Clock className="mx-auto text-blue-600 mb-2" size={24} />
                                        <p className="text-2xl font-bold text-gray-900">{test.duration_minutes}</p>
                                        <p className="text-sm text-gray-500">Minutes</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <Trophy className="mx-auto text-yellow-600 mb-2" size={24} />
                                        <p className="text-2xl font-bold text-gray-900">{test.total_marks}</p>
                                        <p className="text-sm text-gray-500">Total Marks</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <Target className="mx-auto text-green-600 mb-2" size={24} />
                                        <p className="text-2xl font-bold text-gray-900">{test.passing_marks}%</p>
                                        <p className="text-sm text-gray-500">Passing</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        {test.instructions && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Test Instructions</h2>
                                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                                    {test.instructions}
                                </div>
                            </div>
                        )}

                        {/* Marking Scheme */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Marking Scheme</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <CheckCircle className="text-green-600" size={20} />
                                    <div>
                                        <p className="font-medium text-gray-900">Correct Answer</p>
                                        <p className="text-green-600 font-bold">+{test.marks_per_question} marks</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                    <AlertCircle className="text-red-600" size={20} />
                                    <div>
                                        <p className="font-medium text-gray-900">Wrong Answer</p>
                                        <p className="text-red-600 font-bold">
                                            {test.negative_marks > 0 ? `-${test.negative_marks} marks` : "No negative"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Enrollment Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                            {/* Price */}
                            <div className="text-center mb-6">
                                {test.is_free ? (
                                    <div>
                                        <span className="text-3xl font-bold text-green-600">FREE</span>
                                        <p className="text-gray-500 text-sm mt-1">No payment required</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-3xl font-bold text-gray-900">₹{test.price}</span>
                                            {test.original_price > test.price && (
                                                <span className="text-lg text-gray-400 line-through">
                                                    ₹{test.original_price}
                                                </span>
                                            )}
                                        </div>
                                        {test.original_price > test.price && (
                                            <p className="text-green-600 text-sm mt-1">
                                                Save ₹{test.original_price - test.price}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            {isEnrolled ? (
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                        <CheckCircle className="mx-auto text-green-600 mb-2" size={24} />
                                        <p className="font-medium text-green-800">You are enrolled!</p>
                                        <p className="text-sm text-green-600">
                                            Attempts: {attemptCount}/3
                                        </p>
                                    </div>
                                    {attemptCount < 3 ? (
                                        <Link
                                            href={`/tests/${test.id}/start`}
                                            className="block w-full bg-green-600 text-white py-3 rounded-lg text-center font-medium hover:bg-green-700 transition"
                                        >
                                            Start Test Now
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/tests/${test.id}/result`}
                                            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-center font-medium hover:bg-gray-200 transition"
                                        >
                                            View Results
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {enrolling ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Enrolling...
                                        </>
                                    ) : (
                                        test.is_free ? "Enroll for Free" : "Enroll Now"
                                    )}
                                </button>
                            )}

                            {error && (
                                <p className="text-red-600 text-sm text-center mt-4">{error}</p>
                            )}

                            {/* Features */}
                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle className="text-green-500" size={16} />
                                    <span>Instant result with analysis</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle className="text-green-500" size={16} />
                                    <span>Detailed solutions</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle className="text-green-500" size={16} />
                                    <span>Performance comparison</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle className="text-green-500" size={16} />
                                    <span>3 attempts allowed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}