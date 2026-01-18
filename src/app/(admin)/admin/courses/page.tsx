"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import {
    Plus, Edit, Eye, EyeOff, BookOpen, Video, Users, Search,
    Filter, Grid, List, Sparkles, IndianRupee, Clock, FileText,
    TrendingUp, Award, Target, ChevronDown, X, RefreshCw, Loader2, UserCircle, Shield
} from "lucide-react";
import DeleteCourseButton from "@/components/admin/DeleteCourseButton";
import TogglePublishButton from "@/components/admin/TogglePublishButton";

interface Course {
    id: string;
    title: string;
    description: string;
    class: string;
    subject: string;
    price: number;
    original_price: number;
    thumbnail_url: string;
    is_published: boolean;
    is_combo: boolean;
    is_featured: boolean;
    duration: string;
    created_at: string;
    created_by: string | null;
    created_by_role: string | null;
    creator?: {
        full_name: string;
        email: string;
    };
}

// Exam categories for government exams
const EXAM_CATEGORIES = [
    { value: "", label: "All Categories" },
    { value: "SSC", label: "SSC (CGL, CHSL, MTS)" },
    { value: "Railway", label: "Railway (NTPC, Group D)" },
    { value: "Bank", label: "Banking (IBPS, SBI)" },
    { value: "RPSC", label: "RPSC (RAS, 1st/2nd Grade)" },
    { value: "RSMSSB", label: "RSMSSB (Patwari, LDC)" },
    { value: "Police", label: "Police (Constable, SI)" },
    { value: "UPSC", label: "UPSC (Civil Services)" },
    { value: "Teaching", label: "Teaching (REET, CTET)" },
    { value: "Defence", label: "Defence (CDS, NDA)" },
];

