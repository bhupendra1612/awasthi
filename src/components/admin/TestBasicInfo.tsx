"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";

interface TestBasicInfoProps {
    formData: {
        title: string;
        description: string;
        category: string;
        subject: string;
        duration_minutes: number;
        passing_marks: number;
        negative_marks: number;
        marks_per_question: number;
        is_free: boolean;
        price: number;
        instructions: string;
        thumbnail_url: string;
    };
    onChange: (field: string, value: any) => void;
}

export default function TestBasicInfo({ formData, onChange }: TestBasicInfoProps) {
    const [uploading, setUploading] = useState(false);

    const categories = [
        "SSC", "Railway", "Bank", "RPSC", "RSMSSB",
        "Police", "UPSC", "Teaching", "Defence", "Other"
    ];

    const subjects = [
        "General Knowledge", "Mathematics", "Reasoning", "English",
        "Hindi", "Science", "History", "Geography", "Polity",
        "Economics", "Computer", "Current Affairs", "All Subjects"
    ];

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("Image size should be less than 2MB");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                onChange("thumbnail_url", result.url);
            } else {
                alert("Failed to upload image");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Title *
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => onChange("title", e.target.value)}
                    placeholder="e.g., SSC CGL Tier 1 Mock Test 2024"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="Brief description of the test..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
            </div>

            {/* Category & Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Category *
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => onChange("category", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                    </label>
                    <select
                        value={formData.subject}
                        onChange={(e) => onChange("subject", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        required
                    >
                        <option value="">Select Subject</option>
                        {subjects.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Duration & Marks */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (min) *
                    </label>
                    <input
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) => onChange("duration_minutes", parseInt(e.target.value))}
                        min="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marks/Question *
                    </label>
                    <input
                        type="number"
                        value={formData.marks_per_question}
                        onChange={(e) => onChange("marks_per_question", parseFloat(e.target.value))}
                        min="0"
                        step="0.25"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passing Marks *
                    </label>
                    <input
                        type="number"
                        value={formData.passing_marks}
                        onChange={(e) => onChange("passing_marks", parseFloat(e.target.value))}
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Negative Marks
                    </label>
                    <input
                        type="number"
                        value={formData.negative_marks}
                        onChange={(e) => onChange("negative_marks", parseFloat(e.target.value))}
                        min="0"
                        step="0.25"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
            </div>

            {/* Pricing */}
            <div>
                <label className="flex items-center gap-2 mb-3">
                    <input
                        type="checkbox"
                        checked={formData.is_free}
                        onChange={(e) => onChange("is_free", e.target.checked)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">This is a free test</span>
                </label>

                {!formData.is_free && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => onChange("price", parseFloat(e.target.value))}
                                min="0"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                required={!formData.is_free}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Thumbnail */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image
                </label>
                {formData.thumbnail_url ? (
                    <div className="relative inline-block">
                        <img
                            src={formData.thumbnail_url}
                            alt="Thumbnail"
                            className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={() => onChange("thumbnail_url", "")}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition">
                        <Upload className="text-gray-400 mb-2" size={32} />
                        <span className="text-sm text-gray-500">
                            {uploading ? "Uploading..." : "Click to upload thumbnail"}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                )}
            </div>

            {/* Instructions */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Instructions
                </label>
                <textarea
                    value={formData.instructions}
                    onChange={(e) => onChange("instructions", e.target.value)}
                    placeholder="Instructions for students taking this test..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
            </div>
        </div>
    );
}
