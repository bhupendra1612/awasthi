"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function ToggleBlogPublishButton({ blogId, isPublished }: { blogId: string; isPublished: boolean }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);

        const { error } = await supabase
            .from("blogs")
            .update({ is_published: !isPublished, updated_at: new Date().toISOString() })
            .eq("id", blogId);

        if (error) {
            alert("Failed to update blog");
        } else {
            router.refresh();
        }

        setLoading(false);
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`p-2 rounded-lg transition disabled:opacity-50 ${isPublished
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
