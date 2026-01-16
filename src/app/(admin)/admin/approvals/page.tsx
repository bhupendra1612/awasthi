"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Loader2, Clock, Eye, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PendingCourse {
    id: string;
    title: string;
    description: string | null;
    class: string;
    subject: string;
    price: number;
    thumbnail_url: string | null;
    approval_status: string;
    created_at: string;
    teacher_id: string;
    teacher?: {
        full_name: string | null;
        email: string;
        subject: string | null;
    };
}

export default function ApprovalsPage() {
    const supabase = createClient();
    const [courses, setCourses] = useState<PendingCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

    useEffect(() => {
        fetchCourses();
    }, [filter]);

    async function fetchCourses() {
        let query = supabase
            .from("courses")
            .select("*")
            .not("teacher_id", "is", null)
            .order("created_at", { ascending: false });

        if (filter !== "all") {
            query = query.eq("approval_status", filter);
        }

        const { data: coursesData } = await query;

        // Fetch teacher profiles
        const teacherIds = [...new Set(coursesData?.map(c => c.teacher_id).filter(Boolean) || [])];
        const { data: teachers } = await supabase
            .from("profiles")
            .select("id, full_name, email, subject")
            .in("id", teacherIds.length > 0 ? teacherIds : ["none"]);

        const coursesWithTeachers = (coursesData || []).map(course => ({
            ...course,
            teacher: teachers?.find(t => t.id === course.teacher_id),
        }));

        setCourses(coursesWithTeachers);
        setLoading(false);
    }

    const handleApprove = async (courseId: string) => {
        setProcessing(courseId);
        try {
            const { error } = await supabase
                .from("courses")
                .update({
                    approval_status: "approved",
                    rejection_reason: null,
                })
                .eq("id", courseId);

            if (error) throw error;
            fetchCourses();
        } catch (err) {
            console.error("Approve error:", err);
            alert("Failed to approve course");
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (courseId: string) => {
        if (!rejectionReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        setProcessing(courseId);
        try {
            const { error } = await supabase
                .from("courses")
                .update({
                    approval_status: "rejected",
                    rejection_reason: rejectionReason,
                    is_published: false,
                })
                .eq("id", courseId);

            if (error) throw error;
            setShowRejectModal(null);
            setRejectionReason("");
            fetchCourses();
        } catch (err) {
            console.error("Reject error:", err);
            alert("Failed to reject course");
        } finally {
            setProcessing(null);
        }
    };

    const stats = {
        pending: courses.filter(c => c.approval_status === "pending").length,
        approved: courses.filter(c => c.approval_status === "approved").length,
        rejected: courses.filter(c => c.approval_status === "rejected").length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Course Approvals</h2>
                <p className="text-gray-500 mt-1">Review and approve courses submitted by teachers</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div
                    onClick={() => setFilter("pending")}
                    className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition ${filter === "pending" ? "ring-2 ring-yellow-500" : ""}`}
                >
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
                <div
                    onClick={() => setFilter("approved")}
                    className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition ${filter === "approved" ? "ring-2 ring-green-500" : ""}`}
                >
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
                <div
                    onClick={() => setFilter("rejected")}
                    className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition ${filter === "rejected" ? "ring-2 ring-red-500" : ""}`}
                >
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
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f
                                ? "bg-primary-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Course</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Please provide a reason for rejection. This will be shown to the teacher.
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleReject(showRejectModal)}
                                disabled={processing === showRejectModal}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {processing === showRejectModal ? "Rejecting..." : "Reject Course"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectModal(null);
                                    setRejectionReason("");
                                }}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Courses List */}
            {courses.length > 0 ? (
                <div className="space-y-4">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex gap-6">
                                {/* Thumbnail */}
                                <div className="w-48 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {course.thumbnail_url ? (
                                        <Image
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            width={192}
                                            height={112}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="text-gray-400" size={32} />
                                        </div>
                                    )}
                                </div>

                                {/* Course Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {course.class} • {course.subject} • ₹{course.price.toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.approval_status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                course.approval_status === "approved" ? "bg-green-100 text-green-700" :
                                                    "bg-red-100 text-red-700"
                                            }`}>
                                            {course.approval_status.charAt(0).toUpperCase() + course.approval_status.slice(1)}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                        {course.description || "No description provided"}
                                    </p>

                                    {/* Teacher Info */}
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                        <span>By:</span>
                                        <span className="font-medium text-gray-700">
                                            {course.teacher?.full_name || course.teacher?.email || "Unknown Teacher"}
                                        </span>
                                        {course.teacher?.subject && (
                                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                                                {course.teacher.subject}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex items-center gap-3">
                                        {course.approval_status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(course.id)}
                                                    disabled={processing === course.id}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {processing === course.id ? (
                                                        <Loader2 className="animate-spin" size={16} />
                                                    ) : (
                                                        <CheckCircle size={16} />
                                                    )}
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => setShowRejectModal(course.id)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                                                >
                                                    <XCircle size={16} />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {course.approval_status === "rejected" && (
                                            <button
                                                onClick={() => handleApprove(course.id)}
                                                disabled={processing === course.id}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <CheckCircle size={16} />
                                                Approve Now
                                            </button>
                                        )}
                                        <Link
                                            href={`/admin/courses/${course.id}/content`}
                                            className="text-primary-600 hover:underline text-sm flex items-center gap-1"
                                        >
                                            <Eye size={16} />
                                            View Content
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses to review</h3>
                    <p className="text-gray-500">
                        {filter === "pending"
                            ? "No pending courses from teachers"
                            : `No ${filter} courses found`}
                    </p>
                </div>
            )}
        </div>
    );
}
