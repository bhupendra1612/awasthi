"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Flag,
    CheckCircle,
    AlertTriangle,
    Loader2,
    Send,
} from "lucide-react";

interface Question {
    id: string;
    question_text: string;
    question_image?: string;
    option_a: string;
    option_b: string;
    option_c?: string;
    option_d?: string;
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

export default function TestTakingPage() {
    const params = useParams();
    const testId = params?.id as string;
    const router = useRouter();
    const supabase = createClient();

    const [test, setTest] = useState<Test | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    useEffect(() => {
        if (testId) initializeTest();
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

    async function initializeTest() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            // Fetch test
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
            setTimeLeft(testData.duration_minutes * 60);

            // Fetch questions
            const { data: questionsData } = await supabase
                .from("questions")
                .select("id, question_text, question_image, option_a, option_b, option_c, option_d, order_index")
                .eq("test_id", testId)
                .order("order_index", { ascending: true });

            setQuestions(questionsData || []);

            // Initialize answers map
            const initialAnswers = new Map<string, Answer>();
            questionsData?.forEach((q) => {
                initialAnswers.set(q.id, {
                    questionId: q.id,
                    selectedOption: null,
                    isMarkedForReview: false,
                });
            });
            setAnswers(initialAnswers);

            // Check enrollment and create attempt
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

            // Create new attempt
            const { data: attempt, error: attemptError } = await supabase
                .from("test_attempts")
                .insert({
                    user_id: user.id,
                    test_id: testId,
                    enrollment_id: enrollment.id,
                    total_questions: questionsData?.length || 0,
                    total_marks: testData.total_marks,
                })
                .select()
                .single();

            if (attemptError) throw attemptError;
            setAttemptId(attempt.id);

            // Update enrollment attempts
            await supabase
                .from("test_enrollments")
                .update({ attempts_used: (enrollment.attempts_used || 0) + 1 })
                .eq("id", enrollment.id);

        } catch (error) {
            console.error("Error initializing test:", error);
            router.push("/tests");
        } finally {
            setLoading(false);
        }
    }

    function selectOption(option: string) {
        const currentQuestion = questions[currentIndex];
        if (!currentQuestion) return;

        const newAnswers = new Map(answers);
        const currentAnswer = newAnswers.get(currentQuestion.id);

        newAnswers.set(currentQuestion.id, {
            ...currentAnswer!,
            selectedOption: currentAnswer?.selectedOption === option ? null : option,
        });

        setAnswers(newAnswers);
    }

    function toggleMarkForReview() {
        const currentQuestion = questions[currentIndex];
        if (!currentQuestion) return;

        const newAnswers = new Map(answers);
        const currentAnswer = newAnswers.get(currentQuestion.id);

        newAnswers.set(currentQuestion.id, {
            ...currentAnswer!,
            isMarkedForReview: !currentAnswer?.isMarkedForReview,
        });

        setAnswers(newAnswers);
    }

    function goToQuestion(index: number) {
        if (index >= 0 && index < questions.length) {
            setCurrentIndex(index);
        }
    }

    async function handleAutoSubmit() {
        await submitTest(true);
    }

    async function submitTest(isAutoSubmit = false) {
        if (submitting || !attemptId) return;
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch correct answers
            const { data: questionsWithAnswers } = await supabase
                .from("questions")
                .select("id, correct_option, marks, negative_marks")
                .eq("test_id", testId);

            // Calculate results
            let correct = 0;
            let wrong = 0;
            let skipped = 0;
            let marksObtained = 0;

            const answerRecords: any[] = [];

            questionsWithAnswers?.forEach((q) => {
                const answer = answers.get(q.id);
                const selectedOption = answer?.selectedOption;
                const isCorrect = selectedOption === q.correct_option;

                if (!selectedOption) {
                    skipped++;
                } else if (isCorrect) {
                    correct++;
                    marksObtained += q.marks;
                } else {
                    wrong++;
                    marksObtained -= q.negative_marks || 0;
                }

                answerRecords.push({
                    attempt_id: attemptId,
                    question_id: q.id,
                    selected_option: selectedOption,
                    is_correct: selectedOption ? isCorrect : null,
                    is_marked_for_review: answer?.isMarkedForReview || false,
                });
            });

            // Save answers
            await supabase.from("test_answers").insert(answerRecords);

            // Calculate percentage
            const totalMarks = test?.total_questions || 1;
            const percentage = Math.max(0, (marksObtained / totalMarks) * 100);

            // Update attempt
            await supabase
                .from("test_attempts")
                .update({
                    status: isAutoSubmit ? "auto_submitted" : "submitted",
                    submitted_at: new Date().toISOString(),
                    time_taken_seconds: (test?.duration_minutes || 0) * 60 - timeLeft,
                    attempted: correct + wrong,
                    correct,
                    wrong,
                    skipped,
                    marks_obtained: Math.max(0, marksObtained),
                    percentage: percentage.toFixed(2),
                })
                .eq("id", attemptId);

            // Redirect to result
            router.push(`/tests/${testId}/result?attempt=${attemptId}`);

        } catch (error) {
            console.error("Error submitting test:", error);
            setSubmitting(false);
        }
    }

