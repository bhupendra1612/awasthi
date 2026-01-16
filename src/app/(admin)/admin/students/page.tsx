"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Search, Filter, Calendar, IndianRupee, BookOpen, TrendingUp, Download } from "lucide-react";

interface Enrollment {
    id: string;
    course_id: string;
    payment_status: string;
    amount_paid: number | null;
    enrolled_at: string;
    courses: {
        title: string;
        price: number;
    } | null;
}

interface Student {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
    enrollments: Enrollment[];
}

type DateFilter = "7" | "30" | "90" | "365" | "all" | "custom";
type StudentFilter = "all" | "paid" | "free";

export default function StudentsPage() {
    const supabase = createClient();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [studentFilter, setStudentFilter] = useState<StudentFilter>("all");
    const [dateFilter, setDateFilter] = useState<DateFilter>("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [showCustomDate, setShowCustomDate] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    async function fetchStudents() {
        // First get all enrollments with user info
        const { data: enrollments } = await supabase
            .from("enrollments")
            .select(`
                id,
                user_id,
                course_id,
                payment_status,
                amount_paid,
                enrolled_at,
                courses:course_id(title, price)
            `);

        // Get unique user IDs from enrollments
        const userIds = [...new Set(enrollments?.map(e => e.user_id) || [])];

        // Fetch profiles for these users
        const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .in("id", userIds.length > 0 ? userIds : ["none"]);

        // Also fetch profiles with role = student who might not have enrollments yet
        const { data: studentProfiles } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "student");

        // Combine and deduplicate profiles
        const allProfiles = new Map<string, any>();

        profiles?.forEach(p => allProfiles.set(p.id, p));
        studentProfiles?.forEach(p => allProfiles.set(p.id, p));

        // Build student list with their enrollments
        const studentList: Student[] = [];

        allProfiles.forEach((profile) => {
            const userEnrollments = enrollments?.filter(e => e.user_id === profile.id) || [];
            studentList.push({
                id: profile.id,
                email: profile.email || "",
                full_name: profile.full_name,
                created_at: profile.created_at,
                enrollments: userEnrollments.map(e => ({
                    id: e.id,
                    course_id: e.course_id,
                    payment_status: e.payment_status,
                    amount_paid: e.amount_paid,
                    enrolled_at: e.enrolled_at,
                    courses: e.courses as unknown as { title: string; price: number } | null,
                })),
            });
        });

        // Sort by created_at descending
        studentList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setStudents(studentList);
        setLoading(false);
    }

    // Get date range based on filter
    const getDateRange = () => {
        const now = new Date();
        let startDate: Date | null = null;
        let endDate: Date = now;

        if (dateFilter === "custom" && customStartDate && customEndDate) {
            startDate = new Date(customStartDate);
            endDate = new Date(customEndDate);
            endDate.setHours(23, 59, 59, 999);
        } else if (dateFilter !== "all") {
            const days = parseInt(dateFilter);
            startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        }

        return { startDate, endDate };
    };

    // Filter students based on criteria
    const filteredStudents = students.filter(student => {
        // Search filter
        const matchesSearch =
            (student.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());

        // Student type filter (paid/free)
        let matchesType = true;
        if (studentFilter === "paid") {
            matchesType = student.enrollments?.some(e => e.payment_status === "paid" && (e.amount_paid || 0) > 0) || false;
        } else if (studentFilter === "free") {
            const hasPaidEnrollment = student.enrollments?.some(e => e.payment_status === "paid" && (e.amount_paid || 0) > 0);
            matchesType = !hasPaidEnrollment;
        }

        // Date filter
        let matchesDate = true;
        const { startDate, endDate } = getDateRange();
        if (startDate) {
            const studentDate = new Date(student.created_at);
            matchesDate = studentDate >= startDate && studentDate <= endDate;
        }

        return matchesSearch && matchesType && matchesDate;
    });

    // Calculate stats
    const calculateStats = () => {
        const { startDate, endDate } = getDateRange();

        let relevantStudents = students;
        if (startDate) {
            relevantStudents = students.filter(s => {
                const date = new Date(s.created_at);
                return date >= startDate && date <= endDate;
            });
        }

        const totalStudents = relevantStudents.length;

        let totalRevenue = 0;
        let totalPaidEnrollments = 0;
        let paidStudents = 0;
        let freeStudents = 0;

        relevantStudents.forEach(student => {
            let hasPaid = false;
            student.enrollments?.forEach(enrollment => {
                if (enrollment.payment_status === "paid" && enrollment.amount_paid) {
                    // Check if enrollment is within date range
                    if (startDate) {
                        const enrollDate = new Date(enrollment.enrolled_at);
                        if (enrollDate >= startDate && enrollDate <= endDate) {
                            totalRevenue += enrollment.amount_paid;
                            totalPaidEnrollments++;
                        }
                    } else {
                        totalRevenue += enrollment.amount_paid;
                        totalPaidEnrollments++;
                    }
                    hasPaid = true;
                }
            });
            if (hasPaid) paidStudents++;
            else freeStudents++;
        });

        return {
            totalStudents,
            paidStudents,
            freeStudents,
            totalRevenue,
            totalPaidEnrollments,
        };
    };

    const stats = calculateStats();

    // Get student stats
    const getStudentStats = (student: Student) => {
        let totalPaid = 0;
        let paidCourses = 0;
        let freeCourses = 0;

        student.enrollments?.forEach(enrollment => {
            if (enrollment.payment_status === "paid" && enrollment.amount_paid) {
                totalPaid += enrollment.amount_paid;
                paidCourses++;
            } else {
                freeCourses++;
            }
        });

        return { totalPaid, paidCourses, freeCourses, totalCourses: paidCourses + freeCourses };
    };

    const handleDateFilterChange = (value: DateFilter) => {
        setDateFilter(value);
        if (value === "custom") {
            setShowCustomDate(true);
        } else {
            setShowCustomDate(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Students</h2>
                    <p className="text-gray-500 mt-1">Manage student accounts and track revenue</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Students</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <IndianRupee className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Paid Students</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.paidStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Users className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Free Students</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.freeStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="text-red-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Paid Enrollments</p>
                            <p className="text-2xl font-bold text-red-600">{stats.totalPaidEnrollments}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Student Type Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Type</label>
                        <select
                            value={studentFilter}
                            onChange={(e) => setStudentFilter(e.target.value as StudentFilter)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="all">All Students</option>
                            <option value="paid">Paid Students</option>
                            <option value="free">Free Students</option>
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                        <select
                            value={dateFilter}
                            onChange={(e) => handleDateFilterChange(e.target.value as DateFilter)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="all">All Time</option>
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="365">Last 1 Year</option>
                            <option value="custom">Custom Date</option>
                        </select>
                    </div>

                    {/* Custom Date Range */}
                    {showCustomDate && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Students Table */}
            {filteredStudents.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Courses</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Total Paid</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Enrolled Courses</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStudents.map((student) => {
                                const studentStats = getStudentStats(student);
                                return (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <span className="text-primary-600 font-medium">
                                                        {(student.full_name || student.email || "?").charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-900 block">
                                                        {student.full_name || "No name"}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded ${studentStats.paidCourses > 0
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                        }`}>
                                                        {studentStats.paidCourses > 0 ? "Paid" : "Free"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">{student.email}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900">{studentStats.totalCourses}</span>
                                                <span className="text-xs text-gray-500">
                                                    ({studentStats.paidCourses} paid, {studentStats.freeCourses} free)
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-semibold ${studentStats.totalPaid > 0 ? "text-green-600" : "text-gray-400"}`}>
                                                ₹{studentStats.totalPaid.toLocaleString("en-IN")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.enrollments && student.enrollments.length > 0 ? (
                                                <div className="space-y-1">
                                                    {student.enrollments.slice(0, 2).map((enrollment) => (
                                                        <span
                                                            key={enrollment.id}
                                                            className={`inline-block text-xs px-2 py-1 rounded mr-1 ${enrollment.payment_status === "paid"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                                }`}
                                                        >
                                                            {enrollment.courses?.title || "Unknown"}
                                                        </span>
                                                    ))}
                                                    {student.enrollments.length > 2 && (
                                                        <span className="text-xs text-gray-500">
                                                            +{student.enrollments.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No enrollments</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(student.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchQuery || studentFilter !== "all" || dateFilter !== "all"
                            ? "No students found"
                            : "No students yet"}
                    </h3>
                    <p className="text-gray-500">
                        {searchQuery || studentFilter !== "all" || dateFilter !== "all"
                            ? "Try adjusting your filters"
                            : "Students will appear here when they sign up"}
                    </p>
                </div>
            )}

            {/* Summary Footer */}
            {filteredStudents.length > 0 && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-medium">{filteredStudents.length}</span> of{" "}
                        <span className="font-medium">{students.length}</span> students
                    </p>
                    <p className="text-sm text-gray-600">
                        {dateFilter !== "all" && (
                            <span>
                                Revenue in selected period:{" "}
                                <span className="font-semibold text-green-600">
                                    ₹{stats.totalRevenue.toLocaleString("en-IN")}
                                </span>
                            </span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
