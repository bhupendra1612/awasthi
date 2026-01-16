"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Eye, Clock, CheckCircle, XCircle, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Course {
    id: string;
    title: string;
    description: string | null;
    class: string;
    subject: string;
    price: number;
    thumbnail_url: string | null;
    is_published: boolean;
    approval_status: string;
    rejection_reason: string | null;
    created_at: string;
}

export default function TeacherCoursesPage() {
    const supabase = createClient();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("courses")
            .select("*")
            .eq("teacher_id", user.id)
            .order("created_at", { ascending: false });

        setCourses(data || []);
        setLoading(false);
    }

    const filteredCourses = courses.filter(course => {
        if (filter === "all") return true;
        return course.approval_status === filter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                    <p className="text-gray-500 mt-1">Manage your courses and content</p>
                </div>
                <Link
                    href="/teacher/courses/new"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    New Course
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f
                                ? "bg-purple-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        <span className="ml-2 text-xs">
                            ({courses.filter(c => f === "all" ? true : c.approval_status === f).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {/* Thumbnail */}
                            <div className="aspect-video bg-gray-100 relative">
                                {course.thumbnail_url ? (
                                    <Image
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="text-gray-400" size={48} />
                                    </div>
                                )}
                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${course.approval_status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                            course.approval_status === "approved" ? "bg-green-100 text-green-700" :
                                                "bg-red-100 text-red-700"
                                        }`}>
                                        {course.approval_status === "pending" && <Clock size={12} />}
                                        {course.approval_status === "approved" && <CheckCircle size={12} />}
                                        {course.approval_status === "rejected" && <XCircle size={12} />}
                                        {course.approval_status}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">
                                    {course.class} • {course.subject} • ₹{course.price.toLocaleString("en-IN")}
                                </p>

                                {/* Rejection Reason */}
                                {course.approval_status === "rejected" && course.rejection_reason && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                        <p className="text-xs text-red-600 font-medium">Rejection Reason:</p>
                                        <p className="text-sm text-red-700">{course.rejection_reason}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/teacher/courses/${course.id}`}
                                        className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg hover:bg-purple-200 transition text-center text-sm font-medium flex items-center justify-center gap-1"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </Link>
                                    <Link
                                        href={`/teacher/courses/${course.id}/content`}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-center text-sm font-medium flex items-center justify-center gap-1"
                                    >
                                        <Eye size={16} />
                                        Content
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === "all" ? "No courses yet" : `No ${filter} courses`}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {filter === "all"
                            ? "Create your first course to get started"
                            : "No courses with this status"}
                    </p>
                    {filter === "all" && (
                        <Link
                            href="/teacher/courses/new"
                            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            Create Course
                        </Link>
                    )}
                </div>
            )}

            {/* Info Note */}
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-700">
                    <strong>Note:</strong> All new courses require admin approval before they become visible to students.
                    You can add content while waiting for approval.
                </p>
            </div>
        </div>
    );
}
