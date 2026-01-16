"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, Shield, Clock, BookOpen, ArrowLeft, Loader2, Copy, Phone } from "lucide-react";
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    class: string;
    subject: string;
    price: number;
    original_price: number;
    duration: string;
    is_combo: boolean;
}

export default function EnrollPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState<"payment" | "submitted">("payment");
    const [courseId, setCourseId] = useState<string>("");
    const [copied, setCopied] = useState(false);

    // UPDATE THESE WITH YOUR DETAILS
    const UPI_ID = "8949658374@ybl";
    const WHATSAPP_NUMBER = "918949658374";

    useEffect(() => {
        const init = async () => {
            const { id } = await params;
            setCourseId(id);
            await fetchCourse(id);
        };
        init();
    }, [params]);

    const fetchCourse = async (id: string) => {
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: enrollment } = await supabase
                .from("enrollments")
                .select("*")
                .eq("user_id", user.id)
                .eq("course_id", id)
                .single();

            if (enrollment) {
                if (enrollment.payment_status === "paid") {
                    router.push(`/course/${id}`);
                    return;
                }
                // Already has pending enrollment
                if (enrollment.payment_status === "pending") {
                    setStep("submitted");
                }
            }
        }

        const { data, error } = await supabase
            .from("courses")
            .select("*")
            .eq("id", id)
            .eq("is_published", true)
            .single();

        if (error || !data) {
            setError("Course not found");
        } else {
            setCourse(data);
        }
        setLoading(false);
    };

    const handlePaymentDone = async () => {
        setSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit");
            }

            setStep("submitted");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit");
        } finally {
            setSubmitting(false);
        }
    };

    const copyUPI = () => {
        navigator.clipboard.writeText(UPI_ID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openWhatsApp = () => {
        const message = encodeURIComponent(
            `Hi, I have paid for "${course?.title}" course.\n\nAmount: ₹${course?.price.toLocaleString("en-IN")}\n\nPlease verify my payment.`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
        );
    }

    if (error && !course) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Link href="/courses" className="text-primary-600 hover:underline">
                    Browse Courses
                </Link>
            </div>
        );
    }

    // Payment submitted - waiting for approval
    if (step === "submitted") {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="text-yellow-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Pending</h1>
                    <p className="text-gray-600 mb-6">
                        Your payment for <strong>{course?.title}</strong> is being verified.
                        You will get access within 1-2 hours.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                        <p className="text-blue-800 text-sm">
                            <strong>Note:</strong> If you haven&apos;t sent payment screenshot yet, please send it on WhatsApp for faster verification.
                        </p>
                        <button
                            onClick={openWhatsApp}
                            className="mt-3 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm w-full"
                        >
                            <Phone size={16} />
                            Send Screenshot on WhatsApp
                        </button>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/dashboard"
                            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-medium"
                        >
                            Go to Dashboard
                        </Link>
                        <Link
                            href="/courses"
                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Browse Courses
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link
                href={`/course/${courseId}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Course
            </Link>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Course Summary */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Summary</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Course</p>
                            <p className="font-medium text-gray-900">{course?.title}</p>
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Class</p>
                                <p className="font-medium text-gray-900">{course?.class}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Subject</p>
                                <p className="font-medium text-gray-900">{course?.subject}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium text-gray-900">{course?.duration}</p>
                        </div>
                    </div>

                    <hr className="my-6" />

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <CheckCircle className="text-green-500" size={18} />
                            <span>Full lifetime access</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <BookOpen className="text-primary-500" size={18} />
                            <span>All video lessons & PDF notes</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Clock className="text-blue-500" size={18} />
                            <span>Learn at your own pace</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Shield className="text-purple-500" size={18} />
                            <span>Certificate of completion</span>
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>

                    {/* Price Summary */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Course Price</span>
                            <span className="text-gray-400 line-through">
                                ₹{course?.original_price.toLocaleString("en-IN")}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Discount</span>
                            <span className="text-green-600">
                                -₹{((course?.original_price || 0) - (course?.price || 0)).toLocaleString("en-IN")}
                            </span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-xl font-bold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-primary-600">
                                ₹{course?.price.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* UPI Payment Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                        <p className="text-sm font-medium text-blue-900 mb-3">Pay via UPI:</p>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                            <span className="font-mono font-bold text-lg">{UPI_ID}</span>
                            <button
                                onClick={copyUPI}
                                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm"
                            >
                                <Copy size={14} />
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Payment Done Button */}
                    <button
                        onClick={handlePaymentDone}
                        disabled={submitting}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                I Have Paid - Payment Done
                            </>
                        )}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-3">
                        Click after completing UPI payment
                    </p>
                </div>
            </div>
        </div>
    );
}
