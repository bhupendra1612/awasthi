"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    ArrowLeft, Clock, CheckCircle, XCircle, Play,
    ChevronLeft, ChevronRight, Flag, Sparkles
} from "lucide-react";
import Link from "next/link";

interface Question {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    explanation: string;
    order_index: number;
}

interface Test {
    id: string;
    title: string;
    exam_category: string;
    subject: string;
    difficulty: string;
    questions_count: number;
    duration_minutes: number;
    test_date: string;
}

interface Attempt {
    id: string;
    score: number;
    correct_answers: number;
    wrong_answers: number;
    completed_at: string;
    answers: Record<string, string>;
}

export default function DailyPracticeTestPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [test, setTest] = useState<Test | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [existingAttempt, setExistingAttempt] = useState<Attempt | null>(null);
    const [loading, setLoading] = useState(true);

    // Test state
    const [started, setStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 });

    useEffect(() => {
        fetchTest();
    }, [params.id]);

    useEffect(() => {
        if (started && timeLeft > 0 && !submitted) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [started, timeLeft, submitted]);

    async function fetchTest() {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: testData } = await supabase
            .from("generated_daily_tests")
            .select("*")
            .eq("id", params.id)
            .single();

        const { data: questionsData } = await supabase
            .from("generated_daily_questions")
            .select("*")
            .eq("daily_test_id", params.id)
            .order("order_index");

        // Check for existing attempt
        const { data: attemptData } = await supabase
            .from("daily_test_attempts")
            .select("*")
            .eq("daily_test_id", params.id)
            .eq("user_id", user?.id)
            .single();

        setTest(testData);
        setQuestions(questionsData || []);
        setExistingAttempt(attemptData);

        if (testData) {
            setTimeLeft(testData.duration_minutes * 60);
        }

        if (attemptData?.completed_at) {
            setSubmitted(true);
            setShowResults(true);
            setAnswers(attemptData.answers || {});
            setScore({
                correct: attemptData.correct_answers,
                wrong: attemptData.wrong_answers,
                total: questionsData?.length || 0
            });
        }

        setLoading(false);
    }

    function startTest() {
        setStarted(true);
    }

    function selectAnswer(questionId: string, option: string) {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    }

    async function handleSubmit() {
        if (submitted) return;
        setSubmitted(true);

        // Calculate score
        let correct = 0;
        let wrong = 0;

        questions.forEach(q => {
            const userAnswer = answers[q.id];
            if (userAnswer) {
                if (userAnswer === q.correct_option) {
                    correct++;
                } else {
                    wrong++;
                }
            }
        });

        setScore({ correct, wrong, total: questions.length });
        setShowResults(true);

        // Save attempt
        const { data: { user } } = await supabase.auth.getUser();

        await supabase.from("daily_test_attempts").upsert({
            user_id: user?.id,
            daily_test_id: params.id,
            score: correct,
            total_questions: questions.length,
            correct_answers: correct,
            wrong_answers: wrong,
            time_taken_seconds: (test?.duration_minutes || 10) * 60 - timeLeft,
            answers: answers,
            completed_at: new Date().toISOString()
        }, {
            onConflict: "user_id,daily_test_id"
        });
    }

    function formatTime(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Test not found</p>
            </div>
        );
    }

    // Show results view
    if (showResults) {
        const percentage = Math.round((score.correct / score.total) * 100);

        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Result Header */}
                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6 text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${percentage >= 70 ? "bg-green-100" : percentage >= 40 ? "bg-yellow-100" : "bg-red-100"
                        }`}>
                        <span className={`text-3xl font-bold ${percentage >= 70 ? "text-green-600" : percentage >= 40 ? "text-yellow-600" : "text-red-600"
                            }`}>
                            {percentage}%
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {percentage >= 70 ? "Excellent! 🎉" : percentage >= 40 ? "Good Effort! 👍" : "Keep Practicing! 💪"}
                    </h1>
                    <p className="text-gray-500 mb-4">{test.title}</p>

                    <div className="flex justify-center gap-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{score.correct}</p>
                            <p className="text-sm text-gray-500">Correct</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-red-600">{score.wrong}</p>
                            <p className="text-sm text-gray-500">Wrong</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-400">{score.total - score.correct - score.wrong}</p>
                            <p className="text-sm text-gray-500">Skipped</p>
                        </div>
                    </div>
                </div>

                {/* Questions Review */}
                <h2 className="text-lg font-bold text-gray-900 mb-4">Review Answers</h2>
                <div className="space-y-4">
                    {questions.map((question, index) => {
                        const userAnswer = answers[question.id];
                        const isCorrect = userAnswer === question.correct_option;
                        const isWrong = userAnswer && !isCorrect;

                        return (
                            <div key={question.id} className="bg-white rounded-xl shadow-sm border p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? "bg-green-100 text-green-600" :
                                            isWrong ? "bg-red-100 text-red-600" :
                                                "bg-gray-100 text-gray-600"
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-900 font-medium">{question.question_text}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-11">
                                    {["A", "B", "C", "D"].map((option) => {
                                        const optionKey = `option_${option.toLowerCase()}` as keyof Question;
                                        const isThisCorrect = question.correct_option === option;
                                        const isUserAnswer = userAnswer === option;

                                        return (
                                            <div
                                                key={option}
                                                className={`p-3 rounded-lg border ${isThisCorrect
                                                        ? "bg-green-50 border-green-300"
                                                        : isUserAnswer && !isThisCorrect
                                                            ? "bg-red-50 border-red-300"
                                                            : "bg-gray-50 border-gray-200"
                                                    }`}
                                            >
                                                <span className="font-medium">{option}.</span>{" "}
                                                {question[optionKey]}
                                                {isThisCorrect && <CheckCircle className="inline ml-2 text-green-500" size={16} />}
                                                {isUserAnswer && !isThisCorrect && <XCircle className="inline ml-2 text-red-500" size={16} />}
                                            </div>
                                        );
                                    })}
                                </div>

                                {question.explanation && (
                                    <div className="mt-3 ml-11 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-700">
                                            <strong>Explanation:</strong> {question.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/daily-practice"
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition"
                    >
                        <ArrowLeft size={18} />
                        Back to Daily Practice
                    </Link>
                </div>
            </div>
        );
    }

    // Show start screen
    if (!started) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <Link
                    href="/daily-practice"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Daily Practice
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="text-white" size={40} />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{test.title}</h1>
                    <p className="text-gray-500 mb-6">{test.subject} • {test.exam_category}</p>

                    <div className="flex justify-center gap-6 mb-8">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                            <p className="text-sm text-gray-500">Questions</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{test.duration_minutes}</p>
                            <p className="text-sm text-gray-500">Minutes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">FREE</p>
                            <p className="text-sm text-gray-500">Price</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-medium text-yellow-800 mb-2">Instructions:</h3>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Each question has 4 options with only one correct answer</li>
                            <li>• You can navigate between questions using Previous/Next buttons</li>
                            <li>• Test will auto-submit when time runs out</li>
                            <li>• You can review all answers after submission</li>
                        </ul>
                    </div>

                    <button
                        onClick={startTest}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition text-lg font-medium"
                    >
                        <Play size={20} />
                        Start Test
                    </button>
                </div>
            </div>
        );
    }

    // Test in progress
    const question = questions[currentQuestion];

    return (
        <div className="max-w-4xl mx-auto px-4 py-4">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-4 flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-gray-900">{test.title}</h1>
                    <p className="text-sm text-gray-500">{test.subject}</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 60 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                    }`}>
                    <Clock size={18} />
                    <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Question Navigation */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
                <div className="flex flex-wrap gap-2">
                    {questions.map((q, index) => (
                        <button
                            key={q.id}
                            onClick={() => setCurrentQuestion(index)}
                            className={`w-10 h-10 rounded-lg font-medium transition ${currentQuestion === index
                                    ? "bg-primary-600 text-white"
                                    : answers[q.id]
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                        Question {currentQuestion + 1} of {questions.length}
                    </span>
                </div>

                <p className="text-lg text-gray-900 font-medium mb-6">{question.question_text}</p>

                <div className="space-y-3">
                    {["A", "B", "C", "D"].map((option) => {
                        const optionKey = `option_${option.toLowerCase()}` as keyof Question;
                        const isSelected = answers[question.id] === option;

                        return (
                            <button
                                key={option}
                                onClick={() => selectAnswer(question.id, option)}
                                className={`w-full p-4 rounded-xl border text-left transition ${isSelected
                                        ? "bg-primary-50 border-primary-500 ring-2 ring-primary-500"
                                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                    }`}
                            >
                                <span className={`font-bold mr-2 ${isSelected ? "text-primary-600" : "text-gray-500"}`}>
                                    {option}.
                                </span>
                                <span className={isSelected ? "text-primary-700" : "text-gray-700"}>
                                    {question[optionKey]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={18} />
                    Previous
                </button>

                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
                    <Flag size={18} />
                    Submit Test
                </button>

                <button
                    onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestion === questions.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
