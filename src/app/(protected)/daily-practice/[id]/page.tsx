"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Clock,
    FileText,
    ArrowLeft,
    ArrowRight,
    Flag,
    AlertCircle,
    CheckCircle,
    X,
    Sparkles,
} from "lucide-react";

interface DailyTest {
    id: string;
    title: string;
    exam_category: string;
    subject: string;
    difficulty: string;
    questions_count: number;
    duration_minutes: number;
    test_date: string;
    questions: any[];
}

interface Question {
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
}

interface TestAttempt {
    id: string;
    score: number;
    total_questions: number;
    time_taken: number;
    completed_at: string;
    answers: Record<string, string>;
}

export default function DailyPracticeTestPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params?.id as string;
    const supabase = createClient();

    const [test, setTest] = useState<DailyTest | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [attempt, setAttempt] = useState<TestAttempt | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    useEffect(() => {
        if (testId) {
            initializeTest();
        }
    }, [testId]);

    // Timer
    useEffect(() => {
        if (timeLeft <= 0 || showResult) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, showResult]);

    const initializeTest = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            // Check if user already attempted this test
            const { data: existingAttempt } = await supabase
                .from("daily_test_attempts")
                .select("*")
                .eq("user_id", user.id)
                .eq("daily_test_id", testId)
                .single();

            if (existingAttempt) {
                setAttempt(existingAttempt);
                setShowResult(true);
            }

            // Fetch test details
            const { data: testData } = await supabase
                .from("generated_daily_tests")
                .select("*")
                .eq("id", testId)
                .single();

            if (!testData) {
                router.push("/tests");
                return;
            }

            setTest(testData);

            // Parse questions from JSON format
            if (testData.questions && Array.isArray(testData.questions)) {
                const parsedQuestions = testData.questions.map((q: any, index: number) => ({
                    id: q.id?.toString() || index.toString(),
                    question: q.question || q.question_text || '',
                    options: q.options || [q.option_a, q.option_b, q.option_c, q.option_d] || [],
                    correct_answer: typeof q.correct_answer === 'number'
                        ? q.correct_answer
                        : ['A', 'B', 'C', 'D'].indexOf(q.correct_answer),
                    explanation: q.explanation || ''
                }));
                setQuestions(parsedQuestions);
            }

            if (!existingAttempt) {
                setTimeLeft(testData.duration_minutes * 60);
            }
        } catch (error) {
            console.error("Error initializing test:", error);
            router.push("/tests");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId: string, optionIndex: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex.toString()
        }));
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Calculate score
            let score = 0;
            questions.forEach(question => {
                const userAnswer = parseInt(answers[question.id] || '-1');
                if (userAnswer === question.correct_answer) {
                    score++;
                }
            });

            const timeTaken = (test!.duration_minutes * 60) - timeLeft;

            // Save attempt
            const { data: attemptData } = await supabase
                .from("daily_test_attempts")
                .insert({
                    user_id: user.id,
                    daily_test_id: testId,
                    score,
                    total_questions: questions.length,
                    time_taken: timeTaken,
                    answers
                })
                .select()
                .single();

            if (attemptData) {
                setAttempt(attemptData);
            }

            setShowResult(true);
        } catch (error) {
            console.error("Error submitting test:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAutoSubmit = () => {
        handleSubmit();
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-64 bg-gray-200 rounded mb-6"></div>
                </div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Test not found</h2>
                    <p className="text-gray-600 mb-4">This daily practice test is not available.</p>
                    <Link
                        href="/tests"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Back to Tests
                    </Link>
                </div>
            </div>
        );
    }

    if (showResult && attempt) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="text-white" size={32} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{test.subject}</h1>
                            <p className="text-gray-600">{test.exam_category} • Daily Practice</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center">
                                <div className={`text-4xl font-bold mb-2 ${getScoreColor(attempt.score, attempt.total_questions)}`}>
                                    {attempt.score}/{attempt.total_questions}
                                </div>
                                <p className="text-gray-600">Score</p>
                            </div>
                            <div className="text-center">
                                <div className={`text-4xl font-bold mb-2 ${getScoreColor(attempt.score, attempt.total_questions)}`}>
                                    {Math.round((attempt.score / attempt.total_questions) * 100)}%
                                </div>
                                <p className="text-gray-600">Percentage</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    {formatTime(attempt.time_taken)}
                                </div>
                                <p className="text-gray-600">Time Taken</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
                                <div className="text-2xl font-bold text-green-600">{attempt.score}</div>
                                <p className="text-green-700 text-sm">Correct</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4 text-center">
                                <X className="text-red-600 mx-auto mb-2" size={24} />
                                <div className="text-2xl font-bold text-red-600">{attempt.total_questions - attempt.score}</div>
                                <p className="text-red-700 text-sm">Incorrect</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link
                        href="/tests"
                        className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                    >
                        Browse More Tests
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Question Review */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Question Review</h2>
                    <div className="space-y-6">
                        {questions.map((question, index) => {
                            const userAnswer = parseInt(attempt.answers[question.id] || '-1');
                            const isCorrect = userAnswer === question.correct_answer;

                            return (
                                <div key={question.id} className="border rounded-lg p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="font-medium text-gray-900 flex-1">
                                            Q{index + 1}. {question.question}
                                        </h3>
                                        {isCorrect ? (
                                            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                                        ) : (
                                            <X className="text-red-500 flex-shrink-0" size={20} />
                                        )}
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        {question.options.map((option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className={`p-3 rounded ${optionIndex === question.correct_answer
                                                        ? 'bg-green-100 text-green-800'
                                                        : optionIndex === userAnswer && userAnswer !== question.correct_answer
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-50'
                                                    }`}
                                            >
                                                <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                                                {optionIndex === question.correct_answer && (
                                                    <span className="ml-2 text-green-600">✓ Correct</span>
                                                )}
                                                {optionIndex === userAnswer && userAnswer !== question.correct_answer && (
                                                    <span className="ml-2 text-red-600">✗ Your answer</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {question.explanation && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                            <p className="font-medium text-blue-900 mb-1">Explanation:</p>
                                            <p className="text-blue-800 text-sm">{question.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No questions available</h2>
                    <p className="text-gray-600 mb-4">This test has no questions.</p>
                    <Link
                        href="/tests"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Back to Tests
                    </Link>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">{test.subject}</h2>
                    <p className="text-sm text-gray-600">{test.exam_category} • Daily Practice</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 text-sm ${timeLeft < 300 ? "text-red-600 font-bold" : "text-gray-600"}`}>
                        <Clock size={16} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileText size={16} />
                        <span>{currentIndex + 1}/{questions.length}</span>
                    </div>

                    <button
                        onClick={() => setShowConfirmSubmit(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        <Flag size={16} />
                        <span>Submit</span>
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 h-1">
                <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    {/* Question */}
                    <div className="mb-8">
                        <h3 className="text-xl font-medium text-gray-900 mb-6">
                            Q{currentIndex + 1}. {currentQuestion.question}
                        </h3>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-8">
                        {currentQuestion.options.map((option, optionIndex) => (
                            <button
                                key={optionIndex}
                                onClick={() => handleAnswerSelect(currentQuestion.id, optionIndex)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestion.id] === optionIndex.toString()
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <span className="font-medium text-primary-600 mr-3">
                                    {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span>{option}</span>
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                            disabled={currentIndex === 0}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft size={16} />
                            <span>Previous</span>
                        </button>

                        <div className="text-sm text-gray-600">
                            Answered: {Object.keys(answers).length}/{questions.length}
                        </div>

                        {currentIndex === questions.length - 1 ? (
                            <button
                                onClick={() => setShowConfirmSubmit(true)}
                                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <Flag size={16} />
                                <span>Submit Test</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                <span>Next</span>
                                <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Question Navigation Grid */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Question Navigation</h3>
                    <div className="grid grid-cols-10 gap-2">
                        {questions.map((_, index) => {
                            const isAnswered = answers[questions[index].id] !== undefined;
                            const isCurrent = index === currentIndex;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition ${isCurrent
                                            ? 'bg-primary-600 text-white'
                                            : isAnswered
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-6 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-100 rounded"></div>
                            <span>Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-100 rounded"></div>
                            <span>Not Answered</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Test?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to submit your test? You cannot change your answers after submission.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowConfirmSubmit(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}