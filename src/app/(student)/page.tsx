"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
    BookOpen,
    Trophy,
    Clock,
    Target,
    TrendingUp,
    Calendar,
    Award,
    PlayCircle,
    FileText,
    Users,
    Star,
    ChevronRight,
    Zap,
    Brain,
    CheckCircle,
    AlertCircle,
    BarChart3,
    Bookmark,
    Download,
    Bell,
    Settings,
    User,
    LogOut,
    Home,
    GraduationCap,
    PenTool,
    Activity,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import InDashboardTest from "@/components/InDashboardTest";

interface DashboardStats {
    enrolledCourses: number;
    completedTests: number;
    totalStudyHours: number;
    currentStreak: number;
    averageScore: number;
    rank: number;
}

interface Course {
    id: string;
    title: string;
    subject: string;
    progress: number;
    thumbnail_url?: string;
    class: string;
    board: string;
}

interface RecentActivity {
    id: string;
    type: 'test' | 'course' | 'practice';
    title: string;
    score?: number;
    date: string;
    status: 'completed' | 'in_progress' | 'pending';
}

interface UpcomingTest {
    id: string;
    title: string;
    date: string;
    duration: number;
    subject: string;
    type: 'mock' | 'practice' | 'daily';
}

interface DailyTest {
    id: string;
    title: string;
    exam_category: string;
    subject: string;
    difficulty: string;
    questions_count: number;
    duration_minutes: number;
    test_date: string;
}

interface TestAttempt {
    daily_test_id: string;
    score: number;
    completed_at: string;
}

