"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Clock, CheckCircle, XCircle, Loader2, BookOpen, Search, Filter, Video, Target, Calendar } from "lucide-react";
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
    approval_status: string | null;
    rejection_reason: string | null;
    created_at: string;
}

export default function TeacherCoursesPage() {
    const supabase = createClient();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [searchQuery, setSearchQuery] = useState("");

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

    const getStatus = (course: Course) => {
        return course.approval_status || (course.is_published ? "approved" : "pending");
    };

    const filteredCourses = courses.filter(course => {
        const status = getStatus(course);
        const matchesFilter = filter === "all" || status === filter;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.class?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (course: Course) => {
        const status = getStatus(course);
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "approved": return "bg-green-100 text-green-700 border-green-200";
            case "rejected": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (course: Course) => {
        const status = getStatus(course);
        switch (status) {
            case "pending": return <Clock size={12} />;
            case "approved": return <CheckCircle size={12} />;
            case "rejected": return <XCircle size={12} />;
            default: return <Clock size={12} />;
        }
    };

    const getStatusLabel = (course: Course) => {
        const status = getStatus(course);
        switch (status) {
            case "pending": return "Pending Approval";
            case "approved": return "Approved";
            case "rejected": return "Rejected";
            default: return "Pending";
        }
    };

    const getFilterColor = (f: string) => {
        switch (f) {
            case "pending": return "from-yellow-500 to-orange-500";
            case "approved": return "from-green-500 to-emerald-500";
            case "rejected": return "from-red-500 to-pink-500";
            default: return "from-primary-500 to-blue-500";
        }
    };

    const pendingCount = courses.filter(c => getStatus(c) === "pending").length;
    const approvedCount = courses.filter(c => getStatus(c) === "approved").length;
    const rejectedCount = courses.filter(c => getStatus(c) === "rejected").length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary-600 mx-auto mb-4" size={40} />
                    <p className="text-gray-500">Loading your courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                    <p className="text-gray-500 mt-1">Manage your courses for government exam preparation</p>
                </div>
                <Link
                    href="/teacher/courses/new"
                    className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition-all flex items-center gap-2 font-medium"
                >
                    <Plus size={20} />
                    New Course
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses by title, subject, or exam..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div className="flex gap-2">
                        {(["all", "pending", "approved", "rejected"] as const).map((f) => {
                            const count = f === "all" ? courses.length :
                                f === "pending" ? pendingCount :
                                    f === "approved" ? approvedCount : rejectedCount;
                            return (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filter === f
                                        ? `bg-gradient-to-r ${getFilterColor(f)} text-white shadow-lg`
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {f === "pending" && <Clock size={14} />}
                                    {f === "approved" && <CheckCircle size={14} />}
                                    {f === "rejected" && <XCircle size={14} />}
                                    {f === "all" && <Filter size={14} />}
                                    <span className="hidden sm:inline capitalize">{f}</span>
                                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className={`bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-lg transition-all group ${getStatus(course) === "rejected" ? "border-red-200" :
                                getStatus(course) === "pending" ? "border-yellow-200" : "border-gray-100"
                            }`}>
                            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                                {course.thumbnail_url ? (
                                    <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/80 rounded-xl flex items-center justify-center">
                                            <BookOpen className="text-primary-500" size={32} />
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(course)}`}>
                                        {getStatusIcon(course)}
                                        {getStatusLabel(course)}
                                    </span>
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900">
                                        {course.price > 0 ? `₹${course.price.toLocaleString("en-IN")}` : "Free"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition line-clamp-1">{course.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full flex items-center gap-1">
                                        <Target size={10} />
                                        {course.class || "General"}
                                    </span>
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                                        <BookOpen size={10} />
                                        {course.subject || "N/A"}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                                    <Calendar size={12} />
                                    Created {new Date(course.created_at).toLocaleDateString("en-IN")}
                                </p>

                                {/* Rejection Reason */}
                                {getStatus(course) === "rejected" && course.rejection_reason && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                        <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason:</p>
                                        <p className="text-sm text-red-700 line-clamp-2">{course.rejection_reason}</p>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Link
                                        href={`/teacher/courses/${course.id}`}
                                        className="flex-1 bg-gradient-to-r from-primary-50 to-blue-50 text-primary-700 py-2.5 rounded-lg hover:from-primary-100 hover:to-blue-100 transition text-center text-sm font-medium flex items-center justify-center gap-1"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </Link>
                                    <Link
                                        href={`/teacher/courses/${course.id}/content`}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition text-center text-sm font-medium flex items-center justify-center gap-1"
                                    >
                                        <Video size={16} />
                                        Content
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-primary-500" size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {filter === "all" && !searchQuery ? "No courses yet" : "No courses found"}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        {filter === "all" && !searchQuery
                            ? "Create your first course to help students prepare for government exams"
                            : `No ${filter} courses found`}
                    </p>
                    {filter === "all" && !searchQuery && (
                        <Link
                            href="/teacher/courses/new"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                        >
                            <Plus size={20} />
                            Create Your First Course
                        </Link>
                    )}
                </div>
            )}

            {/* Info Note */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="text-yellow-600" size={20} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Course Approval Process</h4>
                        <p className="text-sm text-gray-600">
                            All courses require admin approval before they become visible to students. You can add videos and documents while waiting for approval. If rejected, make the necessary changes and resubmit.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
