import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, BookOpen, Users, FileVideo, Settings, CreditCard, FileText, UserCheck, ClipboardCheck, UserCircle, ClipboardList, Sparkles, Image as ImageIcon } from "lucide-react";

// Admin emails that should always have access
const ADMIN_EMAILS = ["thedeeptrading24@gmail.com"];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // First check if user email is in admin list (bypass for RLS issues)
    const isAdminByEmail = ADMIN_EMAILS.includes(user.email || "");

    // Try to get profile, but don't fail if RLS blocks it
    let isAdminByRole = false;
    let userRole = null;
    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        isAdminByRole = profile?.role === "admin";
        userRole = profile?.role;
    } catch (error) {
        console.log("Profile fetch error (RLS may be blocking):", error);
    }

    // Allow access if either check passes
    if (!isAdminByEmail && !isAdminByRole) {
        console.log("Admin access denied for:", user.email);
        redirect("/dashboard");
    }

    const navItems = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/courses", icon: BookOpen, label: "Courses" },
        { href: "/admin/teacher-courses", icon: ClipboardCheck, label: "Teacher Approvals" },
        { href: "/admin/tests", icon: ClipboardList, label: "Test Series" },
        { href: "/admin/daily-tests", icon: Sparkles, label: "AI Daily Tests" },
        { href: "/admin/teachers", icon: UserCheck, label: "Teachers" },
        { href: "/admin/homepage-teachers", icon: UserCircle, label: "Homepage Teachers" },
        { href: "/admin/blogs", icon: FileText, label: "Blogs" },
        { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
        { href: "/admin/enrollments", icon: CreditCard, label: "Enrollments" },
        { href: "/admin/students", icon: Users, label: "Students" },
        { href: "/admin/content", icon: FileVideo, label: "Content" },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 flex-shrink-0">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-10 h-10 relative">
                            <Image
                                src="/images/logo.png"
                                alt="Bard of Maths Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <span className="font-bold">Awasthi Classes</span>
                            <p className="text-xs text-gray-400">Admin Panel</p>
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
                            <p className="text-white font-medium text-sm">Admin</p>
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
                        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
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