export default function StudentDashboard() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<DashboardStats>({
        enrolledCourses: 0,
        completedTests: 0,
        totalStudyHours: 0,
        currentStreak: 0,
        averageScore: 0,
        rank: 0
    });
    const [courses, setCourses] = useState<Course[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [upcomingTests, setUpcomingTests] = useState<UpcomingTest[]>([]);
    const [dailyTests, setDailyTests] = useState<DailyTest[]>([]);
    const [attempts, setAttempts] = useState<TestAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTestId, setActiveTestId] = useState<string | null>(null);
    const [activeTestType, setActiveTestType] = useState<'daily' | 'regular'>('daily');
    const router = useRouter();
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
            await fetchUserProfile(user.id);
            await fetchDashboardData(user.id);
        } catch (error) {
            console.error('Error checking user:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) {
            setProfile(data);
        }
    };

    const fetchDashboardData = async (userId: string) => {
        // Fetch enrolled courses
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select(`
                *,
                courses (
                    id,
                    title,
                    subject,
                    class,
                    board,
                    thumbnail_url
                )
            `)
            .eq('user_id', userId)
            .eq('status', 'active');

        if (enrollments) {
            const coursesData = enrollments.map(enrollment => ({
                id: enrollment.courses.id,
                title: enrollment.courses.title,
                subject: enrollment.courses.subject,
                class: enrollment.courses.class,
                board: enrollment.courses.board,
                thumbnail_url: enrollment.courses.thumbnail_url,
                progress: Math.floor(Math.random() * 100) // Mock progress
            }));
            setCourses(coursesData);
        }

        // Fetch today's daily practice tests
        const today = new Date().toISOString().split("T")[0];
        console.log('🔍 Fetching daily tests for date:', today);

        const { data: todayTests, error: testsError } = await supabase
            .from("generated_daily_tests")
            .select("*")
            .eq("status", "published")
            .eq("test_date", today)
            .order("exam_category");

        console.log('📊 Daily tests fetched:', todayTests?.length || 0, 'tests');
        if (testsError) console.error('❌ Error fetching daily tests:', testsError);

        if (todayTests) {
            setDailyTests(todayTests);
            console.log('✅ Daily tests set in state:', todayTests);
        }

        // Fetch user's daily test attempts
        const { data: attemptsData, error: attemptsError } = await supabase
            .from("daily_test_attempts")
            .select("daily_test_id, score, completed_at")
            .eq("user_id", userId);

        console.log('📝 Attempts fetched:', attemptsData?.length || 0, 'attempts');
        if (attemptsError) console.error('❌ Error fetching attempts:', attemptsError);

        if (attemptsData) {
            setAttempts(attemptsData);
        }

        // Mock data for demonstration
        setStats({
            enrolledCourses: enrollments?.length || 0,
            completedTests: attemptsData?.length || 0,
            totalStudyHours: 156,
            currentStreak: 7,
            averageScore: 78,
            rank: 45
        });

        // Mock recent activity
        setRecentActivity([
            {
                id: '1',
                type: 'test',
                title: 'SSC CGL Mock Test #15',
                score: 85,
                date: '2 hours ago',
                status: 'completed'
            },
            {
                id: '2',
                type: 'course',
                title: 'Mathematics - Algebra Chapter',
                date: '1 day ago',
                status: 'completed'
            },
            {
                id: '3',
                type: 'practice',
                title: 'Daily Practice Test',
                score: 92,
                date: '2 days ago',
                status: 'completed'
            }
        ]);

        // Mock upcoming tests
        setUpcomingTests([
            {
                id: '1',
                title: 'Railway Group D Mock Test',
                date: 'Tomorrow, 10:00 AM',
                duration: 90,
                subject: 'General Knowledge',
                type: 'mock'
            },
            {
                id: '2',
                title: 'SSC CGL Practice Test',
                date: 'Jan 20, 2:00 PM',
                duration: 120,
                subject: 'Quantitative Aptitude',
                type: 'practice'
            }
        ]);
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
            {/* In-Dashboard Test Modal */}
            {activeTestId && (
                <InDashboardTest
                    testId={activeTestId}
                    testType={activeTestType}
                    onClose={() => {
                        setActiveTestId(null);
                        setActiveTestType('daily');
                        // Refresh data to update attempts
                        if (user) {
                            fetchDashboardData(user.id);
                        }
                    }}
                />
            )}

            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="text-white" size={24} />
                                </div>
                                <span className="text-xl font-bold text-gray-900">Awasthi Classes</span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                    <User className="text-primary-600" size={16} />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">
                                        {profile?.full_name || user?.email?.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-gray-500">Student</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-gray-600"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {profile?.full_name || 'Student'}! 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Ready to continue your government exam preparation journey?
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.enrolledCourses}</p>
                                <p className="text-sm text-gray-600">Enrolled Courses</p>
                            </div>
                            <BookOpen className="text-blue-500" size={24} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{dailyTests.length}</p>
                                <p className="text-sm text-gray-600">Today's Practice</p>
                            </div>
                            <Brain className="text-green-500" size={24} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.completedTests}</p>
                                <p className="text-sm text-gray-600">Tests Completed</p>
                            </div>
                            <CheckCircle className="text-purple-500" size={24} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
                                <p className="text-sm text-gray-600">Day Streak</p>
                            </div>
                            <Zap className="text-orange-500" size={24} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
                                <p className="text-sm text-gray-600">Avg Score</p>
                            </div>
                            <Target className="text-pink-500" size={24} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">#{stats.rank}</p>
                                <p className="text-sm text-gray-600">Rank</p>
                            </div>
                            <Award className="text-red-500" size={24} />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link
                                    href="/student/tests"
                                    className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition group"
                                >
                                    <PenTool className="text-blue-600 group-hover:scale-110 transition-transform" size={24} />
                                    <span className="text-sm font-medium text-blue-900 mt-2">Take Test</span>
                                </Link>

                                <button
                                    onClick={() => {
                                        const element = document.getElementById('daily-practice-section');
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition group"
                                >
                                    <Brain className="text-green-600 group-hover:scale-110 transition-transform" size={24} />
                                    <span className="text-sm font-medium text-green-900 mt-2">Daily Practice</span>
                                    {dailyTests.length > 0 && (
                                        <span className="mt-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                                            {dailyTests.length} available
                                        </span>
                                    )}
                                </button>

                                <Link
                                    href="/student/enrolled-courses"
                                    className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition group"
                                >
                                    <BookOpen className="text-purple-600 group-hover:scale-110 transition-transform" size={24} />
                                    <span className="text-sm font-medium text-purple-900 mt-2">My Courses</span>
                                </Link>

                                <Link
                                    href="/student/performance"
                                    className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition group"
                                >
                                    <BarChart3 className="text-orange-600 group-hover:scale-110 transition-transform" size={24} />
                                    <span className="text-sm font-medium text-orange-900 mt-2">Performance</span>
                                </Link>
                            </div>
                        </div>

                        {/* Daily Practice Section */}
                        {dailyTests.length > 0 && (
                            <div id="daily-practice-section" className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-sm border border-yellow-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                            <Brain className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Today's Daily Practice</h2>
                                            <p className="text-sm text-gray-600">Free AI-generated tests • {new Date().toLocaleDateString("en-IN", { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                        <Zap size={16} />
                                        FREE
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {dailyTests.map((test) => {
                                        const isAttempted = attempts.some(a => a.daily_test_id === test.id);
                                        const attempt = attempts.find(a => a.daily_test_id === test.id);
                                        const categoryColors: Record<string, string> = {
                                            "SSC": "from-blue-500 to-cyan-500",
                                            "Railway": "from-green-500 to-emerald-500",
                                            "Bank": "from-purple-500 to-pink-500",
                                            "RPSC": "from-orange-500 to-red-500",
                                            "Police": "from-red-500 to-rose-500",
                                            "RSMSSB": "from-cyan-500 to-teal-500",
                                        };

                                        return (
                                            <div
                                                key={test.id}
                                                className={`bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition ${isAttempted ? "ring-2 ring-green-500" : ""
                                                    }`}
                                            >
                                                <div className={`h-2 bg-gradient-to-r ${categoryColors[test.exam_category] || "from-gray-400 to-gray-500"}`} />
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                            {test.exam_category}
                                                        </span>
                                                        {isAttempted && attempt && (
                                                            <span className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">
                                                                <CheckCircle size={12} />
                                                                Score: {attempt.score}/{test.questions_count}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="font-bold text-gray-900 mb-2">{test.subject}</h3>

                                                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <FileText size={14} />
                                                            {test.questions_count} Qs
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {test.duration_minutes} min
                                                        </span>
                                                        <span className={`px-1.5 py-0.5 rounded text-xs ${test.difficulty === "easy" ? "bg-green-100 text-green-700" :
                                                            test.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                                                                "bg-red-100 text-red-700"
                                                            }`}>
                                                            {test.difficulty}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            setActiveTestId(test.id);
                                                            setActiveTestType('daily');
                                                        }}
                                                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition ${isAttempted
                                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            : "bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:shadow-lg"
                                                            }`}
                                                    >
                                                        <PlayCircle size={16} />
                                                        {isAttempted ? "View Result" : "Start Test"}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Test Series Section */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Test Series</h2>
                                <Link
                                    href="/student/tests"
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                                >
                                    View All
                                    <ChevronRight size={16} className="ml-1" />
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {upcomingTests.slice(0, 4).map((test) => (
                                    <div key={test.id} className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{test.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{test.subject}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <Calendar size={14} className="mr-1" />
                                                        {test.date}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock size={14} className="mr-1" />
                                                        {test.duration} min
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${test.type === 'mock' ? 'bg-red-100 text-red-700' :
                                                test.type === 'practice' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {test.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setActiveTestId(test.id);
                                                setActiveTestType('regular');
                                            }}
                                            className="w-full mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                                        >
                                            Start Test
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* My Courses */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                                <Link
                                    href="/student/enrolled-courses"
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                                >
                                    View All
                                    <ChevronRight size={16} className="ml-1" />
                                </Link>
                            </div>

                            {courses.length > 0 ? (
                                <div className="space-y-4">
                                    {courses.slice(0, 3).map((course) => (
                                        <div key={course.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <BookOpen className="text-white" size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{course.title}</h3>
                                                <p className="text-sm text-gray-600">{course.class} • {course.subject}</p>
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">Progress</span>
                                                        <span className="font-medium">{course.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                        <div
                                                            className="bg-primary-600 h-2 rounded-full"
                                                            style={{ width: `${course.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/student/enrolled-courses/${course.id}`}
                                                className="p-2 text-gray-400 hover:text-primary-600"
                                            >
                                                <PlayCircle size={20} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500">No courses enrolled yet</p>
                                    <Link
                                        href="/student/enrolled-courses"
                                        className="inline-flex items-center mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                                    >
                                        Browse Courses
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'test' ? 'bg-blue-100' :
                                            activity.type === 'course' ? 'bg-green-100' : 'bg-purple-100'
                                            }`}>
                                            {activity.type === 'test' ? (
                                                <PenTool className={`${activity.type === 'test' ? 'text-blue-600' :
                                                    activity.type === 'course' ? 'text-green-600' : 'text-purple-600'
                                                    }`} size={16} />
                                            ) : activity.type === 'course' ? (
                                                <BookOpen className="text-green-600" size={16} />
                                            ) : (
                                                <Brain className="text-purple-600" size={16} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{activity.title}</p>
                                            <p className="text-sm text-gray-600">{activity.date}</p>
                                        </div>
                                        {activity.score && (
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">{activity.score}%</p>
                                                <p className="text-xs text-gray-500">Score</p>
                                            </div>
                                        )}
                                        <CheckCircle className="text-green-500" size={16} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Upcoming Tests */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Tests</h2>
                            <div className="space-y-4">
                                {upcomingTests.map((test) => (
                                    <div key={test.id} className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{test.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{test.subject}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <Calendar size={14} className="mr-1" />
                                                        {test.date}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock size={14} className="mr-1" />
                                                        {test.duration} min
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${test.type === 'mock' ? 'bg-red-100 text-red-700' :
                                                test.type === 'practice' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {test.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <button className="w-full mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium">
                                            Start Test
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Study Streak */}
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Study Streak</h2>
                                <Zap size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold mb-2">{stats.currentStreak}</p>
                                <p className="text-orange-100">Days in a row</p>
                                <p className="text-sm text-orange-100 mt-4">
                                    Keep it up! You're doing great 🔥
                                </p>
                            </div>
                        </div>

                        {/* Performance Summary */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Summary</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Average Score</span>
                                    <span className="font-bold text-green-600">{stats.averageScore}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Tests Completed</span>
                                    <span className="font-bold text-blue-600">{stats.completedTests}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Current Rank</span>
                                    <span className="font-bold text-purple-600">#{stats.rank}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Study Hours</span>
                                    <span className="font-bold text-orange-600">{stats.totalStudyHours}h</span>
                                </div>
                            </div>
                            <Link
                                href="/student/performance"
                                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium text-center block"
                            >
                                View Detailed Report
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}