"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    Home,
    BookOpen,
    PenTool,
    Brain,
    BarChart3,
    Trophy,
    Settings,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Bell,
    User,
    Calendar,
    FileText,
    Target,
    Award,
    Clock,
    Bookmark,
    Download,
    HelpCircle,
    MessageSquare,
} from "lucide-react";

const navigation = [
    { name: 'Dashboard', href: '/student', icon: Home },
    { name: 'My Courses', href: '/student/enrolled-courses', icon: BookOpen },
    { name: 'Tests', href: '/student/tests', icon: PenTool },
    { name: 'Daily Practice', href: '/student#daily-practice-section', icon: Brain },
    { name: 'Performance', href: '/student/performance', icon: BarChart3 },
    { name: 'Achievements', href: '/student/achievements', icon: Trophy },
    { name: 'Study Plan', href: '/student/study-plan', icon: Calendar },
    { name: 'Downloads', href: '/student/downloads', icon: Download },
    { name: 'Bookmarks', href: '/student/bookmarks', icon: Bookmark },
];

const bottomNavigation = [
    { name: 'Help & Support', href: '/student/support', icon: HelpCircle },
    { name: 'Settings', href: '/student/settings', icon: Settings },
];

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);

            // Fetch user profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile(profileData);

                // Redirect based on role
                if (profileData.role === 'admin') {
                    router.push('/admin');
                    return;
                }

                if (profileData.role === 'teacher') {
                    router.push('/teacher');
                    return;
                }

                // Check if user is student
                if (profileData.role !== 'student') {
                    router.push('/dashboard');
                    return;
                }
            }
        } catch (error) {
            console.error('Error checking user:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
                    <div className="flex h-16 items-center justify-between px-4 border-b">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <GraduationCap className="text-white" size={20} />
                            </div>
                            <span className="text-lg font-bold text-gray-900">Awasthi Classes</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t px-4 py-4 space-y-1">
                        {bottomNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
                    <div className="flex items-center h-16 px-4 border-b">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <GraduationCap className="text-white" size={20} />
                            </div>
                            <span className="text-lg font-bold text-gray-900">Awasthi Classes</span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t px-4 py-4 space-y-1">
                        {bottomNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-40 bg-white shadow-sm border-b lg:hidden">
                    <div className="flex items-center justify-between h-16 px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                        >
                            <Menu size={20} />
                        </button>

                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <GraduationCap className="text-white" size={20} />
                            </div>
                            <span className="text-lg font-bold text-gray-900">Awasthi Classes</span>
                        </Link>

                        <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <User className="text-primary-600" size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop top bar */}
                <div className="hidden lg:block sticky top-0 z-40 bg-white shadow-sm border-b">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex-1" />

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                    <User className="text-primary-600" size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {profile?.full_name || user?.email?.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-gray-500">Student</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}