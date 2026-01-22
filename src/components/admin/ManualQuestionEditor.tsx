"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

interface Question {
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    explanation: string;
    marks: number;
    difficulty?: string;
    topic?: string;
}

interface ManualQuestionEditorProps {
    questions: Question[];
    onChange: (questions: Question[]) => void;
    marksPerQuestion: number;
}

export default function ManualQuestionEditor({
    questions,
    onChange,
    marksPerQuestion
}: ManualQuestionEditorProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Question>({
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
        explanation: "",
        marks: marksPerQuestion,
        difficulty: "medium",
        topic: ""
    });

    const startNewQuestion = () => {
        setEditForm({
            question: "",
            option_a: "",
            option_b: "",
            option_c: "",
            option_d: "",
            correct_option: "A",
            explanation: "",
            marks: marksPerQuestion,
            difficulty: "medium",
            topic: ""
        });
        setEditingIndex(-1);
    };

    const startEdit = (index: number) => {
        setEditForm(questions[index]);
        setEditingIndex(index);
    };

    const saveQuestion = () => {
        if (!editForm.question || !editForm.option_a || !editForm.option_b) {
            alert("Please fill in at least question and first two options");
            return;
        }

        const newQuestions = [...questions];
        if (editingIndex === -1) {
            newQuestions.push(editForm);
        } else if (editingIndex !== null) {
            newQuestions[editingIndex] = editForm;
        }
        onChange(newQuestions);
        setEditingIndex(null);
    };

    const deleteQuestion = (index: number) => {
        if (confirm("Delete this question?")) {
            onChange(questions.filter((_, i) => i !== index));
        }
    };

    const cancelEdit = () => {
        setEditingIndex(null);
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Questions ({questions.length})</h3>
                    <p className="text-sm text-gray-600">Add or edit questions manually</p>
                </div>
                <button
                    type="button"
                    onClick={startNewQuestion}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                    <Plus size={18} />
                    Add Question
                </button>
            </div>

            {/* Question Editor Form */}
            {editingIndex !== null && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border-2 border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-4">
                        {editingIndex === -1 ? "New Question" : `Edit Question ${editingIndex + 1}`}
                    </h4>

                    <div className="space-y-4">
                        {/* Question Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question *
                            </label>
                            <textarea
                                value={editForm.question}
                                onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                placeholder="Enter your question here..."
                            />
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Option A *
                                </label>
                                <input
                                    type="text"
                                    value={editForm.option_a}
                                    onChange={(e) => setEditForm({ ...editForm, option_a: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Option B *
                                </label>
                                <input
                                    type="text"
                                    value={editForm.option_b}
                                    onChange={(e) => setEditForm({ ...editForm, option_b: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Option C
                                </label>
                                <input
                                    type="text"
                                    value={editForm.option_c}
                                    onChange={(e) => setEditForm({ ...editForm, option_c: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Option D
                                </label>
                                <input
                                    type="text"
                                    value={editForm.option_d}
                                    onChange={(e) => setEditForm({ ...editForm, option_d: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Correct Option & Marks */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correct Option *
                                </label>
                                <select
                                    value={editForm.correct_option}
                                    onChange={(e) => setEditForm({ ...editForm, correct_option: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Marks
                                </label>
                                <input
                                    type="number"
                                    value={editForm.marks}
                                    onChange={(e) => setEditForm({ ...editForm, marks: parseFloat(e.target.value) })}
                                    step="0.25"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={editForm.difficulty}
                                    onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Topic
                                </label>
                                <input
                                    type="text"
                                    value={editForm.topic}
                                    onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                                    placeholder="Optional"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Explanation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Explanation
                            </label>
                            <textarea
                                value={editForm.explanation}
                                onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                placeholder="Explain the correct answer..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={saveQuestion}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                <Save size={18} />
                                Save Question
                            </button>
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Questions List */}
            {questions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No questions added yet</p>
                    <p className="text-sm mt-2">Use AI Generator or Add Manually</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {questions.map((q, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 mb-2">
                                        {index + 1}. {q.question}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <p className={q.correct_option === 'A' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                            A) {q.option_a}
                                        </p>
                                        <p className={q.correct_option === 'B' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                            B) {q.option_b}
                                        </p>
                                        {q.option_c && (
                                            <p className={q.correct_option === 'C' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                                C) {q.option_c}
                                            </p>
                                        )}
                                        {q.option_d && (
                                            <p className={q.correct_option === 'D' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                                D) {q.option_d}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Marks: {q.marks} | Correct: {q.correct_option}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => startEdit(index)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteQuestion(index)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
