"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Edit, Eye, CheckCircle, XCircle, Loader2, FileText, Clock, IndianRupee, Users } from "lucide-react";
import Link from "next/link";

interface Test {
    id: string;
    title: string;
    description: string;
    category: string;
    subject: string;
    duration_minutes: number;
    total_questions: number;
    total_marks: number;
    passing_marks: number;
    negative_marks: number;
    is_free: boolean;
    price: number;
    is_published: boolean;
    is_featured: boolean;
    thumbnail_url: string;
    instructions: string;
    created_at: string;
}

interface Question {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    explanation: string;
    marks: number;
    difficulty: string;
}

export default function TeacherTestPreviewPage() {
    const router = useRouter();
    const params = useParams();
    const testId = params.id as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [test, setTest] = useState<Test | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showAllQuestions, setShowAllQuestions] = useState(false);

    useEffect(() => {
        fetchTestData();
    }, [testId]);

    async function fetchTestData() {
        try {
            const { data: testData } = await supabase
                .from("tests")
                .select("*")
                .eq("id", testId)
                .single();

            const { data: questionsData } = await supabase
                .from("questions")
                .select("*")
                .eq("test_id", testId)
                .order("order_index", { ascending: true });

            setTest(testData);
            setQuestions(questionsData || []);
        } catch (error) {
            console.error("Error fetching test:", error);
        } finally {
            setLoading(false);
        }
    }

    async function togglePublish() {
        if (!test) return;

        if (!test.is_published && questions.length === 0) {
            alert("Cannot publish test without questions!");
            return;
        }

        setPublishing(true);
        try {
            const { error } = await supabase
                .from("tests")
                .update({ is_published: !test.is_published })
                .eq("id", testId);

            if (error) throw error;

            setTest({ ...test, is_published: !test.is_published });
            alert(test.is_published ? "✅ Test unpublished!" : "✅ Test published successfully!");
        } catch (error: any) {
            alert(`❌ Error: ${error.message}`);
        } finally {
            setPublishing(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    if (!test) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Test not found</p>
            </div>
        );
    }

    const displayQuestions = showAllQuestions ? questions : questions.slice(0, 3);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/teacher/tests" className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Test Preview</h1>
                        <p className="text-gray-500 mt-1">Review and publish test</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/teacher/tests/${testId}/questions`}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Edit size={18} />
                        Edit Questions
                    </Link>
                    <button
                        onClick={togglePublish}
                        disabled={publishing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${test.is_published
                                ? "bg-gray-600 hover:bg-gray-700 text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                    >
                        {publishing ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : test.is_published ? (
                            <XCircle size={18} />
                        ) : (
                            <CheckCircle size={18} />
                        )}
                        {test.is_published ? "Unpublish" : "Publish Test"}
                    </button>
                </div>
            </div>

            {/* Status Banner */}
            <div className={`rounded-lg p-4 ${test.is_published
                    ? "bg-green-50 border border-green-200"
                    : "bg-yellow-50 border border-yellow-200"
                }`}>
                <div className="flex items-center gap-3">
                    {test.is_published ? (
                        <CheckCircle className="text-green-600" size={24} />
                    ) : (
                        <Eye className="text-yellow-600" size={24} />
                    )}
                    <div>
                        <p className={`font-semibold ${test.is_published ? "text-green-800" : "text-yellow-800"
                            }`}>
                            {test.is_published ? "Test is Published" : "Test is in Draft"}
                        </p>
                        <p className={`text-sm ${test.is_published ? "text-green-600" : "text-yellow-600"
                            }`}>
                            {test.is_published
                                ? "Students can see and attempt this test"
                                : "Only you can see this test. Publish to make it visible to students"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Teacher Power Notice */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                    <strong>Teacher Power:</strong> You can publish tests directly without admin approval.
                    Make sure all questions are correct before publishing.
                </p>
            </div>

            {/* Test Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                            <p className="text-sm text-gray-500">Questions</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{test.duration_minutes}</p>
                            <p className="text-sm text-gray-500">Minutes</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{test.total_marks}</p>
                            <p className="text-sm text-gray-500">Total Marks</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <IndianRupee className="text-orange-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {test.is_free ? "Free" : `₹${test.price}`}
                            </p>
                            <p className="text-sm text-gray-500">Price</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{test.title}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium text-gray-900">{test.category}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Subject</p>
                        <p className="font-medium text-gray-900">{test.subject}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Passing Marks</p>
                        <p className="font-medium text-gray-900">{test.passing_marks}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Negative Marking</p>
                        <p className="font-medium text-gray-900">{test.negative_marks} marks</p>
                    </div>
                </div>
                {test.description && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Description</p>
                        <p className="text-gray-700">{test.description}</p>
                    </div>
                )}
                {test.instructions && (
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Instructions</p>
                        <p className="text-gray-700 whitespace-pre-line">{test.instructions}</p>
                    </div>
                )}
            </div>

            {/* Questions Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Questions Preview</h2>
                    <Link
                        href={`/teacher/tests/${testId}/questions`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Manage Questions →
                    </Link>
                </div>

                {questions.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 mb-4">No questions added yet</p>
                        <Link
                            href={`/teacher/tests/${testId}/questions`}
                            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                        >
                            Add Questions
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayQuestions.map((question, index) => (
                            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                        Q{index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 mb-3">{question.question_text}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { key: "A", value: question.option_a },
                                                { key: "B", value: question.option_b },
                                                { key: "C", value: question.option_c },
                                                { key: "D", value: question.option_d }
                                            ].map((opt) => opt.value && (
                                                <div
                                                    key={opt.key}
                                                    className={`p-2 rounded-lg border text-sm ${question.correct_option === opt.key
                                                            ? "bg-green-50 border-green-300 font-medium"
                                                            : "bg-gray-50 border-gray-200"
                                                        }`}
                                                >
                                                    <span className="font-semibold">{opt.key}.</span> {opt.value}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                            {question.marks}m
                                        </span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                                            {question.difficulty}
                                        </span>
                                    </div>
                                </div>
                                {question.explanation && (
                                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-gray-700">
                                        <strong>Explanation:</strong> {question.explanation}
                                    </div>
                                )}
                            </div>
                        ))}

                        {questions.length > 3 && (
                            <button
                                onClick={() => setShowAllQuestions(!showAllQuestions)}
                                className="w-full py-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                            >
                                {showAllQuestions
                                    ? "Show Less"
                                    : `Show All ${questions.length} Questions`}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Publish Checklist */}
            {!test.is_published && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="font-semibold text-purple-900 mb-3">Pre-Publish Checklist</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            {test.title ? (
                                <CheckCircle className="text-green-600" size={18} />
                            ) : (
                                <XCircle className="text-red-600" size={18} />
                            )}
                            <span className="text-sm text-purple-800">Test title added</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {questions.length > 0 ? (
                                <CheckCircle className="text-green-600" size={18} />
                            ) : (
                                <XCircle className="text-red-600" size={18} />
                            )}
                            <span className="text-sm text-purple-800">Questions added ({questions.length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {test.category && test.subject ? (
                                <CheckCircle className="text-green-600" size={18} />
                            ) : (
                                <XCircle className="text-red-600" size={18} />
                            )}
                            <span className="text-sm text-purple-800">Category and subject set</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {test.duration_minutes > 0 ? (
                                <CheckCircle className="text-green-600" size={18} />
                            ) : (
                                <XCircle className="text-red-600" size={18} />
                            )}
                            <span className="text-sm text-purple-800">Duration configured</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
