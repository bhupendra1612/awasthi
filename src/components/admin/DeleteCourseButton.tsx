"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteCourseButtonProps {
    courseId: string;
    courseTitle: string;
}

export default function DeleteCourseButton({ courseId, courseTitle }: DeleteCourseButtonProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.from("courses").delete().eq("id", courseId);
            if (error) throw error;
            router.refresh();
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete course");
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-md mx-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Course?</h3>
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to delete &quot;{courseTitle}&quot;? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "Delete"}
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
        >
            <Trash2 size={18} />
        </button>
    );
}
