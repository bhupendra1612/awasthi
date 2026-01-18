"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import {
    Clock,
    FileText,
    ArrowLeft,
    ArrowRight,
    Flag,
    AlertCircle,
} from "lucide-react";

interface Question {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    marks: number;
    negative_marks: number;
    order_index: number;
}

interface Test {
    id: string;
    title: string;
    duration_minutes: number;
    total_questions: number;
    negative_marks: number;
}

interface Answer {
    questionId: string;
    selectedOption: string | null;
    isMarkedForReview: boolean;
}

export default function TestStartPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params?.id as string;
    const supabase = createClient();

    const [test, setTest] = useState<Test | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    useEffect(() => {
        if (testId) {
            initializeTest();
        }
    }, [testId]);

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) return;

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
    }, [timeLeft]);

    const initializeTest = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            // Check enrollment
            const { data: enrollment } = await supabase
                .from("test_enrollments")
                .select("*")
                .eq("user_id", user.id)
                .eq("test_id", testId)
                .single();

            if (!enrollment || (enrollment.payment_status !== "paid" && enrollment.payment_status !== "free")) {
                router.push(`/tests/${testId}`);
                return;
            }

            if (enrollment.attempts_used >= enrollment.attempts_allowed) {
                router.push(`/tests/${testId}/result`);
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

            // Fetch questions
            const { data: questionsData } = await supabase
                .from("questions")
                .select("*")
                .eq("test_id", testId)
                .order("order_index");

            if (questionsData) {
                setQuestions(questionsData);
                setTimeLeft(testData.duration_minutes * 60);
            }
        } catch (error) {
            console.error("Error initializing test:", error);
            router.push("/tests");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId: string, option: string) => {
        setAnswers(prev => {
            const newAnswers = new Map(prev);
            newAnswers.set(questionId, {
                questionId,
                selectedOption: option,
                isMarkedForReview: prev.get(questionId)?.isMarkedForReview || false
            });
            return newAnswers;
        });
    };

    const handleMarkForReview = (questionId: string) => {
        setAnswers(prev => {
            const newAnswers = new Map(prev);
            const existing = prev.get(questionId);
            newAnswers.set(questionId, {
                questionId,
                selectedOption: existing?.selectedOption || null,
                isMarkedForReview: !existing?.isMarkedForReview
            });
            return newAnswers;
        });
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Calculate score
            let score = 0;
            let totalMarks = 0;
            const answerData: Record<string, string> = {};

            questions.forEach(question => {
                const answer = answers.get(question.id);
                answerData[question.id] = answer?.selectedOption || "";

                if (answer?.selectedOption === question.correct_answer) {
                    score += question.marks;
                } else if (answer?.selectedOption && test?.negative_marks) {
                    score -= question.negative_marks;
                }
                totalMarks += question.marks;
            });

            const timeTaken = (test!.duration_minutes * 60) - timeLeft;

            // Save attempt
            const { error } = await supabase
                .from("test_attempts")
                .insert({
                    user_id: user.id,
                    test_id: testId,
                    score,
                    total_questions: questions.length,
                    time_taken: timeTaken,
                    answers: answerData
                });

            if (error) {
                console.error("Error saving attempt:", error);
                return;
            }

            // Update enrollment attempts
            const { data: currentEnrollment } = await supabase
                .from("test_enrollments")
                .select("attempts_used")
                .eq("user_id", user.id)
                .eq("test_id", testId)
                .single();

            if (currentEnrollment) {
                await supabase
                    .from("test_enrollments")
                    .update({
                        attempts_used: currentEnrollment.attempts_used + 1
                    })
                    .eq("user_id", user.id)
                    .eq("test_id", testId);
            }

            router.push(`/tests/${testId}/result`);
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
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!test || questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Test not available</h2>
                    <p className="text-gray-600 mb-4">This test is not available or has no questions.</p>
                    <button
                        onClick={() => router.push("/tests")}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Back to Tests
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers.get(currentQuestion.id);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">{test.title}</h1>
                    <p className="text-sm text-gray-600">Question {currentIndex + 1} of {questions.length}</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 text-sm ${timeLeft < 300 ? "text-red-600 font-bold" : "text-gray-600"}`}>
                        <Clock size={16} />
                        <span>{formatTime(timeLeft)}</span>
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
                    className="bg-primary-600 h-1 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    {/* Question */}
                    <div className="mb-8">
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-xl font-medium text-gray-900 flex-1">
                                Q{currentIndex + 1}. {currentQuestion.question_text}
                            </h2>
                            <div className="ml-4 text-sm text-gray-500">
                                Marks: {currentQuestion.marks}
                                {test.negative_marks && (
                                    <span className="text-red-500 ml-2">
                                        (-{currentQuestion.negative_marks})
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-8">
                        {[
                            { key: 'A', value: currentQuestion.option_a },
                            { key: 'B', value: currentQuestion.option_b },
                            { key: 'C', value: currentQuestion.option_c },
                            { key: 'D', value: currentQuestion.option_d }
                        ].map(option => (
                            <button
                                key={option.key}
                                onClick={() => handleAnswerSelect(currentQuestion.id, option.key)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${currentAnswer?.selectedOption === option.key
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <span className="font-medium text-primary-600 mr-3">{option.key}.</span>
                                <span>{option.value}</span>
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => handleMarkForReview(currentQuestion.id)}
                            className={`px-4 py-2 rounded-lg border transition ${currentAnswer?.isMarkedForReview
                                ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {currentAnswer?.isMarkedForReview ? 'Unmark for Review' : 'Mark for Review'}
                        </button>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                disabled={currentIndex === 0}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft size={16} />
                                <span>Previous</span>
                            </button>

                            <button
                                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                                disabled={currentIndex === questions.length - 1}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Next</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Question Navigation */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Question Navigation</h3>
                    <div className="grid grid-cols-10 gap-2">
                        {questions.map((_, index) => {
                            const answer = answers.get(questions[index].id);
                            const isAnswered = !!answer?.selectedOption;
                            const isMarked = !!answer?.isMarkedForReview;
                            const isCurrent = index === currentIndex;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition ${isCurrent
                                        ? 'bg-primary-600 text-white'
                                        : isAnswered
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : isMarked
                                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
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
                            <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                            <span>Marked for Review</span>
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