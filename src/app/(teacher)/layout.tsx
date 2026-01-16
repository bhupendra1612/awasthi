import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, BookOpen, FileVideo, User } from "lucide-react";

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is teacher
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, is_active")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "teacher") {
        redirect("/dashboard");
    }

    if (!profile.is_active) {
        redirect("/login?error=account_disabled");
    }

    const navItems = [
        { href: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/teacher/courses", icon: BookOpen, label: "My Courses" },
        { href: "/teacher/profile", icon: User, label: "Profile" },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-purple-900 text-white">
                <div className="p-6">
                    <Link href="/teacher" className="flex items-center gap-2">
                        <div className="w-10 h-10 relative">
                            <Image
                                src="/images/logo.png"
                                alt="Bard of Maths Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <span className="font-bold">Bard of Maths</span>
                            <p className="text-xs text-purple-300">Teacher Panel</p>
                        </div>
                    </Link>
                </div>
                <nav className="mt-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-6 py-3 text-purple-200 hover:bg-purple-800 hover:text-white transition"
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-purple-800">
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <p className="text-white font-medium truncate">{profile.full_name || user.email}</p>
                            <p className="text-purple-300 text-xs">Teacher</p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 min-h-screen">
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-semibold text-gray-900">Teacher Dashboard</h1>
                        <Link
                            href="/"
                            className="text-sm text-gray-500 hover:text-primary-600 transition"
                        >
                            View Website →
                        </Link>
                    </div>
                </header>
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
