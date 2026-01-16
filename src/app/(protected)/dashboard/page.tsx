import { createClient } from "@/lib/supabase/server";
import { BookOpen, Clock, Award, Play, TrendingUp, Target, Sparkles, ArrowRight, Calendar, CheckCircle, FileText, ClipboardList } from "lucide-react";
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    description: string;
    class: string;
    subject: string;
    price: number;
    original_price: number;
    thumbnail_url: string | null;
    is_combo: boolean;
}

interface Enrollment {
    course_id: string;
    status: string;
    courses: Course;
}

interface Test {
    id: string;
    title: string;
    category: string;
    subject: string;
    duration_minutes: number;
    total_questions: number;
    is_free: boolean;
    price: number;
    is_featured: boolean;
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user?.id)
        .single();

    // Fetch user's enrollments (purchased courses)
    const { data: enrollments } = await supabase
        .from("enrollments")
        .select(`
      course_id,
      status,
      courses (
        id, title, description, class, subject, price, original_price, thumbnail_url, is_combo
      )
    `)
        .eq("user_id", user?.id)
        .eq("payment_status", "paid") as { data: Enrollment[] | null };

    // Fetch all published courses
    const { data: allCourses } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false }) as { data: Course[] | null };

    // Fetch published tests
    const { data: tests } = await supabase
        .from("tests")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(4) as { data: Test[] | null };

    // Get enrolled course IDs
    const enrolledCourseIds = new Set(enrollments?.map(e => e.course_id) || []);

    // Filter courses
    const myCourses = enrollments?.map(e => e.courses).filter(Boolean) || [];
    const availableCourses = allCourses?.filter(c => !enrolledCourseIds.has(c.id)) || [];

    const userName = profile?.full_name || user?.user_metadata?.full_name || "Student";
    const greeting = getGreeting();

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section - Hero Style */}
            <div className="relative bg-gradient-to-br from-primary-600 via-blue-600 to-purple-700 rounded-3xl p-8 md:p-10 mb-8 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute top-10 right-20 text-6xl text-white/10">π</div>
                    <div className="absolute bottom-10 left-20 text-5xl text-white/10">∑</div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                            <Sparkles size={16} />
                            {greeting}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Welcome back, {userName}! 👋
                        </h1>
                        <p className="text-white/80 text-lg">
                            Continue your learning journey and achieve your goals.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/my-courses"
                            className="bg-white text-primary-600 px-6 py-3 rounded-xl font-medium hover:shadow-lg transition flex items-center gap-2"
                        >
                            <Play size={18} />
                            Continue Learning
                        </Link>
                        <Link
                            href="/courses"
                            className="bg-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition flex items-center gap-2"
                        >
                            Explore Courses
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid - 4 Columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <BookOpen className="text-white" size={26} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{myCourses.length}</p>
                            <p className="text-sm text-gray-500">Enrolled Courses</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                            <Clock className="text-white" size={26} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{availableCourses.length}</p>
                            <p className="text-sm text-gray-500">Available Courses</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <TrendingUp className="text-white" size={26} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">0%</p>
                            <p className="text-sm text-gray-500">Performance</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                            <Award className="text-white" size={26} />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                            <p className="text-sm text-gray-500">Certificates</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 border border-yellow-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <Sparkles className="text-white" size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900">Daily Practice</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Free AI-generated daily tests for quick practice.</p>
                    <Link href="/daily-practice" className="text-orange-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                        Practice Now <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Target className="text-white" size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900">Set Your Goals</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Track your daily learning targets and stay motivated.</p>
                    <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                        Coming Soon <ArrowRight size={14} />
                    </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <Calendar className="text-white" size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900">Study Schedule</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Plan your study sessions and never miss a class.</p>
                    <button className="text-green-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                        Coming Soon <ArrowRight size={14} />
                    </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <ClipboardList className="text-white" size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900">Test Series</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Practice with mock tests for government exams.</p>
                    <Link href="/tests" className="text-purple-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                        Take a Test <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* My Courses Section */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                        <p className="text-sm text-gray-500">Continue where you left off</p>
                    </div>
                    {myCourses.length > 0 && (
                        <Link href="/my-courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    )}
                </div>

                {myCourses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCourses.slice(0, 3).map((course) => (
                            <Link
                                key={course.id}
                                href={`/course/${course.id}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="aspect-video bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
                                    {course.thumbnail_url && (
                                        <img
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition z-10">
                                        <Play className="text-white ml-1" size={32} />
                                    </div>
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="bg-white/90 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                                            {course.class}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition line-clamp-1">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{course.subject}</p>

                                    {/* Progress bar placeholder */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Progress</span>
                                            <span>0%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-primary-500 to-blue-500 rounded-full" style={{ width: "0%" }} />
                                        </div>
                                    </div>

                                    <button className="mt-4 w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition text-sm font-medium flex items-center justify-center gap-2">
                                        <Play size={16} />
                                        Continue Learning
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="text-gray-400" size={36} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No courses yet</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                            Start your learning journey by enrolling in a course that interests you.
                        </p>
                        <Link
                            href="#available-courses"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-medium"
                        >
                            Browse Courses <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </section>

            {/* Test Series Section */}
            {tests && tests.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Test Series</h2>
                            <p className="text-sm text-gray-500">Practice with mock tests for government exams</p>
                        </div>
                        <Link href="/tests" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tests.map((test) => (
                            <Link
                                key={test.id}
                                href={`/tests/${test.id}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center relative overflow-hidden">
                                    {test.is_featured && (
                                        <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                                            <Sparkles size={12} />
                                            FEATURED
                                        </span>
                                    )}
                                    {test.is_free && (
                                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                                            FREE
                                        </span>
                                    )}
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                        <FileText className="text-white" size={32} />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                            {test.category}
                                        </span>
                                        <span className="text-xs text-gray-500">{test.subject}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition line-clamp-2 min-h-[48px]">
                                        {test.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <FileText size={14} />
                                            {test.total_questions} Q
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {test.duration_minutes} min
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        {test.is_free ? (
                                            <span className="text-green-600 font-bold">FREE</span>
                                        ) : (
                                            <span className="text-xl font-bold text-primary-600">₹{test.price}</span>
                                        )}
                                        <span className="text-primary-600 text-sm font-medium group-hover:underline">
                                            Start Test →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Available Courses Section */}
            <section id="available-courses">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Available Courses</h2>
                        <p className="text-sm text-gray-500">Explore and enroll in new courses</p>
                    </div>
                    <Link href="/courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                {availableCourses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {availableCourses.slice(0, 8).map((course) => (
                            <div
                                key={course.id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className={`aspect-video flex items-center justify-center relative overflow-hidden ${course.is_combo
                                    ? "bg-gradient-to-br from-orange-500 to-red-600"
                                    : "bg-gradient-to-br from-blue-500 to-purple-600"
                                    }`}>
                                    {course.thumbnail_url && (
                                        <img
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                    {course.is_combo && (
                                        <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
                                            <Sparkles size={12} />
                                            COMBO
                                        </span>
                                    )}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="bg-white/90 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                                            {course.class}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition line-clamp-2 min-h-[48px]">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{course.subject}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className="text-xl font-bold text-primary-600">
                                            ₹{course.price.toLocaleString("en-IN")}
                                        </span>
                                        {course.original_price > course.price && (
                                            <>
                                                <span className="text-sm text-gray-400 line-through">
                                                    ₹{course.original_price.toLocaleString("en-IN")}
                                                </span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                    {Math.round(((course.original_price - course.price) / course.original_price) * 100)}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <Link
                                        href={`/course/${course.id}`}
                                        className="mt-4 block text-center bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-primary-600 hover:text-white transition text-sm font-medium"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                        <p className="text-gray-500">No courses available at the moment</p>
                    </div>
                )}
            </section>
        </div>
    );
}