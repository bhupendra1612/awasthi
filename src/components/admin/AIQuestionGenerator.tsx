"use client";

import { useState } from "react";
import { Sparkles, Loader2, Plus, X } from "lucide-react";

interface Question {
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    explanation: string;
    marks: number;
}

interface AIQuestionGeneratorProps {
    category: string;
    subject: string;
    onQuestionsGenerated: (questions: Question[]) => void;
}

export default function AIQuestionGenerator({
    category,
    subject,
    onQuestionsGenerated
}: AIQuestionGeneratorProps) {
    const [generating, setGenerating] = useState(false);
    const [questionsCount, setQuestionsCount] = useState(10);
    const [difficulty, setDifficulty] = useState("medium");
    const [topics, setTopics] = useState<string[]>([]);
    const [topicInput, setTopicInput] = useState("");

    const handleGenerate = async () => {
        if (!category || !subject) {
            alert("Please select exam category and subject first");
            return;
        }

        setGenerating(true);
        try {
            const response = await fetch("/api/generate-test-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    examCategory: category,
                    subject: subject,
                    difficulty: difficulty,
                    questionsCount: questionsCount,
                    topics: topics
                })
            });

            const result = await response.json();

            if (result.success) {
                onQuestionsGenerated(result.questions);
                alert(`✅ Successfully generated ${result.count} questions!`);
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Generation error:", error);
            alert("Failed to generate questions");
        } finally {
            setGenerating(false);
        }
    };

    const addTopic = () => {
        if (topicInput.trim() && !topics.includes(topicInput.trim())) {
            setTopics([...topics, topicInput.trim()]);
            setTopicInput("");
        }
    };

    const removeTopic = (topic: string) => {
        setTopics(topics.filter(t => t !== topic));
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-white" size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Question Generator</h3>
                    <p className="text-sm text-gray-600">Generate questions automatically using AI</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Questions Count & Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Questions
                        </label>
                        <input
                            type="number"
                            value={questionsCount}
                            onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
                            min="1"
                            max="100"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Difficulty Level
                        </label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="mixed">Mixed</option>
                        </select>
                    </div>
                </div>

                {/* Topics (Optional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specific Topics (Optional)
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                            placeholder="e.g., Indian History, Algebra"
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <button
                            type="button"
                            onClick={addTopic}
                            className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    {topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {topics.map((topic) => (
                                <span
                                    key={topic}
                                    className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {topic}
                                    <button
                                        type="button"
                                        onClick={() => removeTopic(topic)}
                                        className="hover:bg-purple-200 rounded-full p-0.5"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Generate Button */}
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={generating || !category || !subject}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {generating ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Generating Questions...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Generate Questions with AI
                        </>
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    AI will generate questions based on your exam category and subject
                </p>
            </div>
        </div>
    );
}
