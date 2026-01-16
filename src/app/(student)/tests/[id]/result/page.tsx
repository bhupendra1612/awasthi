"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    ArrowLeft,
    Trophy,
    CheckCircle,
    XCircle,
    Clock,
    Target,
    TrendingUp,
    Award,
    Loader2,
    FileText,
    RotateCcw,
} from "lucide-react";

interface TestAttempt {
    id: string;
    test_id: string;
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
}

interface Test {
    id: string;
    title: string;
    category: string;
    subject: string;
    passing_marks: number;
    duration_minutes: number;
}

interface AnswerDetail {
    id: string;
    question_id: string;
    selected_option: string;
    is_correct: boolean;
    questions: {
        question_text: string;
        option_a: string;
        option_b: string;
        option_c: string;
        option_d: string;
        correct_option: string;
        explanation: string;
    };
}

export default function TestResultPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const testId = params?.id as string;
    const attemptId = searchParams.get("attempt");
    const supabase = createClient();

    const [test, setTest] = useState<Test | null>(null);
    const [attempt, setAttempt] = useState<TestAttempt | null>(null);
    const [answers, setAnswers] = useState<AnswerDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSolutions, setShowSolutions] = useState(false);

    useEffect(() => {
        if (testId) fetchData();
    }, [testId, attemptId]);

    async function fetchData() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch test
            const { data: testData } = await supabase
                .from("tests")
                .select("*")
                .eq("id", testId)
                .single();

            setTest(testData);

            // Fetch attempt (latest or specific)
            let attemptQuery = supabase
                .from("test_attempts")
                .select("*")
                .eq("test_id", testId)
                .eq("user_id", user.id)
                .in("status", ["submitted", "auto_submitted"]);

            if (attemptId) {
                attemptQuery = attemptQuery.eq("id", attemptId);
            } else {
                attemptQuery = attemptQuery.order("submitted_at", { ascending: false }).limit(1);
            }

            const { data: attemptData } = await attemptQuery.single();
            setAttempt(attemptData);

            if (attemptData) {
                // Fetch answers with questions
                const { data: answersData } = await supabase
                    .from("test_answers")
                    .select(`
                        *,
                        questions (
                            question_text,
                            option_a,
                            option_b,
                            option_c,
                            option_d,
                            correct_option,
                            explanation
                        )
                    `)
                    .eq("attempt_id", attemptData.id)
                    .order("id");

                setAnswers(answersData || []);
            }
        } catch (error) {
            console.error("Error fetching result:", error);
        } finally {
            setLoading(false);
        }
    }

    function formatTime(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    if (!attempt || !test) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Result Found</h2>
                    <Link href="/tests" className="text-primary-600 hover:underline">
                        Browse Tests
                    </Link>
                </div>
            </div>
        );
    }

    const passed = attempt.percentage >= test.passing_marks;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className={`py-12 ${passed ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600"}`}>
                <div className="container mx-auto px-4 text-center text-white">
                    <div className="mb-4">
                        {passed ? (
                            <Award className="mx-auto" size={64} />
                        ) : (
                            <Target className="mx-auto" size={64} />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        {passed ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
                    </h1>
                    <p className="text-white/80">
                        {passed
                            ? "You have passed the test successfully!"
                            : `You need ${test.passing_marks}% to pass. Try again!`}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Back Link */}
                <Link href="/tests" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
                    <ArrowLeft size={18} />
                    Back to Tests
                </Link>

                {/* Score Card */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{test.title}</h2>

                    {/* Main Score */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${passed ? "bg-green-100" : "bg-red-100"
                            }`}>
                            <div>
                                <p className={`text-4xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
                                    {attempt.percentage.toFixed(1)}%
                                </p>
                                <p className="text-sm text-gray-500">Score</p>
                            </div>
                        </div>
                        <p className="mt-4 text-2xl font-bold text-gray-900">
                            {attempt.marks_obtained} / {attempt.total_marks} marks
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <FileText className="mx-auto text-blue-600 mb-2" size={24} />
                            <p className="text-2xl font-bold text-gray-900">{attempt.total_questions}</p>
                            <p className="text-sm text-gray-500">Total Questions</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <CheckCircle className="mx-auto text-green-600 mb-2" size={24} />
                            <p className="text-2xl font-bold text-green-600">{attempt.correct}</p>
                            <p className="text-sm text-gray-500">Correct</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 text-center">
                            <XCircle className="mx-auto text-red-600 mb-2" size={24} />
                            <p className="text-2xl font-bold text-red-600">{attempt.wrong}</p>
                            <p className="text-sm text-gray-500">Wrong</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <Target className="mx-auto text-gray-600 mb-2" size={24} />
                            <p className="text-2xl font-bold text-gray-600">{attempt.skipped}</p>
                            <p className="text-sm text-gray-500">Skipped</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <Clock className="mx-auto text-blue-600 mb-2" size={24} />
                            <p className="text-2xl font-bold text-blue-600">
                                {formatTime(attempt.time_taken_seconds || 0)}
                            </p>
                            <p className="text-sm text-gray-500">Time Taken</p>
                        </div>
                    </div>

                    {/* Accuracy Bar */}
                    <div className="mt-8">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Accuracy</span>
                            <span className="font-medium">
                                {attempt.attempted > 0
                                    ? ((attempt.correct / attempt.attempted) * 100).toFixed(1)
                                    : 0}%
                            </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                                style={{
                                    width: `${attempt.attempted > 0 ? (attempt.correct / attempt.attempted) * 100 : 0}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t">
                        <button
                            onClick={() => setShowSolutions(!showSolutions)}
                            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            <FileText size={18} />
                            {showSolutions ? "Hide Solutions" : "View Solutions"}
                        </button>
                        <Link
                            href={`/tests/${testId}`}
                            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            <RotateCcw size={18} />
                            Retake Test
                        </Link>
                        <Link
                            href="/tests"
                            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Browse More Tests
                        </Link>
                    </div>
                </div>

                {/* Solutions */}
                {showSolutions && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Solutions</h2>
                        {answers.map((answer, index) => {
                            const q = answer.questions;
                            if (!q) return null;

                            return (
                                <div
                                    key={answer.id}
                                    className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${answer.is_correct === true
                                            ? "border-green-500"
                                            : answer.is_correct === false
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${answer.is_correct === true
                                                ? "bg-green-100 text-green-700"
                                                : answer.is_correct === false
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-gray-900 font-medium mb-4">{q.question_text}</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                                {["A", "B", "C", "D"].map((opt) => {
                                                    const optionText = q[`option_${opt.toLowerCase()}` as keyof typeof q] as string;
                                                    if (!optionText) return null;

                                                    const isCorrect = q.correct_option === opt;
                                                    const isSelected = answer.selected_option === opt;

                                                    let bgClass = "bg-gray-50";
                                                    if (isCorrect) bgClass = "bg-green-100 border-green-300";
                                                    else if (isSelected && !isCorrect) bgClass = "bg-red-100 border-red-300";

                                                    return (
                                                        <div
                                                            key={opt}
                                                            className={`px-4 py-2 rounded-lg border ${bgClass}`}
                                                        >
                                                            <span className="font-medium">{opt}.</span> {optionText}
                                                            {isCorrect && (
                                                                <CheckCircle className="inline ml-2 text-green-600" size={16} />
                                                            )}
                                                            {isSelected && !isCorrect && (
                                                                <XCircle className="inline ml-2 text-red-600" size={16} />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {q.explanation && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <p className="text-sm text-blue-800">
                                                        <strong>Explanation:</strong> {q.explanation}
                                                    </p>
                                                </div>
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