"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            title="Logout"
        >
            <LogOut size={20} />
        </button>
    );
}
