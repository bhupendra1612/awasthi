"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Clock, CheckCircle, XCircle, Video, FileText, Plus } from "lucide-react";
import Link from "next/link";

interface CourseStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalContent: number;
}

export default function TeacherDashboard() {
    const supabase = createClient();
    const [stats, setStats] = useState<CourseStats>({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalContent: 0,
    });
    const [recentCourses, setRecentCourses] = useState<any[]>([]);
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

        // Get courses
        const { data: courses } = await supabase
            .from("courses")
            .select("*")
            .eq("teacher_id", user.id)
            .order("created_at", { ascending: false });

        // Get content count
        const courseIds = courses?.map(c => c.id) || [];
        const { count: contentCount } = await supabase
            .from("course_content")
            .select("*", { count: "exact", head: true })
            .in("course_id", courseIds.length > 0 ? courseIds : ["none"]);

        setStats({
            total: courses?.length || 0,
            pending: courses?.filter(c => c.approval_status === "pending").length || 0,
            approved: courses?.filter(c => c.approval_status === "approved").length || 0,
            rejected: courses?.filter(c => c.approval_status === "rejected").length || 0,
            totalContent: contentCount || 0,
        });

        setRecentCourses(courses?.slice(0, 5) || []);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Welcome, {teacherName}!</h2>
                <p className="text-gray-500 mt-1">Manage your courses and content</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Approved</p>
                            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <XCircle className="text-red-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Rejected</p>
                            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Video className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Content</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.totalContent}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <Link
                    href="/teacher/courses/new"
                    className="bg-purple-600 text-white rounded-xl p-6 hover:bg-purple-700 transition flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Plus size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Create New Course</h3>
                        <p className="text-purple-200 text-sm">Add a new course for approval</p>
                    </div>
                </Link>
                <Link
                    href="/teacher/courses"
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-gray-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">Manage Courses</h3>
                        <p className="text-gray-500 text-sm">View and edit your courses</p>
                    </div>
                </Link>
            </div>

            {/* Recent Courses */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Courses</h3>
                </div>
                {recentCourses.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {recentCourses.map((course) => (
                            <Link
                                key={course.id}
                                href={`/teacher/courses/${course.id}`}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <BookOpen className="text-purple-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{course.title}</p>
                                        <p className="text-sm text-gray-500">{course.class} • {course.subject}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.approval_status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                        course.approval_status === "approved" ? "bg-green-100 text-green-700" :
                                            "bg-red-100 text-red-700"
                                    }`}>
                                    {course.approval_status}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No courses yet. Create your first course!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
