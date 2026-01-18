import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, BookOpen, User, GraduationCap, Bell, Home } from "lucide-react";

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

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, is_active")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/login");
    }

    // Redirect based on role
    if (profile.role === "admin") {
        redirect("/admin");
    }

    if (profile.role !== "teacher") {
        redirect("/dashboard");
    }

    if (!profile.is_active) {
        redirect("/login?error=account_disabled");
    }

    const navItems = [
        { href: "/teacher", icon: LayoutDashboard, label: "Dashboard", color: "from-blue-500 to-cyan-500" },
        { href: "/teacher/courses", icon: BookOpen, label: "My Courses", color: "from-purple-500 to-pink-500" },
        { href: "/teacher/profile", icon: User, label: "Profile", color: "from-green-500 to-emerald-500" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-primary-900 via-primary-800 to-blue-900 text-white shadow-xl z-20">
                {/* Logo */}
                <div className="p-5 border-b border-white/10">
                    <Link href="/teacher" className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-white shadow-lg">
                            <Image
                                src="/images/logo.png"
                                alt="Awasthi Classes Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <span className="font-bold text-lg">Awasthi Classes</span>
                            <p className="text-xs text-primary-200">Teacher Panel</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-3">
                    <p className="px-3 text-xs font-semibold text-primary-300 uppercase tracking-wider mb-3">Menu</p>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-primary-100 hover:bg-white/10 hover:text-white rounded-xl transition mb-1 group"
                        >
                            <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <item.icon size={18} className="text-white" />
                            </div>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Exam Categories */}
                <div className="mx-4 mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <p className="text-xs font-semibold text-primary-200 mb-3 flex items-center gap-2">
                        <GraduationCap size={14} />
                        Teaching For
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {["SSC", "Railway", "Bank", "RPSC", "RSMSSB", "Police"].map((exam) => (
                            <span key={exam} className="text-[10px] bg-white/20 px-2 py-1 rounded-full text-white font-medium">
                                {exam}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mx-4 mt-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2.5 text-primary-200 hover:text-white hover:bg-white/10 rounded-lg transition text-sm"
                    >
                        <Home size={16} />
                        View Website
                    </Link>
                </div>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-primary-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-lg">
                            {profile.full_name?.charAt(0) || "T"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{profile.full_name || "Teacher"}</p>
                            <p className="text-primary-300 text-xs flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Active Teacher
                            </p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
                            <p className="text-sm text-gray-500">Manage your courses & content for government exams</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="h-8 w-px bg-gray-200"></div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">Welcome,</span>
                                <span className="font-medium text-gray-900">{profile.full_name?.split(" ")[0] || "Teacher"}</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