    function formatTime(seconds: number) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    function getQuestionStatus(questionId: string) {
        const answer = answers.get(questionId);
        if (!answer) return "not-visited";
        if (answer.isMarkedForReview && answer.selectedOption) return "answered-marked";
        if (answer.isMarkedForReview) return "marked";
        if (answer.selectedOption) return "answered";
        return "not-answered";
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary-600 mx-auto mb-4" size={40} />
                    <p className="text-gray-600">Loading test...</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : null;

    // Stats
    const answeredCount = Array.from(answers.values()).filter((a) => a.selectedOption).length;
    const markedCount = Array.from(answers.values()).filter((a) => a.isMarkedForReview).length;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="font-bold text-gray-900 truncate">{test?.title}</h1>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-primary-100 text-primary-700"
                            }`}>
                            <Clock size={20} />
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex">
                {/* Main Content */}
                <div className="flex-1 p-4 md:p-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl mx-auto">
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-medium text-gray-500">
                                Question {currentIndex + 1} of {questions.length}
                            </span>
                            <button
                                onClick={toggleMarkForReview}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${currentAnswer?.isMarkedForReview
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <Flag size={16} />
                                {currentAnswer?.isMarkedForReview ? "Marked" : "Mark for Review"}
                            </button>
                        </div>

                        {/* Question */}
                        <div className="mb-8">
                            <p className="text-lg text-gray-900 leading-relaxed">
                                {currentQuestion?.question_text}
                            </p>
                            {currentQuestion?.question_image && (
                                <img
                                    src={currentQuestion.question_image}
                                    alt="Question"
                                    className="mt-4 max-w-full rounded-lg"
                                />
                            )}
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {["A", "B", "C", "D"].map((opt) => {
                                const optionText = currentQuestion?.[`option_${opt.toLowerCase()}` as keyof Question] as string;
                                if (!optionText) return null;

                                const isSelected = currentAnswer?.selectedOption === opt;

                                return (
                                    <button
                                        key={opt}
                                        onClick={() => selectOption(opt)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition ${isSelected
                                                ? "border-primary-500 bg-primary-50"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isSelected
                                                    ? "bg-primary-500 text-white"
                                                    : "bg-gray-200 text-gray-600"
                                                }`}>
                                                {opt}
                                            </span>
                                            <span className="flex-1 text-gray-800">{optionText}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t">
                            <button
                                onClick={() => goToQuestion(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                                Previous
                            </button>

                            {currentIndex === questions.length - 1 ? (
                                <button
                                    onClick={() => setShowConfirmSubmit(true)}
                                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                >
                                    <Send size={18} />
                                    Submit Test
                                </button>
                            ) : (
                                <button
                                    onClick={() => goToQuestion(currentIndex + 1)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Next
                                    <ChevronRight size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Question Palette */}
                <div className="w-72 bg-white border-l p-4 hidden md:block">
                    <h3 className="font-bold text-gray-900 mb-4">Question Palette</h3>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-green-500"></span>
                            <span>Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-red-500"></span>
                            <span>Not Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-purple-500"></span>
                            <span>Marked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-gray-300"></span>
                            <span>Not Visited</span>
                        </div>
                    </div>

                    {/* Question Grid */}
                    <div className="grid grid-cols-5 gap-2 mb-6">
                        {questions.map((q, index) => {
                            const status = getQuestionStatus(q.id);
                            const isCurrent = index === currentIndex;

                            let bgColor = "bg-gray-200";
                            if (status === "answered") bgColor = "bg-green-500 text-white";
                            else if (status === "not-answered") bgColor = "bg-red-500 text-white";
                            else if (status === "marked" || status === "answered-marked") bgColor = "bg-purple-500 text-white";

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => goToQuestion(index)}
                                    className={`w-10 h-10 rounded font-medium text-sm ${bgColor} ${isCurrent ? "ring-2 ring-primary-500 ring-offset-2" : ""
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 text-sm border-t pt-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Answered:</span>
                            <span className="font-medium text-green-600">{answeredCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Not Answered:</span>
                            <span className="font-medium text-red-600">{questions.length - answeredCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Marked for Review:</span>
                            <span className="font-medium text-purple-600">{markedCount}</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={() => setShowConfirmSubmit(true)}
                        className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                        <Send size={18} />
                        Submit Test
                    </button>
                </div>
            </div>

            {/* Confirm Submit Modal */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Submit Test?</h2>
                            <p className="text-gray-600">
                                Are you sure you want to submit? You cannot change your answers after submission.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-green-600">{answeredCount}</p>
                                    <p className="text-xs text-gray-500">Answered</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-red-600">{questions.length - answeredCount}</p>
                                    <p className="text-xs text-gray-500">Unanswered</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-purple-600">{markedCount}</p>
                                    <p className="text-xs text-gray-500">Marked</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirmSubmit(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Review Again
                            </button>
                            <button
                                onClick={() => submitTest(false)}
                                disabled={submitting}
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Now"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}