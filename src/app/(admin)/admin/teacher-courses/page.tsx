"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Clock, CheckCircle, XCircle, Eye, Loader2, BookOpen, Search, Filter, User, Calendar, Video, FileText, Target, IndianRupee, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TeacherCourse {
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
    submitted_at: string;
    teacher_id: string;
    created_at: string;
    teacher?: {
        full_name: string;
        email: string;
    };
}

export default function TeacherCoursesApprovalPage() {
    const supabase = createClient();
    const [courses, setCourses] = useState<TeacherCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
    const [searchQuery, setSearchQuery] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingCourse, setRejectingCourse] = useState<TeacherCourse | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        setLoading(true);

        // Fetch courses with teacher_id (teacher-created courses)
        const { data: coursesData } = await supabase
            .from("courses")
            .select("*")
            .not("teacher_id", "is", null)
            .order("submitted_at", { ascending: false });

        // Fetch teacher profiles
        const teacherIds = [...new Set(coursesData?.map(c => c.teacher_id).filter(Boolean))];

        let teacherProfiles: Record<string, any> = {};
        if (teacherIds.length > 0) {
            const { data: profiles } = await supabase
                .from("profiles")
                .select("id, full_name, email")
                .in("id", teacherIds);

            profiles?.forEach(p => {
                teacherProfiles[p.id] = p;
            });
        }

        // Combine data
        const coursesWithTeachers = coursesData?.map(course => ({
            ...course,
            teacher: teacherProfiles[course.teacher_id] || null,
        })) || [];

        setCourses(coursesWithTeachers);
        setLoading(false);
    }

    const filteredCourses = courses.filter(course => {
        const matchesFilter = filter === "all" || course.approval_status === filter;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.teacher?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.subject?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const pendingCount = courses.filter(c => c.approval_status === "pending").length;
    const approvedCount = courses.filter(c => c.approval_status === "approved").length;
    const rejectedCount = courses.filter(c => c.approval_status === "rejected").length;

    async function handleApprove(courseId: string) {
        setProcessingId(courseId);

        const { data: { user } } = await supabase.auth.getUser();

        await supabase
            .from("courses")
            .update({
                approval_status: "approved",
                is_published: true,
                reviewed_at: new Date().toISOString(),
                reviewed_by: user?.id,
            })
            .eq("id", courseId);

        fetchCourses();
        setProcessingId(null);
    }

    function openRejectModal(course: TeacherCourse) {
        setRejectingCourse(course);
        setRejectionReason("");
        setShowRejectModal(true);
    }

    async function handleReject() {
        if (!rejectingCourse || !rejectionReason.trim()) return;

        setProcessingId(rejectingCourse.id);

        const { data: { user } } = await supabase.auth.getUser();

        await supabase
            .from("courses")
            .update({
                approval_status: "rejected",
                rejection_reason: rejectionReason,
                is_published: false,
                reviewed_at: new Date().toISOString(),
                reviewed_by: user?.id,
            })
            .eq("id", rejectingCourse.id);

        setShowRejectModal(false);
        setRejectingCourse(null);
        setRejectionReason("");
        fetchCourses();
        setProcessingId(null);
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
            case "pending": return <Clock size={14} />;
            case "approved": return <CheckCircle size={14} />;
            case "rejected": return <XCircle size={14} />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Teacher Course Approvals</h2>
                    <p className="text-gray-500 mt-1">Review and approve courses submitted by teachers</p>
                </div>
                <button
                    onClick={fetchCourses}
                    className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                    <RefreshCw size={20} className="text-gray-600" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                            <p className="text-xs text-gray-500">Total Submissions</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                            <p className="text-xs text-gray-500">Pending Review</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                            <p className="text-xs text-gray-500">Approved</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <XCircle className="text-red-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                            <p className="text-xs text-gray-500">Rejected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by course title, teacher name, or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
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
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${filter === f
                                            ? f === "pending" ? "bg-yellow-500 text-white" :
                                                f === "approved" ? "bg-green-500 text-white" :
                                                    f === "rejected" ? "bg-red-500 text-white" :
                                                        "bg-primary-500 text-white"
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

            {/* Courses List */}
            {filteredCourses.length > 0 ? (
                <div className="space-y-4">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${course.approval_status === "pending" ? "border-yellow-200 ring-2 ring-yellow-100" : "border-gray-100"
                            }`}>
                            <div className="flex flex-col md:flex-row">
                                {/* Thumbnail */}
                                <div className="md:w-64 h-40 md:h-auto bg-gradient-to-br from-primary-500 to-blue-600 relative flex-shrink-0">
                                    {course.thumbnail_url ? (
                                        <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen className="text-white/50" size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(course.approval_status)}`}>
                                            {getStatusIcon(course.approval_status)}
                                            {course.approval_status.charAt(0).toUpperCase() + course.approval_status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-5">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                                            {course.description && (
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                                            )}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <Target size={10} />
                                                    {course.class || "General"}
                                                </span>
                                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <BookOpen size={10} />
                                                    {course.subject || "N/A"}
                                                </span>
                                                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <IndianRupee size={10} />
                                                    {course.price > 0 ? `₹${course.price}` : "Free"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <User size={14} />
                                                    {course.teacher?.full_name || "Unknown Teacher"}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {course.submitted_at ? new Date(course.submitted_at).toLocaleDateString("en-IN") : "N/A"}
                                                </span>
                                            </div>

                                            {/* Rejection Reason */}
                                            {course.approval_status === "rejected" && course.rejection_reason && (
                                                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                                                    <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason:</p>
                                                    <p className="text-sm text-red-700">{course.rejection_reason}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-row md:flex-col gap-2">
                                            <Link
                                                href={`/admin/courses/${course.id}`}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium flex items-center gap-1"
                                            >
                                                <Eye size={16} />
                                                View
                                            </Link>
                                            {course.approval_status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(course.id)}
                                                        disabled={processingId === course.id}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        {processingId === course.id ? (
                                                            <Loader2 className="animate-spin" size={16} />
                                                        ) : (
                                                            <CheckCircle size={16} />
                                                        )}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => openRejectModal(course)}
                                                        disabled={processingId === course.id}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        <XCircle size={16} />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-gray-400" size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {filter === "pending" ? "No pending courses" : "No courses found"}
                    </h3>
                    <p className="text-gray-500">
                        {filter === "pending"
                            ? "All teacher course submissions have been reviewed"
                            : "No courses match your search criteria"}
                    </p>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && rejectingCourse && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Reject Course</h3>
                            <p className="text-sm text-gray-500 mt-1">Provide a reason for rejection</p>
                        </div>
                        <div className="p-6">
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="font-medium text-gray-900">{rejectingCourse.title}</p>
                                <p className="text-sm text-gray-500">by {rejectingCourse.teacher?.full_name || "Unknown"}</p>
                            </div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Reason *
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explain why this course is being rejected..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                This reason will be shown to the teacher so they can make improvements.
                            </p>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={handleReject}
                                disabled={!rejectionReason.trim() || processingId === rejectingCourse.id}
                                className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processingId === rejectingCourse.id ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <XCircle size={20} />
                                )}
                                Reject Course
                            </button>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
