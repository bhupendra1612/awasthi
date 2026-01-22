"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import TestBasicInfo from "@/components/admin/TestBasicInfo";
import AIQuestionGenerator from "@/components/admin/AIQuestionGenerator";
import ManualQuestionEditor from "@/components/admin/ManualQuestionEditor";

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

export default function TeacherNewTestPage() {
    const router = useRouter();
    const supabase = createClient();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        subject: "",
        duration_minutes: 60,
        passing_marks: 40,
        negative_marks: 0.25,
        marks_per_question: 1,
        is_free: true,
        price: 0,
        instructions: "",
        thumbnail_url: ""
    });

    const [questions, setQuestions] = useState<Question[]>([]);

    const handleFieldChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleAIQuestionsGenerated = (newQuestions: Question[]) => {
        setQuestions([...questions, ...newQuestions]);
    };

    const handleSaveTest = async () => {
        if (!formData.title || !formData.category || !formData.subject) {
            alert("Please fill in all required fields");
            return;
        }

        if (questions.length === 0) {
            alert("Please add at least one question");
            return;
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Calculate total marks
            const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

            // Create test - teachers can publish directly
            const { data: test, error: testError } = await supabase
                .from("tests")
                .insert({
                    ...formData,
                    total_questions: questions.length,
                    total_marks: totalMarks,
                    created_by: user.id,
                    is_published: false // Start as draft, teacher can publish later
                })
                .select()
                .single();

            if (testError) throw testError;

            // Insert questions
            const questionsToInsert = questions.map((q, index) => ({
                test_id: test.id,
                question_text: q.question,
                option_a: q.option_a,
                option_b: q.option_b,
                option_c: q.option_c || "",
                option_d: q.option_d || "",
                correct_option: q.correct_option,
                explanation: q.explanation || "",
                marks: q.marks,
                negative_marks: formData.negative_marks,
                difficulty: q.difficulty || "medium",
                topic: q.topic || "",
                order_index: index
            }));

            const { error: questionsError } = await supabase
                .from("questions")
                .insert(questionsToInsert);

            if (questionsError) throw questionsError;

            alert("✅ Test created successfully!");
            router.push("/teacher/tests");

        } catch (error: any) {
            console.error("Save error:", error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/teacher/tests"
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Test</h1>
                        <p className="text-gray-500 mt-1">Add test details and questions</p>
                    </div>
                </div>
                <button
                    onClick={handleSaveTest}
                    disabled={saving || questions.length === 0}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {saving ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Test
                        </>
                    )}
                </button>
            </div>

            {/* Info Banner for Teachers */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                    <strong>Teacher Power:</strong> You can create tests and publish them directly without admin approval.
                    Use AI to generate questions quickly or add them manually for full control.
                </p>
            </div>

            {/* Basic Info */}
            <TestBasicInfo formData={formData} onChange={handleFieldChange} />

            {/* AI Generator */}
            <AIQuestionGenerator
                category={formData.category}
                subject={formData.subject}
                onQuestionsGenerated={handleAIQuestionsGenerated}
            />

            {/* Manual Editor */}
            <ManualQuestionEditor
                questions={questions}
                onChange={setQuestions}
                marksPerQuestion={formData.marks_per_question}
            />

            {/* Bottom Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSaveTest}
                    disabled={saving || questions.length === 0}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {saving ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Saving Test...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Test ({questions.length} questions)
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
