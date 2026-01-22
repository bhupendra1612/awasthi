import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, FileText, BookOpen, Users, Settings, Bell } from "lucide-react";

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

    // Check if user is a teacher
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

    const isTeacher = profile?.role === "teacher";
    const isAdmin = profile?.role === "admin";

    if (!isTeacher && !isAdmin) {
        redirect("/dashboard");
    }

    const userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Teacher";
    const userInitial = userName.charAt(0).toUpperCase();

    const navItems = [
        { href: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/teacher/tests", icon: FileText, label: "Test Series" },
        { href: "/teacher/courses", icon: BookOpen, label: "My Courses" },
        { href: "/teacher/students", icon: Users, label: "Students" },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 flex-shrink-0">
                    <Link href="/teacher" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">A</span>
                        </div>
                        <div>
                            <span className="font-bold">Awasthi Classes</span>
                            <p className="text-xs text-gray-400">Teacher Panel</p>
                        </div>
                    </Link>
                </div>
                <nav className="mt-6 flex-1 overflow-y-auto pb-24">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition"
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm">Teacher</p>
                            <p className="text-gray-400 text-xs truncate">{user.email}</p>
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
                        <div className="flex items-center gap-3">
                            <button className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                            </button>
                            <Link
                                href="/"
                                className="text-sm text-gray-500 hover:text-primary-600 transition"
                            >
                                View Website →
                            </Link>
                        </div>
                    </div>
                </header>
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
