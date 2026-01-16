import { createClient } from "@/lib/supabase/server";
import {
    BookOpen, Users, IndianRupee, TrendingUp, GraduationCap,
    FileText, Video, Clock, Calendar, ArrowUpRight, ArrowDownRight,
    Bell, Target, Award, Briefcase, UserPlus, Eye, PlayCircle,
    CheckCircle, AlertCircle, BarChart3, PieChart
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Get stats
    const { count: coursesCount } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });

    const { count: publishedCoursesCount } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

    const { count: studentsCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

    const { count: enrollmentsCount } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "paid");

    const { count: pendingEnrollmentsCount } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "pending");

    const { count: videosCount } = await supabase
        .from("videos")
        .select("*", { count: "exact", head: true });

    const { count: documentsCount } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });

    const { count: teachersCount } = await supabase
        .from("teachers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

    // Calculate revenue
    const { data: paidEnrollments } = await supabase
        .from("enrollments")
        .select("amount_paid")
        .eq("payment_status", "paid");

    const totalRevenue = paidEnrollments?.reduce((sum, e) => sum + (e.amount_paid || 0), 0) || 0;

    // Recent enrollments
    const { data: recentEnrollments } = await supabase
        .from("enrollments")
        .select(`
            *,
            profiles:user_id(full_name, email),
            courses:course_id(title, class)
        `)
        .order("enrolled_at", { ascending: false })
        .limit(5);

    // Recent students
    const { data: recentStudents } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("created_at", { ascending: false })
        .limit(5);

    // Popular courses
    const { data: popularCourses } = await supabase
        .from("courses")
        .select(`
            id, title, class, subject,
            enrollments:enrollments(count)
        `)
        .eq("is_published", true)
        .limit(5);

    const stats = [
        {
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            gradient: "from-green-500 to-emerald-600",
            change: "+12%",
            changeType: "positive",
            href: "/admin/enrollments",
        },
        {
            label: "Total Students",
            value: studentsCount || 0,
            icon: Users,
            gradient: "from-blue-500 to-cyan-600",
            change: "+8%",
            changeType: "positive",
            href: "/admin/students",
        },
        {
            label: "Active Enrollments",
            value: enrollmentsCount || 0,
            icon: GraduationCap,
            gradient: "from-purple-500 to-pink-600",
            change: "+15%",
            changeType: "positive",
            href: "/admin/enrollments",
        },
        {
            label: "Published Courses",
            value: publishedCoursesCount || 0,
            icon: BookOpen,
            gradient: "from-orange-500 to-red-600",
            change: `${coursesCount || 0} total`,
            changeType: "neutral",
            href: "/admin/courses",
        },
    ];

    const contentStats = [
        { label: "Video Lectures", value: videosCount || 0, icon: Video, color: "text-blue-600 bg-blue-100" },
        { label: "PDF Documents", value: documentsCount || 0, icon: FileText, color: "text-green-600 bg-green-100" },
        { label: "Faculty Members", value: teachersCount || 0, icon: GraduationCap, color: "text-purple-600 bg-purple-100" },
        { label: "Pending Payments", value: pendingEnrollmentsCount || 0, icon: Clock, color: "text-yellow-600 bg-yellow-100" },
    ];

    const quickActions = [
        { label: "Create Course", href: "/admin/courses/new", icon: BookOpen, color: "bg-blue-600 hover:bg-blue-700" },
        { label: "Add Teacher", href: "/admin/homepage-teachers", icon: UserPlus, color: "bg-purple-600 hover:bg-purple-700" },
        { label: "Upload Video", href: "/admin/content/upload", icon: Video, color: "bg-green-600 hover:bg-green-700" },
        { label: "Write Blog", href: "/admin/blogs/new", icon: FileText, color: "bg-orange-600 hover:bg-orange-700" },
    ];

    const examCategories = [
        { name: "SSC", students: 45, color: "bg-blue-500" },
        { name: "Railway", students: 38, color: "bg-green-500" },
        { name: "Bank", students: 32, color: "bg-purple-500" },
        { name: "RPSC", students: 28, color: "bg-orange-500" },
        { name: "Police", students: 22, color: "bg-red-500" },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Welcome to Awasthi Classes Admin</h1>
                            <p className="text-white/80 mt-1">Manage your coaching institute efficiently</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-white/70">Today&apos;s Date</p>
                                <p className="font-semibold">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Calendar size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.changeType === "positive" ? "text-green-600" :
                                    stat.changeType === "negative" ? "text-red-600" : "text-gray-500"
                                }`}>
                                {stat.changeType === "positive" && <ArrowUpRight size={14} />}
                                {stat.changeType === "negative" && <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </Link>
                ))}
            </div>

            {/* Content Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {contentStats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target size={20} className="text-primary-600" />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className={`${action.color} text-white py-3 px-4 rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2`}
                        >
                            <action.icon size={18} />
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Enrollments */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <GraduationCap size={20} className="text-purple-600" />
                            Recent Enrollments
                        </h3>
                        <Link href="/admin/enrollments" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div className="p-5">
                        {recentEnrollments && recentEnrollments.length > 0 ? (
                            <div className="space-y-4">
                                {recentEnrollments.map((enrollment: any) => (
                                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {(enrollment.profiles?.full_name || enrollment.profiles?.email || "S").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {enrollment.profiles?.full_name || enrollment.profiles?.email?.split("@")[0]}
                                                </p>
                                                <p className="text-sm text-gray-500">{enrollment.courses?.title}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${enrollment.payment_status === "paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {enrollment.payment_status === "paid" ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                {enrollment.payment_status}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {enrollment.amount_paid ? `₹${enrollment.amount_paid}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <GraduationCap className="text-gray-400" size={28} />
                                </div>
                                <p className="text-gray-500">No enrollments yet</p>
                                <p className="text-sm text-gray-400">Students will appear here when they enroll</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Exam Categories Distribution */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Briefcase size={20} className="text-orange-600" />
                            Exam Categories
                        </h3>
                    </div>
                    <div className="p-5">
                        <div className="space-y-4">
                            {examCategories.map((exam) => (
                                <div key={exam.name} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${exam.color}`} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{exam.name}</span>
                                            <span className="text-sm text-gray-500">{exam.students} students</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${exam.color} rounded-full`}
                                                style={{ width: `${(exam.students / 50) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <Link
                                href="/admin/courses"
                                className="text-sm text-primary-600 hover:underline flex items-center justify-center gap-1"
                            >
                                Manage Courses <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Students */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <UserPlus size={20} className="text-blue-600" />
                            New Students
                        </h3>
                        <Link href="/admin/students" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div className="p-5">
                        {recentStudents && recentStudents.length > 0 ? (
                            <div className="space-y-3">
                                {recentStudents.map((student: any) => (
                                    <div key={student.id} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {(student.full_name || student.email || "S").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {student.full_name || student.email?.split("@")[0]}
                                                </p>
                                                <p className="text-xs text-gray-500">{student.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(student.created_at).toLocaleDateString("en-IN")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">No students yet</p>
                        )}
                    </div>
                </div>

                {/* Important Alerts / Tips */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Bell size={20} className="text-yellow-600" />
                            Important Tips
                        </h3>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Video className="text-white" size={16} />
                            </div>
                            <div>
                                <p className="font-medium text-blue-900 text-sm">Upload HD Videos</p>
                                <p className="text-xs text-blue-700">Use Bunny.net for fast video streaming</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="text-white" size={16} />
                            </div>
                            <div>
                                <p className="font-medium text-green-900 text-sm">Add PDF Notes</p>
                                <p className="text-xs text-green-700">Students love downloadable study materials</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Award className="text-white" size={16} />
                            </div>
                            <div>
                                <p className="font-medium text-purple-900 text-sm">Add Success Stories</p>
                                <p className="text-xs text-purple-700">Showcase selected students on homepage</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Target className="text-white" size={16} />
                            </div>
                            <div>
                                <p className="font-medium text-orange-900 text-sm">Create Mock Tests</p>
                                <p className="text-xs text-orange-700">Help students practice with exam-like tests</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Getting Started Guide */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
                    🚀 Getting Started Guide
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                        <div>
                            <p className="font-medium text-primary-900">Create Courses</p>
                            <p className="text-sm text-primary-700">Add SSC, Railway, Bank courses</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                        <div>
                            <p className="font-medium text-primary-900">Upload Content</p>
                            <p className="text-sm text-primary-700">Add videos & PDF notes</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                        <div>
                            <p className="font-medium text-primary-900">Add Teachers</p>
                            <p className="text-sm text-primary-700">Showcase your faculty</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                        <div>
                            <p className="font-medium text-primary-900">Publish & Share</p>
                            <p className="text-sm text-primary-700">Go live & get students</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
