"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    ArrowLeft, CheckCircle, XCircle, Clock, FileText,
    Sparkles, AlertCircle, Edit, Trash2
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
    status: string;
    generated_at: string;
    approval_deadline: string | null;
    test_date: string;
}

export default function PreviewDailyTestPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const [test, setTest] = useState<Test | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAnswers, setShowAnswers] = useState(false);

    useEffect(() => {
        fetchTest();
    }, [params.id]);

    async function fetchTest() {
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

        setTest(testData);
        setQuestions(questionsData || []);
        setLoading(false);
    }

    async function approveTest() {
        const { error } = await supabase
            .from("generated_daily_tests")
            .update({
                status: "published",
                approved_at: new Date().toISOString(),
                published_at: new Date().toISOString()
            })
            .eq("id", params.id);

        if (!error) {
            alert("✅ Test approved and published!");
            router.push("/admin/daily-tests");
        }
    }

    async function rejectTest() {
        if (!confirm("Are you sure you want to reject this test?")) return;

        const { error } = await supabase
            .from("generated_daily_tests")
            .update({ status: "rejected" })
            .eq("id", params.id);

        if (!error) {
            router.push("/admin/daily-tests");
        }
    }

    async function deleteTest() {
        if (!confirm("Are you sure you want to delete this test? This cannot be undone.")) return;

        await supabase.from("generated_daily_questions").delete().eq("daily_test_id", params.id);
        await supabase.from("generated_daily_tests").delete().eq("id", params.id);

        router.push("/admin/daily-tests");
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

    const statusColors: Record<string, string> = {
        "pending_approval": "bg-yellow-100 text-yellow-700",
        "approved": "bg-blue-100 text-blue-700",
        "published": "bg-green-100 text-green-700",
        "rejected": "bg-red-100 text-red-700",
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/daily-tests"
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="text-yellow-500" />
                            Preview Test
                        </h1>
                        <p className="text-gray-500">Review AI-generated questions before publishing</p>
                    </div>
                </div>
                <button
                    onClick={deleteTest}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete Test"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Test Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{test.title}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                {test.exam_category}
                            </span>
                            <span className="text-sm text-gray-500">{test.subject}</span>
                            <span className={`text-sm px-2 py-0.5 rounded ${test.difficulty === "easy" ? "bg-green-100 text-green-700" :
                                    test.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                                }`}>
                                {test.difficulty}
                            </span>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[test.status]}`}>
                        {test.status.replace("_", " ")}
                    </span>
                </div>

                <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <FileText size={16} />
                        {questions.length} Questions
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {test.duration_minutes} minutes
                    </span>
                    <span>
                        Generated: {new Date(test.generated_at).toLocaleString("en-IN")}
                    </span>
                </div>

                {test.status === "pending_approval" && test.approval_deadline && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="text-yellow-600" size={18} />
                        <span className="text-sm text-yellow-700">
                            Auto-publish at: {new Date(test.approval_deadline).toLocaleString("en-IN")}
                        </span>
                    </div>
                )}

                {/* Action Buttons */}
                {test.status === "pending_approval" && (
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={approveTest}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                            <CheckCircle size={18} />
                            Approve & Publish
                        </button>
                        <button
                            onClick={rejectTest}
                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            <XCircle size={18} />
                            Reject
                        </button>
                    </div>
                )}
            </div>

            {/* Toggle Answers */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${showAnswers
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {showAnswers ? "Hide Answers" : "Show Answers"}
                </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {questions.map((question, index) => (
                    <div key={question.id} className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900 font-medium mb-4">{question.question_text}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {["A", "B", "C", "D"].map((option) => {
                                        const optionKey = `option_${option.toLowerCase()}` as keyof Question;
                                        const isCorrect = question.correct_option === option;

                                        return (
                                            <div
                                                key={option}
                                                className={`p-3 rounded-lg border ${showAnswers && isCorrect
                                                        ? "bg-green-50 border-green-300"
                                                        : "bg-gray-50 border-gray-200"
                                                    }`}
                                            >
                                                <span className={`font-medium ${showAnswers && isCorrect ? "text-green-700" : "text-gray-700"
                                                    }`}>
                                                    {option}.
                                                </span>{" "}
                                                <span className={showAnswers && isCorrect ? "text-green-700" : "text-gray-600"}>
                                                    {question[optionKey]}
                                                </span>
                                                {showAnswers && isCorrect && (
                                                    <CheckCircle className="inline ml-2 text-green-500" size={16} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {showAnswers && question.explanation && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-700">
                                            <strong>Explanation:</strong> {question.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Actions */}
            {test.status === "pending_approval" && (
                <div className="sticky bottom-4 mt-6">
                    <div className="bg-white rounded-xl shadow-lg border p-4 flex items-center justify-between">
                        <p className="text-gray-600">
                            Review complete? Take action on this test.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={rejectTest}
                                className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                            >
                                <XCircle size={18} />
                                Reject
                            </button>
                            <button
                                onClick={approveTest}
                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                <CheckCircle size={18} />
                                Approve & Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
