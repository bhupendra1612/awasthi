import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, BookOpen, GraduationCap, Settings, Bell, Search, UserCheck, PenTool } from "lucide-react";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check user role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

    // Debug logging (remove in production)
    console.log("User ID:", user.id);
    console.log("User Email:", user.email);
    console.log("Profile:", profile);

    const isAdmin = profile?.role === "admin";
    const isTeacher = profile?.role === "teacher";

    // More debug logging
    console.log("Is Admin:", isAdmin);
    console.log("Is Teacher:", isTeacher);
    const userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                <span className="text-xl font-bold text-white">A</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                                    Awasthi Classes
                                </span>
                            </div>
                        </Link>

                        {/* Center Navigation */}
                        <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-all font-medium"
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                            <Link
                                href="/my-courses"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-all font-medium"
                            >
                                <BookOpen size={18} />
                                My Courses
                            </Link>
                            <Link
                                href="/tests"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-all font-medium"
                            >
                                <PenTool size={18} />
                                Tests
                            </Link>
                            <Link
                                href="/courses"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-all font-medium"
                            >
                                <GraduationCap size={18} />
                                Explore
                            </Link>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all font-medium"
                                >
                                    <Settings size={18} />
                                    Admin
                                </Link>
                            )}
                            {isTeacher && (
                                <Link
                                    href="/teacher"
                                    className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all font-medium"
                                >
                                    <UserCheck size={18} />
                                    Teacher
                                </Link>
                            )}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            {/* Search Button */}
                            <button className="hidden sm:flex w-10 h-10 items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition">
                                <Search size={20} />
                            </button>

                            {/* Notifications */}
                            <button className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                                    <p className="text-xs text-gray-500">{isAdmin ? "Admin" : isTeacher ? "Teacher" : "Student"}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">
                                    {userInitial}
                                </div>
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="flex justify-around py-3">
                        <Link
                            href="/dashboard"
                            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-primary-600 transition"
                        >
                            <LayoutDashboard size={18} />
                            <span className="text-xs">Dashboard</span>
                        </Link>
                        <Link
                            href="/my-courses"
                            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-primary-600 transition"
                        >
                            <BookOpen size={18} />
                            <span className="text-xs">My Courses</span>
                        </Link>
                        <Link
                            href="/tests"
                            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-primary-600 transition"
                        >
                            <PenTool size={18} />
                            <span className="text-xs">Tests</span>
                        </Link>
                        <Link
                            href="/courses"
                            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-primary-600 transition"
                        >
                            <GraduationCap size={18} />
                            <span className="text-xs">Explore</span>
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="flex flex-col items-center gap-1 px-3 py-2 text-orange-600 hover:text-orange-700 transition"
                            >
                                <Settings size={18} />
                                <span className="text-xs">Admin</span>
                            </Link>
                        )}
                        {isTeacher && (
                            <Link
                                href="/teacher"
                                className="flex flex-col items-center gap-1 px-3 py-2 text-purple-600 hover:text-purple-700 transition"
                            >
                                <UserCheck size={18} />
                                <span className="text-xs">Teacher</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content with padding for fixed header */}
            <main className="pt-32 md:pt-16">{children}</main>
        </div>
    );
}
