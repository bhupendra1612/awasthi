"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Clock, CheckCircle, XCircle, Video, FileText, Plus, Users, Award, ArrowRight, GraduationCap, Eye, Calendar, Target } from "lucide-react";
import Link from "next/link";

interface CourseStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalVideos: number;
    totalDocuments: number;
}

interface Course {
    id: string;
    title: string;
    class: string; // This stores exam category
    subject: string;
    is_published: boolean;
    created_at: string;
    price: number;
}

export default function TeacherDashboard() {
    const supabase = createClient();
    const [stats, setStats] = useState<CourseStats>({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalVideos: 0,
        totalDocuments: 0,
    });
    const [recentCourses, setRecentCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [teacherName, setTeacherName] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get teacher profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

        setTeacherName(profile?.full_name || "Teacher");

        // Get all courses (since teacher_id column doesn't exist)
        const { data: courses } = await supabase
            .from("courses")
            .select("*")
            .order("created_at", { ascending: false });

        // Get video count
        const courseIds = courses?.map(c => c.id) || [];
        const { count: videoCount } = await supabase
            .from("videos")
            .select("*", { count: "exact", head: true })
            .in("course_id", courseIds.length > 0 ? courseIds : ["none"]);

        // Get document count
        const { count: docCount } = await supabase
            .from("documents")
            .select("*", { count: "exact", head: true })
            .in("course_id", courseIds.length > 0 ? courseIds : ["none"]);

        setStats({
            total: courses?.length || 0,
            pending: courses?.filter(c => !c.is_published).length || 0, // Draft courses
            approved: courses?.filter(c => c.is_published).length || 0, // Published courses
            rejected: 0, // No rejection system in current schema
            totalVideos: videoCount || 0,
            totalDocuments: docCount || 0,
        });

        setRecentCourses(courses?.slice(0, 5) || []);
        setLoading(false);
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "approved": return "bg-green-100 text-green-700 border-green-200";
            case "rejected": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending": return <Clock size={12} />;
            case "approved": return <CheckCircle size={12} />;
            case "rejected": return <XCircle size={12} />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">👋</span>
                        <h2 className="text-2xl font-bold">Welcome back, {teacherName.split(" ")[0]}!</h2>
                    </div>
                    <p className="text-primary-100 max-w-xl">
                        Create and manage courses for government exam preparation. Your courses help students prepare for SSC, Railway, Bank, RPSC, and other competitive exams.
                    </p>
                    <div className="flex gap-3 mt-4">
                        <Link
                            href="/teacher/courses/new"
                            className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Create Course
                        </Link>
                        <Link
                            href="/teacher/courses"
                            className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition flex items-center gap-2"
                        >
                            <Eye size={18} />
                            View All Courses
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <BookOpen className="text-white" size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                            <Clock className="text-white" size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Draft</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                            <CheckCircle className="text-white" size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Published</p>
                            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                            <XCircle className="text-white" size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Rejected</p>
                            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Video className="text-white" size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Videos</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.totalVideos}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <FileText className="text-white" size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Documents</p>
                            <p className="text-2xl font-bold text-indigo-600">{stats.totalDocuments}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/teacher/courses/new"
                    className="group bg-gradient-to-br from-primary-600 to-blue-600 text-white rounded-xl p-6 hover:shadow-xl hover:shadow-primary-600/30 transition-all hover:-translate-y-1"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Create New Course</h3>
                            <p className="text-primary-100 text-sm">Add course for government exams</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-primary-100">
                        <span>Get started</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                <Link
                    href="/teacher/courses"
                    className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all hover:-translate-y-1"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BookOpen className="text-purple-600" size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">Manage Courses</h3>
                            <p className="text-gray-500 text-sm">View and edit your courses</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-primary-600">
                        <span>View all</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                <Link
                    href="/teacher/profile"
                    className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all hover:-translate-y-1"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <GraduationCap className="text-green-600" size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">My Profile</h3>
                            <p className="text-gray-500 text-sm">Update your teacher profile</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                        <span>Edit profile</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>

            {/* Recent Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Recent Courses</h3>
                        <p className="text-sm text-gray-500">Your latest course submissions</p>
                    </div>
                    <Link
                        href="/teacher/courses"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                        View All
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {recentCourses.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {recentCourses.map((course) => (
                            <Link
                                key={course.id}
                                href={`/teacher/courses/${course.id}`}
                                className="flex items-center justify-between p-5 hover:bg-gray-50 transition group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <BookOpen className="text-primary-600" size={22} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition">{course.title}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Target size={12} />
                                                {course.class || "General"}
                                            </span>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <BookOpen size={12} />
                                                {course.subject || "N/A"}
                                            </span>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(course.created_at).toLocaleDateString("en-IN")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-900">
                                        {course.price > 0 ? `₹${course.price}` : "Free"}
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(course.is_published ? "approved" : "pending")}`}>
                                        {getStatusIcon(course.is_published ? "approved" : "pending")}
                                        {course.is_published ? "Published" : "Draft"}
                                    </span>
                                    <ArrowRight size={18} className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="text-gray-400" size={28} />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">No courses yet</h4>
                        <p className="text-gray-500 mb-4">Create your first course to help students prepare for government exams</p>
                        <Link
                            href="/teacher/courses/new"
                            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                        >
                            <Plus size={18} />
                            Create First Course
                        </Link>
                    </div>
                )}
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Award className="text-yellow-600" size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">💡 Tips for Creating Great Courses</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Focus on specific exam patterns (SSC, Railway, Bank, RPSC, etc.)</li>
                            <li>• Include practice questions and previous year papers</li>
                            <li>• Add clear explanations with examples</li>
                            <li>• Keep videos concise and topic-focused</li>
                            <li>• Provide downloadable PDF notes for revision</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
