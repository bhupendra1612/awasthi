"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    X,
    Clock,
    FileText,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Flag
} from "lucide-react";

interface Question {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    explanation?: string;
}

interface Test {
    id: string;
    title: string;
    exam_category?: string;
    subject: string;
    difficulty?: string;
    questions_count?: number;
    total_questions?: number;
    duration_minutes: number;
    test_date?: string;
    questions: Question[];
    type: 'daily' | 'regular';
}

interface TestAttempt {
    id: string;
    score: number;
    total_questions: number;
    time_taken: number;
    time_taken_seconds?: number;
    completed_at: string;
    answers: Record<string, string>;
}

interface InDashboardTestProps {
    testId: string;
    testType?: 'daily' | 'regular';
    onClose: () => void;
}

export default function InDashboardTest({ testId, testType = 'daily', onClose }: InDashboardTestProps) {
    const supabase = createClient();
    const [test, setTest] = useState<Test | null>(null);
    const [attempt, setAttempt] = useState<TestAttempt | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        fetchTest();
    }, [testId]);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isSubmitted && test) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted, test]);

    const fetchTest = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.error("No user found");
                return;
            }

            console.log("Fetching test:", testId, "Type:", testType);

            if (testType === 'daily') {
                // Check if user already attempted this daily test
                const { data: existingAttempt } = await supabase
                    .from("daily_test_attempts")
                    .select("*")
                    .eq("user_id", user.id)
                    .eq("daily_test_id", testId)
                    .single();

                console.log("Existing attempt:", existingAttempt);

                if (existingAttempt) {
                    // Map the database columns to expected format
                    setAttempt({
                        ...existingAttempt,
                        time_taken: existingAttempt.time_taken_seconds || existingAttempt.time_taken || 0,
                        time_taken_seconds: existingAttempt.time_taken_seconds || existingAttempt.time_taken || 0
                    });
                    setShowResult(true);
                }

                // Fetch daily test details
                const { data: testData, error: testError } = await supabase
                    .from("generated_daily_tests")
                    .select("*")
                    .eq("id", testId)
                    .single();

                console.log("Test data:", testData);
                console.log("Test error:", testError);

                if (testData) {
                    // Parse questions from JSON format OR fetch from separate table
                    let parsedQuestions = [];
                    console.log("Raw questions:", testData.questions);

                    // First try to get questions from JSON column (demo tests)
                    if (testData.questions && Array.isArray(testData.questions)) {
                        parsedQuestions = testData.questions.map((q: any, index: number) => {
                            console.log("Processing question from JSON:", q);
                            return {
                                id: q.id?.toString() || index.toString(),
                                question_text: q.question || q.question_text || '',
                                option_a: q.options?.[0] || q.option_a || '',
                                option_b: q.options?.[1] || q.option_b || '',
                                option_c: q.options?.[2] || q.option_c || '',
                                option_d: q.options?.[3] || q.option_d || '',
                                correct_answer: typeof q.correct_answer === 'number'
                                    ? ['A', 'B', 'C', 'D'][q.correct_answer]
                                    : q.correct_answer || 'A',
                                explanation: q.explanation || ''
                            };
                        });
                    } else if (typeof testData.questions === 'string') {
                        // Try to parse as JSON string
                        try {
                            const questionsArray = JSON.parse(testData.questions);
                            if (Array.isArray(questionsArray)) {
                                parsedQuestions = questionsArray.map((q: any, index: number) => ({
                                    id: q.id?.toString() || index.toString(),
                                    question_text: q.question || q.question_text || '',
                                    option_a: q.options?.[0] || q.option_a || '',
                                    option_b: q.options?.[1] || q.option_b || '',
                                    option_c: q.options?.[2] || q.option_c || '',
                                    option_d: q.options?.[3] || q.option_d || '',
                                    correct_answer: typeof q.correct_answer === 'number'
                                        ? ['A', 'B', 'C', 'D'][q.correct_answer]
                                        : q.correct_answer || 'A',
                                    explanation: q.explanation || ''
                                }));
                            }
                        } catch (parseError) {
                            console.error("Error parsing questions JSON:", parseError);
                        }
                    }

                    // If no questions found in JSON, fetch from separate table (admin-generated tests)
                    if (parsedQuestions.length === 0) {
                        console.log("No questions in JSON, fetching from generated_daily_questions table");
                        const { data: questionsData, error: questionsError } = await supabase
                            .from("generated_daily_questions")
                            .select("*")
                            .eq("daily_test_id", testId)
                            .order("order_index");

                        console.log("Questions from table:", questionsData);
                        console.log("Questions error:", questionsError);

                        if (questionsData && questionsData.length > 0) {
                            parsedQuestions = questionsData.map((q: any) => ({
                                id: q.id.toString(),
                                question_text: q.question_text || '',
                                option_a: q.option_a || '',
                                option_b: q.option_b || '',
                                option_c: q.option_c || '',
                                option_d: q.option_d || '',
                                correct_answer: q.correct_option || 'A', // Note: correct_option vs correct_answer
                                explanation: q.explanation || ''
                            }));
                        }
                    }

                    console.log("Final parsed questions:", parsedQuestions);

                    setTest({
                        ...testData,
                        type: 'daily',
                        questions: parsedQuestions
                    });
                    if (!existingAttempt) {
                        setTimeLeft(testData.duration_minutes * 60);
                    }
                }
            } else {
                // Handle regular tests
                // Check if user already attempted this test
                const { data: existingAttempt } = await supabase
                    .from("test_attempts")
                    .select("*")
                    .eq("user_id", user.id)
                    .eq("test_id", testId)
                    .single();

                if (existingAttempt) {
                    setAttempt(existingAttempt);
                    setShowResult(true);
                }

                // Fetch regular test details
                const { data: testData } = await supabase
                    .from("tests")
                    .select("*")
                    .eq("id", testId)
                    .single();

                if (testData) {
                    // Fetch questions for regular test
                    const { data: questionsData } = await supabase
                        .from("questions")
                        .select("*")
                        .eq("test_id", testId)
                        .order("order_index");

                    setTest({
                        ...testData,
                        type: 'regular',
                        questions: questionsData || [],
                        questions_count: testData.total_questions
                    });
                    if (!existingAttempt) {
                        setTimeLeft(testData.duration_minutes * 60);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching test:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId: string, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = async () => {
        if (!test || isSubmitted) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Calculate score
            let score = 0;
            test.questions.forEach(question => {
                if (answers[question.id] === question.correct_answer) {
                    score++;
                }
            });

            const timeTaken = (test.duration_minutes * 60) - timeLeft;
            const totalQuestions = test.questions_count || test.total_questions || test.questions.length;

            if (testType === 'daily') {
                // Check if user already has an attempt (due to UNIQUE constraint)
                const { data: existingCheck } = await supabase
                    .from("daily_test_attempts")
                    .select("id")
                    .eq("user_id", user.id)
                    .eq("daily_test_id", testId)
                    .single();

                if (existingCheck) {
                    // Update existing attempt instead of inserting new one
                    const { data: attemptData, error: attemptError } = await supabase
                        .from("daily_test_attempts")
                        .update({
                            score,
                            total_questions: totalQuestions,
                            correct_answers: score,
                            wrong_answers: totalQuestions - score,
                            time_taken_seconds: timeTaken,
                            completed_at: new Date().toISOString(),
                            answers
                        })
                        .eq("user_id", user.id)
                        .eq("daily_test_id", testId)
                        .select()
                        .single();

                    if (attemptError) {
                        console.error("Error updating daily test attempt:", attemptError);
                        console.error("Error details:", JSON.stringify(attemptError, null, 2));
                    } else if (attemptData) {
                        setAttempt({
                            ...attemptData,
                            time_taken: attemptData.time_taken_seconds || attemptData.time_taken || 0,
                            time_taken_seconds: attemptData.time_taken_seconds || attemptData.time_taken || 0
                        });
                    }
                } else {
                    // Save new daily test attempt
                    const { data: attemptData, error: attemptError } = await supabase
                        .from("daily_test_attempts")
                        .insert({
                            user_id: user.id,
                            daily_test_id: testId,
                            score,
                            total_questions: totalQuestions,
                            correct_answers: score,
                            wrong_answers: totalQuestions - score,
                            time_taken_seconds: timeTaken,
                            completed_at: new Date().toISOString(),
                            answers
                        })
                        .select()
                        .single();

                    if (attemptError) {
                        console.error("Error saving daily test attempt:", attemptError);
                        console.error("Error details:", JSON.stringify(attemptError, null, 2));
                    } else if (attemptData) {
                        setAttempt({
                            ...attemptData,
                            time_taken: attemptData.time_taken_seconds || attemptData.time_taken || 0,
                            time_taken_seconds: attemptData.time_taken_seconds || attemptData.time_taken || 0
                        });
                    }
                }

                // Always show results, even if database save fails
                if (!attempt) {
                    setAttempt({
                        id: 'temp-' + Date.now(),
                        score,
                        total_questions: totalQuestions,
                        time_taken: timeTaken,
                        time_taken_seconds: timeTaken,
                        completed_at: new Date().toISOString(),
                        answers
                    });
                }
            } else {
                // Save regular test attempt
                const { data: attemptData, error: attemptError } = await supabase
                    .from("test_attempts")
                    .insert({
                        user_id: user.id,
                        test_id: testId,
                        score,
                        total_questions: totalQuestions,
                        time_taken: timeTaken,
                        answers
                    })
                    .select()
                    .single();

                if (attemptError) {
                    console.error("Error saving regular test attempt:", attemptError);
                    console.error("Error details:", JSON.stringify(attemptError, null, 2));
                    // Still show results even if saving fails
                    setAttempt({
                        id: 'temp-' + Date.now(),
                        score,
                        total_questions: totalQuestions,
                        time_taken: timeTaken,
                        completed_at: new Date().toISOString(),
                        answers
                    });
                } else if (attemptData) {
                    setAttempt(attemptData);
                }
            }

            setIsSubmitted(true);
            setShowResult(true);
        } catch (error) {
            console.error("Error submitting test:", error);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-center mt-4 text-gray-600">Loading test...</p>
                </div>
            </div>
        );
    }

    if (!test || !test.questions || test.questions.length === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 text-center">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {!test ? "Test not found" : "No questions available"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {!test
                            ? "The test you're looking for doesn't exist."
                            : "This test has no questions available."
                        }
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (showResult && attempt) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Test Results</h2>
                            <p className="text-sm text-gray-600">
                                {test.subject} {test.exam_category && `• ${test.exam_category}`}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Score Summary */}
                    <div className="p-6 bg-gray-50">
                        <div className="text-center">
                            <div className={`text-4xl font-bold mb-2 ${getScoreColor(attempt.score, attempt.total_questions)}`}>
                                {attempt.score}/{attempt.total_questions}
                            </div>
                            <p className="text-gray-600 mb-4">
                                {Math.round((attempt.score / attempt.total_questions) * 100)}% Score
                            </p>
                            <div className="flex justify-center space-x-6 text-sm">
                                <div className="text-center">
                                    <p className="font-medium text-gray-900">{formatTime(attempt.time_taken_seconds || attempt.time_taken || 0)}</p>
                                    <p className="text-gray-500">Time Taken</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-green-600">{attempt.score}</p>
                                    <p className="text-gray-500">Correct</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-red-600">{attempt.total_questions - attempt.score}</p>
                                    <p className="text-gray-500">Incorrect</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions Review */}
                    <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Question Review</h3>
                        <div className="space-y-4">
                            {test.questions.map((question, index) => {
                                const userAnswer = attempt.answers[question.id];
                                const isCorrect = userAnswer === question.correct_answer;

                                return (
                                    <div key={question.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-gray-900">
                                                Q{index + 1}. {question.question_text}
                                            </h4>
                                            {isCorrect ? (
                                                <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                                            ) : (
                                                <X className="text-red-500 flex-shrink-0" size={20} />
                                            )}
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            {[
                                                { key: 'A', value: question.option_a },
                                                { key: 'B', value: question.option_b },
                                                { key: 'C', value: question.option_c },
                                                { key: 'D', value: question.option_d }
                                            ].map(option => (
                                                <div
                                                    key={option.key}
                                                    className={`p-2 rounded ${option.key === question.correct_answer
                                                        ? 'bg-green-100 text-green-800'
                                                        : option.key === userAnswer && userAnswer !== question.correct_answer
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="font-medium">{option.key}.</span> {option.value}
                                                    {option.key === question.correct_answer && (
                                                        <span className="ml-2 text-green-600">✓ Correct</span>
                                                    )}
                                                    {option.key === userAnswer && userAnswer !== question.correct_answer && (
                                                        <span className="ml-2 text-red-600">✗ Your answer</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {question.explanation && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                                                <p className="font-medium text-blue-900 mb-1">Explanation:</p>
                                                <p className="text-blue-800">{question.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">{test.subject}</h2>
                    <p className="text-sm text-gray-600">
                        {test.exam_category && `${test.exam_category} • `}{test.difficulty || 'Test'}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span className={timeLeft < 300 ? "text-red-600 font-bold" : ""}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileText size={16} />
                        <span>{currentQuestion + 1}/{test.questions.length}</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 h-1">
                <div
                    className="bg-primary-600 h-1 transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
                />
            </div>

            {/* Question Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl mx-auto">
                    {test.questions[currentQuestion] ? (
                        <div>
                            <h3 className="text-xl font-medium text-gray-900 mb-6">
                                Q{currentQuestion + 1}. {test.questions[currentQuestion].question_text}
                            </h3>

                            <div className="space-y-3">
                                {[
                                    { key: 'A', value: test.questions[currentQuestion].option_a },
                                    { key: 'B', value: test.questions[currentQuestion].option_b },
                                    { key: 'C', value: test.questions[currentQuestion].option_c },
                                    { key: 'D', value: test.questions[currentQuestion].option_d }
                                ].map(option => (
                                    <button
                                        key={option.key}
                                        onClick={() => handleAnswerSelect(test.questions[currentQuestion].id, option.key)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[test.questions[currentQuestion].id] === option.key
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="font-medium text-primary-600">{option.key}.</span>
                                        <span className="ml-2">{option.value}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Question not found</h3>
                            <p className="text-gray-600">Unable to load the current question.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-t px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowLeft size={16} />
                    <span>Previous</span>
                </button>

                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                        Answered: {Object.keys(answers).length}/{test.questions.length}
                    </div>

                    {currentQuestion === test.questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            <Flag size={16} />
                            <span>Submit Test</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestion(Math.min(test.questions.length - 1, currentQuestion + 1))}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            <span>Next</span>
                            <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}