// Subjects for government exams
const SUBJECTS = [
    { value: "", label: "All Subjects" },
    { value: "General Knowledge", label: "General Knowledge" },
    { value: "Reasoning", label: "Reasoning & Logic" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Current Affairs", label: "Current Affairs" },
    { value: "Computer", label: "Computer Knowledge" },
    { value: "Complete", label: "Complete Course" },
];

const categoryColors: Record<string, string> = {
    "SSC": "bg-blue-100 text-blue-700 border-blue-200",
    "Railway": "bg-green-100 text-green-700 border-green-200",
    "Bank": "bg-purple-100 text-purple-700 border-purple-200",
    "RPSC": "bg-orange-100 text-orange-700 border-orange-200",
    "RSMSSB": "bg-pink-100 text-pink-700 border-pink-200",
    "Police": "bg-red-100 text-red-700 border-red-200",
    "UPSC": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "Teaching": "bg-cyan-100 text-cyan-700 border-cyan-200",
    "Defence": "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export default function CoursesPage() {
    const supabase = createClient();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
    const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
    const [creatorFilter, setCreatorFilter] = useState<"all" | "admin" | "teacher">("all");
    const [showFilters, setShowFilters] = useState(false);

    // Stats
    const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});
    const [videoCounts, setVideoCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        setLoading(true);

        const { data: coursesData } = await supabase
            .from("courses")
            .select(`
                *,
                creator:created_by(full_name, email)
            `)
            .order("created_at", { ascending: false });

        const { data: enrollments } = await supabase
            .from("enrollments")
            .select("course_id")
            .eq("payment_status", "paid");

        const { data: videos } = await supabase
            .from("videos")
            .select("course_id");

        const enrollCounts: Record<string, number> = {};
        enrollments?.forEach(e => {
            enrollCounts[e.course_id] = (enrollCounts[e.course_id] || 0) + 1;
        });

        const vidCounts: Record<string, number> = {};
        videos?.forEach(v => {
            vidCounts[v.course_id] = (vidCounts[v.course_id] || 0) + 1;
        });

        setCourses(coursesData || []);
        setEnrollmentCounts(enrollCounts);
        setVideoCounts(vidCounts);
        setLoading(false);
    }

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.subject?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || course.class === categoryFilter;
        const matchesSubject = !subjectFilter || course.subject?.includes(subjectFilter);
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "published" && course.is_published) ||
            (statusFilter === "draft" && !course.is_published);
        const matchesPrice = priceFilter === "all" ||
            (priceFilter === "free" && course.price === 0) ||
            (priceFilter === "paid" && course.price > 0);
        const matchesCreator = creatorFilter === "all" ||
            (creatorFilter === "admin" && course.created_by_role === "admin") ||
            (creatorFilter === "teacher" && course.created_by_role === "teacher");

        return matchesSearch && matchesCategory && matchesSubject && matchesStatus && matchesPrice && matchesCreator;
    });

    // Stats
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.is_published).length;
    const draftCourses = totalCourses - publishedCourses;
    const totalEnrollments = Object.values(enrollmentCounts).reduce((a, b) => a + b, 0);
    const totalRevenue = courses.reduce((sum, c) => sum + (c.price * (enrollmentCounts[c.id] || 0)), 0);

    const clearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("");
        setSubjectFilter("");
        setStatusFilter("all");
        setPriceFilter("all");
        setCreatorFilter("all");
    };

    const hasActiveFilters = searchQuery || categoryFilter || subjectFilter || statusFilter !== "all" || priceFilter !== "all" || creatorFilter !== "all";

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
                    <p className="text-gray-500 mt-1">Manage government exam preparation courses</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchCourses} className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <RefreshCw size={20} className="text-gray-600" />
                    </button>
                    <Link
                        href="/admin/courses/new"
                        className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 font-medium"
                    >
                        <Plus size={20} /> New Course
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
                            <p className="text-xs text-gray-500">Total Courses</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Eye className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{publishedCourses}</p>
                            <p className="text-xs text-gray-500">Published</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <EyeOff className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{draftCourses}</p>
                            <p className="text-xs text-gray-500">Drafts</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{totalEnrollments}</p>
                            <p className="text-xs text-gray-500">Enrollments</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <IndianRupee className="text-emerald-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-gray-500">Revenue</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="flex-1 min-w-[250px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses by title or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    {/* Quick Filters */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                        {EXAM_CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "draft")}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>

                    <select
                        value={creatorFilter}
                        onChange={(e) => setCreatorFilter(e.target.value as "all" | "admin" | "teacher")}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                        <option value="all">All Creators</option>
                        <option value="admin">Admin Created</option>
                        <option value="teacher">Teacher Created</option>
                    </select>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition ${showFilters ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                        <Filter size={18} />
                        More Filters
                        {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full"></span>}
                    </button>

                    {/* View Toggle */}
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2.5 ${viewMode === "grid" ? "bg-primary-100 text-primary-600" : "hover:bg-gray-50"}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2.5 ${viewMode === "list" ? "bg-primary-100 text-primary-600" : "hover:bg-gray-50"}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Extended Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-center">
                        <select
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                        >
                            {SUBJECTS.map(sub => (
                                <option key={sub.value} value={sub.value}>{sub.label}</option>
                            ))}
                        </select>

                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value as "all" | "free" | "paid")}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                        >
                            <option value="all">All Prices</option>
                            <option value="free">Free Courses</option>
                            <option value="paid">Paid Courses</option>
                        </select>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition"
                            >
                                <X size={18} /> Clear All Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500">Active filters:</span>
                        {searchQuery && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center gap-1">
                                Search: {searchQuery}
                                <button onClick={() => setSearchQuery("")}><X size={14} /></button>
                            </span>
                        )}
                        {categoryFilter && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm flex items-center gap-1">
                                {categoryFilter}
                                <button onClick={() => setCategoryFilter("")}><X size={14} /></button>
                            </span>
                        )}
                        {statusFilter !== "all" && (
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm flex items-center gap-1">
                                {statusFilter}
                                <button onClick={() => setStatusFilter("all")}><X size={14} /></button>
                            </span>
                        )}
                        {priceFilter !== "all" && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm flex items-center gap-1">
                                {priceFilter}
                                <button onClick={() => setPriceFilter("all")}><X size={14} /></button>
                            </span>
                        )}
                        <span className="text-sm text-gray-500 ml-2">({filteredCourses.length} results)</span>
                    </div>
                )}
            </div>


            {/* Courses Display */}
            {filteredCourses.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => {
                            const categoryColor = categoryColors[course.class] || "bg-gray-100 text-gray-700 border-gray-200";
                            const enrollCount = enrollmentCounts[course.id] || 0;
                            const videoCount = videoCounts[course.id] || 0;
                            const discount = course.original_price && course.price
                                ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
                                : 0;

                            return (
                                <div key={course.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 ${!course.is_published ? 'ring-2 ring-yellow-200' : ''}`}>
                                    <div className="relative aspect-video bg-gradient-to-br from-primary-500 to-blue-600">
                                        {course.thumbnail_url ? (
                                            <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <BookOpen className="text-white/50" size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColor}`}>{course.class}</span>
                                            {course.created_by_role === 'teacher' && (
                                                <span className="bg-purple-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                    <UserCircle size={12} /> Teacher
                                                </span>
                                            )}
                                            {course.created_by_role === 'admin' && (
                                                <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                    <Shield size={12} /> Admin
                                                </span>
                                            )}
                                            {course.is_combo && (
                                                <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                    <Sparkles size={12} /> COMBO
                                                </span>
                                            )}
                                            {course.is_featured && (
                                                <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                    <Award size={12} /> Featured
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${course.is_published ? "bg-green-500 text-white" : "bg-gray-800 text-white"}`}>
                                                {course.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {course.is_published ? "Live" : "Draft"}
                                            </span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="absolute bottom-3 right-3">
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{discount}% OFF</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2">{course.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{course.subject}</p>
                                        {course.creator && (
                                            <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                                                <UserCircle size={14} />
                                                <span>Created by: <span className="font-medium">{course.creator.full_name || course.creator.email}</span></span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-1"><Video size={14} /> {videoCount} videos</span>
                                            <span className="flex items-center gap-1"><Users size={14} /> {enrollCount} enrolled</span>
                                            {course.duration && <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>}
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                            {course.price > 0 ? (
                                                <>
                                                    <span className="text-xl font-bold text-primary-600">₹{course.price?.toLocaleString("en-IN")}</span>
                                                    {course.original_price > course.price && (
                                                        <span className="text-sm text-gray-400 line-through">₹{course.original_price.toLocaleString("en-IN")}</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-xl font-bold text-green-600">FREE</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                            <TogglePublishButton courseId={course.id} isPublished={course.is_published} />
                                            <Link href={`/admin/courses/${course.id}`} className="flex-1 py-2 px-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-center flex items-center justify-center gap-1">
                                                <Edit size={16} /> Edit
                                            </Link>
                                            <Link href={`/admin/courses/${course.id}/content`} className="flex-1 py-2 px-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition text-center flex items-center justify-center gap-1">
                                                <Video size={16} /> Content
                                            </Link>
                                            <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Course</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Creator</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Price</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Videos</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Enrolled</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCourses.map((course) => {
                                    const categoryColor = categoryColors[course.class] || "bg-gray-100 text-gray-700";
                                    return (
                                        <tr key={course.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                        {course.thumbnail_url ? (
                                                            <Image src={course.thumbnail_url} alt="" width={64} height={40} className="object-cover w-full h-full" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center"><BookOpen size={16} className="text-gray-400" /></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-1">{course.title}</p>
                                                        <p className="text-sm text-gray-500">{course.subject}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${categoryColor}`}>{course.class}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {course.created_by_role === 'teacher' ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-700">
                                                        <UserCircle size={12} /> Teacher
                                                    </span>
                                                ) : course.created_by_role === 'admin' ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">
                                                        <Shield size={12} /> Admin
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Unknown</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {course.price > 0 ? (
                                                    <span className="font-semibold text-gray-900">₹{course.price.toLocaleString("en-IN")}</span>
                                                ) : (
                                                    <span className="text-green-600 font-medium">FREE</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{videoCounts[course.id] || 0}</td>
                                            <td className="px-6 py-4 text-gray-600">{enrollmentCounts[course.id] || 0}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${course.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                    {course.is_published ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/courses/${course.id}`} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Edit size={18} /></Link>
                                                    <Link href={`/admin/courses/${course.id}/content`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Video size={18} /></Link>
                                                    <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-primary-600" size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {hasActiveFilters ? "No courses match your filters" : "No courses yet"}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        {hasActiveFilters
                            ? "Try adjusting your filters or search query to find courses."
                            : "Create your first government exam preparation course to start helping students."}
                    </p>
                    {hasActiveFilters ? (
                        <button onClick={clearFilters} className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition font-medium">
                            <X size={20} /> Clear Filters
                        </button>
                    ) : (
                        <Link href="/admin/courses/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-medium">
                            <Plus size={20} /> Create Your First Course
                        </Link>
                    )}
                </div>
            )}

            {/* Quick Tips */}
            {courses.length > 0 && courses.length < 5 && (
                <div className="bg-gradient-to-r from-blue-50 to-primary-50 border border-blue-200 rounded-xl p-5">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Government Exam Courses</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Create courses for popular exams: SSC CGL, Railway NTPC, Bank PO, RPSC RAS</li>
                        <li>• Add video lectures, PDF notes, and practice tests to each course</li>
                        <li>• Set competitive pricing with attractive discounts (30-50% off)</li>
                        <li>• Mark best courses as "Featured" to highlight them on homepage</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
