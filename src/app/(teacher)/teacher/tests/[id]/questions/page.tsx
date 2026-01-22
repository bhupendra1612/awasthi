"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Loader2, Sparkles } from "lucide-react";
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
    marks: number;
    difficulty: string;
    topic: string;
    order_index: number;
}

interface Test {
    id: string;
    title: string;
    category: string;
    subject: string;
    total_questions: number;
}

export default function TeacherManageQuestionsPage() {
    const router = useRouter();
    const params = useParams();
    const testId = params.id as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [test, setTest] = useState<Test | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [addingNew, setAddingNew] = useState(false);
    const [generatingAI, setGeneratingAI] = useState(false);

    const [formData, setFormData] = useState({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
        explanation: "",
        marks: 1,
        difficulty: "medium",
        topic: ""
    });

    useEffect(() => {
        fetchTestAndQuestions();
    }, [testId]);

    async function fetchTestAndQuestions() {
        try {
            const { data: testData } = await supabase
                .from("tests")
                .select("id, title, category, subject, total_questions")
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
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    function startEdit(question: Question) {
        setEditingId(question.id);
        setFormData({
            question_text: question.question_text,
            option_a: question.option_a,
            option_b: question.option_b,
            option_c: question.option_c,
            option_d: question.option_d,
            correct_option: question.correct_option,
            explanation: question.explanation,
            marks: question.marks,
            difficulty: question.difficulty,
            topic: question.topic
        });
        setAddingNew(false);
    }

    function startAddNew() {
        setAddingNew(true);
        setEditingId(null);
        setFormData({
            question_text: "",
            option_a: "",
            option_b: "",
            option_c: "",
            option_d: "",
            correct_option: "A",
            explanation: "",
            marks: 1,
            difficulty: "medium",
            topic: ""
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setAddingNew(false);
    }

    async function saveQuestion() {
        if (!formData.question_text || !formData.option_a || !formData.option_b) {
            alert("Please fill in question and at least 2 options");
            return;
        }

        setSaving(true);
        try {
            if (editingId) {
                // Update existing
                const { error } = await supabase
                    .from("questions")
                    .update(formData)
                    .eq("id", editingId);

                if (error) throw error;
                alert("✅ Question updated!");
            } else {
                // Add new
                const { error } = await supabase
                    .from("questions")
                    .insert({
                        ...formData,
                        test_id: testId,
                        order_index: questions.length
                    });

                if (error) throw error;
                alert("✅ Question added!");
            }

            await fetchTestAndQuestions();
            cancelEdit();
        } catch (error: any) {
            console.error("Save error:", error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setSaving(false);
        }
    }

    async function deleteQuestion(id: string) {
        if (!confirm("Delete this question?")) return;

        try {
            const { error } = await supabase
                .from("questions")
                .delete()
                .eq("id", id);

            if (error) throw error;
            await fetchTestAndQuestions();
            alert("✅ Question deleted!");
        } catch (error: any) {
            alert(`❌ Error: ${error.message}`);
        }
    }

    async function generateMoreQuestions() {
        if (!test) return;

        const count = prompt("How many questions to generate?", "5");
        if (!count) return;

        setGeneratingAI(true);
        try {
            const response = await fetch("/api/generate-test-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    examCategory: test.category,
                    subject: test.subject,
                    difficulty: "medium",
                    questionsCount: parseInt(count),
                    topics: []
                })
            });

            const result = await response.json();

            if (result.success) {
                // Insert generated questions
                const questionsToInsert = result.questions.map((q: any, index: number) => ({
                    test_id: testId,
                    question_text: q.question,
                    option_a: q.option_a,
                    option_b: q.option_b,
                    option_c: q.option_c || "",
                    option_d: q.option_d || "",
                    correct_option: q.correct_option,
                    explanation: q.explanation || "",
                    marks: q.marks || 1,
                    difficulty: "medium",
                    topic: "",
                    order_index: questions.length + index
                }));

                const { error } = await supabase
                    .from("questions")
                    .insert(questionsToInsert);

                if (error) throw error;

                await fetchTestAndQuestions();
                alert(`✅ Added ${result.count} questions!`);
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.error("AI generation error:", error);
            alert("Failed to generate questions");
        } finally {
            setGeneratingAI(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/teacher/tests" className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Questions</h1>
                        <p className="text-gray-500 mt-1">{test?.title}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={generateMoreQuestions}
                        disabled={generatingAI}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {generatingAI ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Sparkles size={18} />
                        )}
                        Generate More
                    </button>
                    <button
                        onClick={startAddNew}
                        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                        <Plus size={18} />
                        Add Question
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                    <strong>Total Questions:</strong> {questions.length} |
                    <strong className="ml-3">Total Marks:</strong> {questions.reduce((sum, q) => sum + q.marks, 0)}
                </p>
            </div>

            {/* Add/Edit Form */}
            {(addingNew || editingId) && (
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-primary-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                            {editingId ? "Edit Question" : "Add New Question"}
                        </h3>
                        <button onClick={cancelEdit} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Question Text *</label>
                            <textarea
                                value={formData.question_text}
                                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Option A *</label>
                                <input
                                    value={formData.option_a}
                                    onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Option B *</label>
                                <input
                                    value={formData.option_b}
                                    onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Option C</label>
                                <input
                                    value={formData.option_c}
                                    onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Option D</label>
                                <input
                                    value={formData.option_d}
                                    onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Correct Answer *</label>
                                <select
                                    value={formData.correct_option}
                                    onChange={(e) => setFormData({ ...formData, correct_option: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Marks</label>
                                <input
                                    type="number"
                                    value={formData.marks}
                                    onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Difficulty</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Explanation</label>
                            <textarea
                                value={formData.explanation}
                                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={cancelEdit}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveQuestion}
                                disabled={saving}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Question
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Questions List */}
            <div className="space-y-3">
                {questions.map((question, index) => (
                    <div key={question.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                        Q{index + 1}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                        {question.marks} marks
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                                        {question.difficulty}
                                    </span>
                                </div>
                                <p className="text-gray-900 font-medium mb-3">{question.question_text}</p>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {[
                                        { key: "A", value: question.option_a },
                                        { key: "B", value: question.option_b },
                                        { key: "C", value: question.option_c },
                                        { key: "D", value: question.option_d }
                                    ].map((opt) => opt.value && (
                                        <div
                                            key={opt.key}
                                            className={`p-2 rounded-lg border ${question.correct_option === opt.key
                                                    ? "bg-green-50 border-green-300"
                                                    : "bg-gray-50 border-gray-200"
                                                }`}
                                        >
                                            <span className="font-medium text-sm">{opt.key}.</span> {opt.value}
                                        </div>
                                    ))}
                                </div>
                                {question.explanation && (
                                    <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                        <strong>Explanation:</strong> {question.explanation}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => startEdit(question)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
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

            {questions.length === 0 && (
                <div className="bg-white rounded-xl p-12 text-center">
                    <p className="text-gray-500 mb-4">No questions yet</p>
                    <button
                        onClick={startAddNew}
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                        <Plus size={18} />
                        Add First Question
                    </button>
                </div>
            )}
        </div>
    );
}
