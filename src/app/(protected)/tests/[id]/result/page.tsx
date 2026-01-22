"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    X,
    Trophy,
    Target,
    TrendingUp,
    RotateCcw,
} from "lucide-react";

interface TestAttempt {
    id: string;
    test_id: string;
    score: number;
    total_questions: number;
    time_taken: number;
    created_at: string;
    answers: Record<string, string>;
}

interface Test {
    id: string;
    title: string;
    category: string;
    subject: string;
    duration_minutes: number;
    total_questions: number;
    total_marks: number;
}

interface Question {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    explanation?: string;
    marks: number;
    order_index: number;
}

interface Enrollment {
    attempts_used: number;
    attempts_allowed: number;
}

export default function TestResultPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params?.id as string;
    const supabase = createClient();

    const [test, setTest] = useState<Test | null>(null);
    const [attempt, setAttempt] = useState<TestAttempt | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (testId) {
            fetchResults();
        }
    }, [testId]);

    const fetchResults = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            // Fetch test details
            const { data: testData } = await supabase
                .from("tests")
                .select("*")
                .eq("id", testId)
                .single();

            if (!testData) {
                router.push("/tests");
                return;
            }

            setTest(testData);

            // Fetch latest attempt
            const { data: attemptData, error: attemptError } = await supabase
                .from("test_attempts")
                .select("*")
                .eq("user_id", user.id)
                .eq("test_id", testId)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            console.log("Attempt data:", attemptData);
            console.log("Attempt error:", attemptError);

            if (!attemptData) {
                console.log("No attempt found, redirecting to test page");
                router.push(`/tests/${testId}`);
                return;
            }

            setAttempt(attemptData);

            // Fetch questions
            const { data: questionsData } = await supabase
                .from("questions")
                .select("*")
                .eq("test_id", testId)
                .order("order_index");

            if (questionsData) {
                setQuestions(questionsData);
            }

            // Fetch enrollment info
            const { data: enrollmentData } = await supabase
                .from("test_enrollments")
                .select("attempts_used, attempts_allowed")
                .eq("user_id", user.id)
                .eq("test_id", testId)
                .single();

            if (enrollmentData) {
                setEnrollment(enrollmentData);
            }
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        }
        return `${minutes}m ${secs}s`;
    };

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBackground = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return "from-green-500 to-emerald-500";
        if (percentage >= 60) return "from-yellow-500 to-orange-500";
        return "from-red-500 to-rose-500";
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-64 bg-gray-200 rounded mb-6"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!test || !attempt) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Results not found</h1>
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

    const percentage = Math.round((attempt.score / test.total_marks) * 100);
    const correctAnswers = questions.filter(q => attempt.answers[q.id] === q.correct_option).length;
    const incorrectAnswers = questions.filter(q => attempt.answers[q.id] && attempt.answers[q.id] !== q.correct_option).length;
    const unanswered = questions.length - correctAnswers - incorrectAnswers;
    const canRetake = enrollment && enrollment.attempts_used < enrollment.attempts_allowed;

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

            {/* Result Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <div className={`h-2 bg-gradient-to-r ${getScoreBackground(attempt.score, test.total_marks)}`} />
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{test.title}</h1>
                        <p className="text-gray-600">{test.category} • {test.subject}</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div className="text-center">
                            <div className={`text-4xl font-bold mb-2 ${getScoreColor(attempt.score, test.total_marks)}`}>
                                {attempt.score}/{test.total_marks}
                            </div>
                            <p className="text-gray-600">Score</p>
                        </div>
                        <div className="text-center">
                            <div className={`text-4xl font-bold mb-2 ${getScoreColor(attempt.score, test.total_marks)}`}>
                                {percentage}%
                            </div>
                            <p className="text-gray-600">Percentage</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {correctAnswers}/{questions.length}
                            </div>
                            <p className="text-gray-600">Correct</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-600 mb-2">
                                {formatTime(attempt.time_taken)}
                            </div>
                            <p className="text-gray-600">Time Taken</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
                            <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                            <p className="text-green-700 text-sm">Correct</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 text-center">
                            <X className="text-red-600 mx-auto mb-2" size={24} />
                            <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
                            <p className="text-red-700 text-sm">Incorrect</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <Clock className="text-gray-600 mx-auto mb-2" size={24} />
                            <div className="text-2xl font-bold text-gray-600">{unanswered}</div>
                            <p className="text-gray-700 text-sm">Unanswered</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {canRetake && (
                    <Link
                        href={`/tests/${testId}/start`}
                        className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                    >
                        <RotateCcw size={18} />
                        Retake Test
                    </Link>
                )}
                <Link
                    href={`/tests/${testId}`}
                    className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                    View Test Details
                </Link>
                <Link
                    href="/tests"
                    className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                    Browse More Tests
                </Link>
            </div>

            {/* Question Review */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Question Review</h2>
                <div className="space-y-6">
                    {questions.map((question, index) => {
                        const userAnswer = attempt.answers[question.id];
                        const isCorrect = userAnswer === question.correct_option;
                        const isAnswered = !!userAnswer;

                        return (
                            <div key={question.id} className="border rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-medium text-gray-900 flex-1">
                                        Q{index + 1}. {question.question_text}
                                    </h3>
                                    <div className="ml-4 flex items-center gap-2">
                                        {isAnswered ? (
                                            isCorrect ? (
                                                <CheckCircle className="text-green-500" size={20} />
                                            ) : (
                                                <X className="text-red-500" size={20} />
                                            )
                                        ) : (
                                            <Clock className="text-gray-400" size={20} />
                                        )}
                                        <span className="text-sm text-gray-500">
                                            {question.marks} marks
                                        </span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-3 mb-4">
                                    {[
                                        { key: 'A', value: question.option_a },
                                        { key: 'B', value: question.option_b },
                                        { key: 'C', value: question.option_c },
                                        { key: 'D', value: question.option_d }
                                    ].map(option => (
                                        <div
                                            key={option.key}
                                            className={`p-3 rounded-lg border ${option.key === question.correct_answer
                                                ? 'bg-green-100 border-green-300 text-green-800'
                                                : option.key === userAnswer && userAnswer !== question.correct_answer
                                                    ? 'bg-red-100 border-red-300 text-red-800'
                                                    : 'bg-gray-50 border-gray-200'
                                                }`}
                                        >
                                            <span className="font-medium">{option.key}.</span> {option.value}
                                            {option.key === question.correct_answer && (
                                                <span className="ml-2 text-green-600 text-sm">✓ Correct</span>
                                            )}
                                            {option.key === userAnswer && userAnswer !== question.correct_answer && (
                                                <span className="ml-2 text-red-600 text-sm">✗ Your answer</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {question.explanation && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="font-medium text-blue-900 mb-1">Explanation:</p>
                                        <p className="text-blue-800 text-sm">{question.explanation}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Attempt Info */}
            {enrollment && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                        Attempt {enrollment.attempts_used} of {enrollment.attempts_allowed} •
                        Completed on {new Date(attempt.created_at).toLocaleDateString("en-IN", {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            )}
        </div>
    );
}