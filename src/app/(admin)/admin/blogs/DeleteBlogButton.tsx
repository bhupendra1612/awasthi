"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteBlogButton({ blogId, title }: { blogId: string; title: string }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        setLoading(true);

        const { error } = await supabase.from("blogs").delete().eq("id", blogId);

        if (error) {
            alert("Failed to delete blog");
        } else {
            router.refresh();
        }

        setLoading(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title="Delete"
        >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
        </button>
    );
}
