"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Clock,
    FileText,
    Trophy,
    Star,
    CheckCircle,
    ArrowLeft,
    Play,
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

export default function TestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params?.id as string;
    const supabase = createClient();

    const [test, setTest] = useState<Test | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (testId) {
            fetchTestDetails();
        }
    }, [testId]);

    const fetchTestDetails = async () => {
        try {
            // Fetch test details
            const { data: testData } = await supabase
                .from("tests")
                .select("*")
                .eq("id", testId)
                .single();

            setTest(testData);

            // Fetch user enrollment
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: enrollmentData } = await supabase
                    .from("test_enrollments")
                    .select("*")
                    .eq("user_id", user.id)
                    .eq("test_id", testId)
                    .single();

                setEnrollment(enrollmentData);
            }
        } catch (error) {
            console.error("Error fetching test details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
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
                        attempts_allowed: 3,
                        attempts_used: 0
                    });

                if (!error) {
                    fetchTestDetails(); // Refresh data
                }
            } else {
                // Redirect to payment (implement payment logic here)
                alert("Payment integration needed for paid tests");
            }
        } catch (error) {
            console.error("Error enrolling:", error);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Test not found</h1>
                    <Link
                        href="/tests"
                        className="text-primary-600 hover:text-primary-700"
                    >
                        ← Back to Tests
                    </Link>
                </div>
            </div>
        );
    }

    const isEnrolled = enrollment && (enrollment.payment_status === "paid" || enrollment.payment_status === "free");
    const canAttempt = isEnrolled && (enrollment.attempts_used < enrollment.attempts_allowed);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <Link
                href="/tests"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition"
            >
                <ArrowLeft size={18} />
                Back to Tests
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Test Header */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="relative h-64 bg-gradient-to-br from-primary-500 to-primary-700">
                            {test.thumbnail_url ? (
                                <Image
                                    src={test.thumbnail_url}
                                    alt={test.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FileText className="text-white/30" size={96} />
                                </div>
                            )}
                            {test.is_featured && (
                                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                    <Star size={16} />
                                    Featured
                                </div>
                            )}
                            {isEnrolled && (
                                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                    <CheckCircle size={16} />
                                    Enrolled
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                    {test.category}
                                </span>
                                <span className="text-gray-500">{test.subject}</span>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-4">{test.title}</h1>

                            <div className="flex items-center gap-6 text-gray-600 mb-6">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} />
                                    <span>{test.total_questions} Questions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    <span>{test.duration_minutes} Minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy size={18} />
                                    <span>{test.total_marks} Marks</span>
                                </div>
                            </div>

                            {test.description && (
                                <div className="prose max-w-none">
                                    <p className="text-gray-600">{test.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                        {/* Price */}
                        <div className="mb-6">
                            {test.is_free ? (
                                <div className="text-2xl font-bold text-green-600">FREE</div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-gray-900">₹{test.price}</span>
                                    {test.original_price > test.price && (
                                        <span className="text-lg text-gray-400 line-through">
                                            ₹{test.original_price}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className="mb-6">
                            {isEnrolled ? (
                                canAttempt ? (
                                    <Link
                                        href={`/tests/${test.id}/start`}
                                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition"
                                    >
                                        <Play size={18} />
                                        Start Test
                                    </Link>
                                ) : (
                                    <Link
                                        href={`/tests/${test.id}/result`}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition"
                                    >
                                        View Results
                                    </Link>
                                )
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition"
                                >
                                    {test.is_free ? "Enroll Free" : "Enroll Now"}
                                </button>
                            )}
                        </div>

                        {/* Enrollment Info */}
                        {isEnrolled && enrollment && (
                            <div className="border-t pt-4">
                                <h3 className="font-medium text-gray-900 mb-2">Your Progress</h3>
                                <div className="text-sm text-gray-600">
                                    <p>Attempts: {enrollment.attempts_used}/{enrollment.attempts_allowed}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}