"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface TogglePublishButtonProps {
    courseId: string;
    isPublished: boolean;
}

export default function TogglePublishButton({ courseId, isPublished }: TogglePublishButtonProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from("courses")
                .update({ is_published: !isPublished })
                .eq("id", courseId);

            if (error) throw error;
            router.refresh();
        } catch (err) {
            console.error("Toggle error:", err);
            alert("Failed to update course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`p-2 rounded-lg transition ${isPublished
                    ? "text-green-600 hover:bg-green-50"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
            title={isPublished ? "Unpublish" : "Publish"}
        >
            {loading ? (
                <Loader2 className="animate-spin" size={18} />
            ) : isPublished ? (
                <Eye size={18} />
            ) : (
                <EyeOff size={18} />
            )}
        </button>
    );
}
