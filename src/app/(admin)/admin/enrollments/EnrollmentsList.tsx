"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Search, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface Enrollment {
    id: string;
    user_id: string;
    course_id: string;
    payment_status: string;
    amount_paid: number;
    enrolled_at: string;
    profiles: {
        id: string;
        email: string;
        full_name: string;
    } | null;
    courses: {
        id: string;
        title: string;
        class: string;
    } | null;
}

export default function EnrollmentsList({ initialEnrollments }: { initialEnrollments: Enrollment[] }) {
    const router = useRouter();
    const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
    const [filter, setFilter] = useState<"all" | "pending" | "paid">("all");
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);

    const updatePaymentStatus = async (enrollmentId: string, status: "paid" | "failed") => {
        setUpdating(enrollmentId);
        const supabase = createClient();

        const { error } = await supabase
            .from("enrollments")
            .update({ payment_status: status })
            .eq("id", enrollmentId);

        if (!error) {
            setEnrollments(prev =>
                prev.map(e => e.id === enrollmentId ? { ...e, payment_status: status } : e)
            );
        } else {
            alert("Failed to update: " + error.message);
        }
        setUpdating(null);
    };

    const filteredEnrollments = enrollments.filter(e => {
        // Filter by status
        if (filter !== "all" && e.payment_status !== filter) return false;

        // Filter by search
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
            e.profiles?.email?.toLowerCase().includes(searchLower) ||
            e.profiles?.full_name?.toLowerCase().includes(searchLower) ||
            e.courses?.title?.toLowerCase().includes(searchLower)
        );
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Paid</span>;
            case "pending":
                return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">Pending</span>;
            case "failed":
                return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">Failed</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{status}</span>;
        }
    };

    const pendingCount = enrollments.filter(e => e.payment_status === "pending").length;

    return (
        <>
            {/* Stats */}
            {pendingCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-yellow-800 font-medium">
                        🔔 {pendingCount} enrollment{pendingCount > 1 ? "s" : ""} waiting for approval
                    </p>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex gap-2">
                        {(["all", "pending", "paid"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f
                                        ? "bg-primary-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                {f === "pending" && pendingCount > 0 && (
                                    <span className="ml-1 bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full text-xs">
                                        {pendingCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by email, name, or course..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => router.refresh()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Enrollments Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filteredEnrollments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {enrollments.length === 0
                            ? "No enrollments yet"
                            : "No enrollments match your filter"}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredEnrollments.map((enrollment) => (
                                <tr key={enrollment.id} className={`hover:bg-gray-50 ${enrollment.payment_status === "pending" ? "bg-yellow-50" : ""}`}>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">
                                            {enrollment.profiles?.full_name || "No Name"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {enrollment.profiles?.email || "No Email"}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">{enrollment.courses?.title || "Unknown"}</p>
                                        <p className="text-sm text-gray-500">{enrollment.courses?.class}</p>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        ₹{enrollment.amount_paid?.toLocaleString("en-IN") || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(enrollment.payment_status)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(enrollment.enrolled_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {enrollment.payment_status === "pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updatePaymentStatus(enrollment.id, "paid")}
                                                    disabled={updating === enrollment.id}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm"
                                                    title="Approve Payment"
                                                >
                                                    <CheckCircle size={16} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updatePaymentStatus(enrollment.id, "failed")}
                                                    disabled={updating === enrollment.id}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                                    title="Reject Payment"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        )}
                                        {enrollment.payment_status === "paid" && (
                                            <span className="text-green-600 text-sm font-medium">✓ Approved</span>
                                        )}
                                        {enrollment.payment_status === "failed" && (
                                            <button
                                                onClick={() => updatePaymentStatus(enrollment.id, "paid")}
                                                disabled={updating === enrollment.id}
                                                className="text-sm text-primary-600 hover:underline disabled:opacity-50"
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
