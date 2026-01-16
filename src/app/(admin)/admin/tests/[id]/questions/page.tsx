"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    ArrowLeft,
    Plus,
    Save,
    Trash2,
    Edit,
    Loader2,
    AlertCircle,
    CheckCircle,
    GripVertical,
    Image as ImageIcon,
} from "lucide-react";

interface Question {
    id: string;
    question_text: string;
    question_image?: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    explanation?: string;
    marks: number;
    negative_marks: number;
    difficulty: string;
    topic?: string;
    order_index: number;
}

interface Test {
    id: string;
    title: string;
    category: string;
    subject: string;
    marks_per_question: number;
    negative_marks: number;
    total_questions: number;
}

export default function ManageQuestionsPage() {
    const params = useParams();
    const testId = params?.id as string;
    const router = useRouter();

    console.log("Questions page - testId:", testId, "params:", params);
    const supabase = createClient();

    const [test, setTest] = useState<Test | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form state for adding/editing question
    const [showForm, setShowForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [formData, setFormData] = useState({
        question_text: "",
        question_image: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
        explanation: "",
        difficulty: "medium",
        topic: "",
    });

    useEffect(() => {
        if (testId) {
            fetchTestAndQuestions();
        }
    }, [testId]);

    async function fetchTestAndQuestions() {
        try {
            // Fetch test details
            const { data: testData, error: testError } = await supabase
                .from("tests")
                .select("*")
                .eq("id", testId)
                .single();

            if (testError) throw testError;
            setTest(testData);

            // Fetch questions
            const { data: questionsData, error: questionsError } = await supabase
                .from("questions")
                .select("*")
                .eq("test_id", testId)
                .order("order_index", { ascending: true });

            if (questionsError) throw questionsError;
            setQuestions(questionsData || []);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load test data");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setFormData({
            question_text: "",
            question_image: "",
            option_a: "",
            option_b: "",
            option_c: "",
            option_d: "",
            correct_option: "A",
            explanation: "",
            difficulty: "medium",
            topic: "",
        });
        setEditingQuestion(null);
        setShowForm(false);
    }

    function editQuestion(question: Question) {
        setFormData({
            question_text: question.question_text,
            question_image: question.question_image || "",
            option_a: question.option_a,
            option_b: question.option_b,
            option_c: question.option_c || "",
            option_d: question.option_d || "",
            correct_option: question.correct_option,
            explanation: question.explanation || "",
            difficulty: question.difficulty,
            topic: question.topic || "",
        });
        setEditingQuestion(question);
        setShowForm(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const questionData = {
                test_id: testId,
                question_text: formData.question_text.trim(),
                question_image: formData.question_image || null,
                option_a: formData.option_a.trim(),
                option_b: formData.option_b.trim(),
                option_c: formData.option_c.trim() || null,
                option_d: formData.option_d.trim() || null,
                correct_option: formData.correct_option,
                explanation: formData.explanation.trim() || null,
                marks: test?.marks_per_question || 1,
                negative_marks: test?.negative_marks || 0,
                difficulty: formData.difficulty,
                topic: formData.topic.trim() || null,
                order_index: editingQuestion ? editingQuestion.order_index : questions.length,
            };

            if (editingQuestion) {
                // Update existing question
                const { error } = await supabase
                    .from("questions")
                    .update(questionData)
                    .eq("id", editingQuestion.id);

                if (error) throw error;
                setSuccess("Question updated successfully!");
            } else {
                // Add new question
                const { error } = await supabase
                    .from("questions")
                    .insert(questionData);

                if (error) throw error;
                setSuccess("Question added successfully!");
            }

            resetForm();
            fetchTestAndQuestions();
        } catch (err) {
            console.error("Error saving question:", err);
            setError(err instanceof Error ? err.message : "Failed to save question");
        } finally {
            setSaving(false);
        }
    }

    async function deleteQuestion(id: string) {
        if (!confirm("Are you sure you want to delete this question?")) return;

        try {
            const { error } = await supabase.from("questions").delete().eq("id", id);
            if (error) throw error;
            setQuestions(questions.filter((q) => q.id !== id));
            setSuccess("Question deleted");
        } catch (err) {
            console.error("Error deleting question:", err);
            setError("Failed to delete question");
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
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-900">Test not found</h2>
                <Link href="/admin/tests" className="text-primary-600 hover:underline mt-4 inline-block">
                    Back to Tests
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/tests" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2">
                        <ArrowLeft size={18} /> Back to Tests
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
                    <p className="text-gray-500">
                        {test.category} • {test.subject} • {questions.length} Questions
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 transition font-medium"
                >
                    <Plus size={20} />
                    Add Question
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle size={18} />
                    {success}
                </div>
            )}

            {/* Question Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingQuestion ? "Edit Question" : "Add New Question"}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Question Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Question Text *
                                </label>
                                <textarea
                                    value={formData.question_text}
                                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="Enter your question here..."
                                    required
                                />
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["A", "B", "C", "D"].map((opt) => (
                                    <div key={opt} className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Option {opt} {opt === "A" || opt === "B" ? "*" : ""}
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={formData[`option_${opt.toLowerCase()}` as keyof typeof formData] as string}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        [`option_${opt.toLowerCase()}`]: e.target.value,
                                                    })
                                                }
                                                className={`flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${formData.correct_option === opt
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-200"
                                                    }`}
                                                placeholder={`Option ${opt}`}
                                                required={opt === "A" || opt === "B"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, correct_option: opt })}
                                                className={`px-3 py-2 rounded-lg border ${formData.correct_option === opt
                                                    ? "bg-green-500 text-white border-green-500"
                                                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                                    }`}
                                                title="Mark as correct"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Explanation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Explanation (Solution)
                                </label>
                                <textarea
                                    value={formData.explanation}
                                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="Explain the correct answer..."
                                />
                            </div>

                            {/* Difficulty & Topic */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="e.g., Indian History"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            {editingQuestion ? "Update Question" : "Add Question"}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Questions List */}
            {questions.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                    <p className="text-gray-500 mb-4">Start adding questions to this test</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                        <Plus size={18} />
                        Add First Question
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <GripVertical size={20} />
                                    <span className="font-bold text-lg text-gray-600">Q{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium mb-4">{question.question_text}</p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {["A", "B", "C", "D"].map((opt) => {
                                            const optionValue = question[`option_${opt.toLowerCase()}` as keyof Question] as string;
                                            if (!optionValue) return null;
                                            const isCorrect = question.correct_option === opt;
                                            return (
                                                <div
                                                    key={opt}
                                                    className={`px-3 py-2 rounded-lg ${isCorrect
                                                        ? "bg-green-100 text-green-800 border border-green-200"
                                                        : "bg-gray-50 text-gray-700"
                                                        }`}
                                                >
                                                    <span className="font-medium">{opt}.</span> {optionValue}
                                                    {isCorrect && <CheckCircle className="inline ml-2" size={14} />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {question.explanation && (
                                        <p className="mt-3 text-sm text-gray-500 bg-blue-50 p-2 rounded">
                                            <strong>Explanation:</strong> {question.explanation}
                                        </p>
                                    )}
                                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                        <span className={`px-2 py-1 rounded ${question.difficulty === "easy" ? "bg-green-100 text-green-700" :
                                            question.difficulty === "hard" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {question.difficulty}
                                        </span>
                                        {question.topic && <span>Topic: {question.topic}</span>}
                                        <span>Marks: {question.marks}</span>
                                        {question.negative_marks > 0 && (
                                            <span className="text-red-600">-{question.negative_marks}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => editQuestion(question)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteQuestion(question.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Actions */}
            {questions.length > 0 && (
                <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-gray-600">
                        Total: <strong>{questions.length}</strong> questions •
                        Total Marks: <strong>{questions.reduce((sum, q) => sum + q.marks, 0)}</strong>
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                        >
                            <Plus size={18} />
                            Add More Questions
                        </button>
                        <Link
                            href="/admin/tests"
                            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                        >
                            Done
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}