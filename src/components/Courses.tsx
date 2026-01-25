"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Clock,
    BookOpen,
    X,
    CheckCircle,
    Play,
    FileText,
    Sparkles,
    ArrowRight,
    Eye,
    Calculator,
    Atom,
    FlaskConical,
    Award,
    Loader2,
    Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Course {
    id: string;
    title: string;
    description: string | null;
    class: string;
    subject: string;
    board?: string;
    price: number;
    original_price: number | null;
    duration?: string;
    is_combo: boolean;
    is_featured?: boolean;
    is_trending?: boolean;
    is_published: boolean;
    thumbnail_url: string | null;
    created_at: string;
}

type FilterType = "all" | "free" | "paid" | "latest" | "trending";

const subjectIcons: Record<string, typeof Calculator> = {
    Maths: Calculator,
    Science: Atom,
    Physics: Atom,
    Chemistry: FlaskConical,
    "All Subjects": BookOpen,
    PCM: Atom,
    English: BookOpen,
};

const subjectGradients: Record<string, string> = {
    Maths: "from-blue-500 to-cyan-500",
    Science: "from-green-500 to-emerald-500",
    Physics: "from-cyan-500 to-blue-500",
    Chemistry: "from-pink-500 to-rose-500",
    "All Subjects": "from-purple-500 to-pink-500",
    PCM: "from-orange-500 to-red-500",
    English: "from-indigo-500 to-violet-500",
};

export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [comboCourses, setComboCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const supabase = createClient();

    useEffect(() => {
        fetchCourses();
    }, [activeFilter]);

    const fetchCourses = async () => {
        setLoading(true);

        try {
            let query = supabase
                .from("courses")
                .select("*")
                .eq("is_published", true);

            // Apply filters
            if (activeFilter === "free") {
                query = query.or("price.eq.0,price.is.null");
            } else if (activeFilter === "paid") {
                query = query.gt("price", 0);
            } else if (activeFilter === "latest") {
                query = query.order("created_at", { ascending: false }).limit(6);
            } else if (activeFilter === "trending") {
                query = query.eq("is_trending", true);
            }

            if (activeFilter !== "latest") {
                query = query.order("created_at", { ascending: false });
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching courses:", error);
                setLoading(false);
                return;
            }

            // Process data and add default values for missing fields
            const processedData = (data || []).map(course => ({
                ...course,
                board: course.board || 'Government Exams',
                duration: course.duration || '6 months',
                is_featured: course.is_featured || false,
                is_trending: course.is_trending || false
            }));

            // Separate regular and combo courses
            const regular = processedData.filter((c) => !c.is_combo);
            const combos = processedData.filter((c) => c.is_combo);

            setCourses(regular);
            setComboCourses(combos);
        } catch (err) {
            console.error("Error in fetchCourses:", err);
        } finally {
            setLoading(false);
        }
    };

    const filters: { key: FilterType; label: string }[] = [
        { key: "all", label: "All Courses" },
        { key: "trending", label: "🔥 Trending" },
        { key: "free", label: "Free" },
        { key: "paid", label: "Paid" },
        { key: "latest", label: "Latest" },
    ];

    const getIcon = (subject: string) => subjectIcons[subject] || BookOpen;
    const getGradient = (subject: string) => subjectGradients[subject] || "from-gray-500 to-gray-600";

    return (
        <section id="courses" className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-[5%] w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-20 right-[5%] w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <BookOpen size={16} />
                        Learn from the Best
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        Our{" "}
                        <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Courses
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Expert coaching for government competitive exams including REET, RPSC, SSC, Railway, and more.
                        Comprehensive study material with experienced faculty guidance.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {filters.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeFilter === filter.key
                                ? "bg-primary-600 text-white shadow-lg shadow-primary-200"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            <Filter size={16} />
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary-600" size={40} />
                    </div>
                ) : courses.length === 0 && comboCourses.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="mx-auto text-gray-300 mb-4" size={60} />
                        <p className="text-gray-500 text-lg">No courses available yet.</p>
                        <p className="text-gray-400 text-sm mt-2">Check back soon for new courses!</p>
                    </div>
                ) : (
                    <>
                        {/* Course Grid */}
                        {courses.length > 0 && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => {
                                    const Icon = getIcon(course.subject);
                                    const gradient = getGradient(course.subject);
                                    const isFree = !course.price || course.price === 0;

                                    return (
                                        <div
                                            key={course.id}
                                            className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${course.is_featured ? "ring-2 ring-primary-500" : ""
                                                }`}
                                        >
                                            {/* Featured Image */}
                                            <div className={`aspect-video bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                                                {course.thumbnail_url ? (
                                                    <Image
                                                        src={course.thumbnail_url}
                                                        alt={course.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Icon className="text-white/30" size={80} />
                                                    </div>
                                                )}
                                                {course.is_featured && (
                                                    <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center gap-1">
                                                        <Sparkles size={12} />
                                                        POPULAR
                                                    </span>
                                                )}
                                                {isFree && (
                                                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                                                        FREE
                                                    </span>
                                                )}
                                                {/* Overlay gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                                {/* Category badge */}
                                                <div className="absolute bottom-3 left-3">
                                                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                                                        {course.class}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition line-clamp-1">
                                                    {course.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">{course.board || 'Government Exams'}</p>

                                                {/* Stats */}
                                                <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen size={14} />
                                                        <span>{course.subject}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        <span>{course.duration || '6 months'}</span>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-center gap-2 mt-4">
                                                    {isFree ? (
                                                        <span className="text-xl font-bold text-green-600">Free</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-xl font-bold text-primary-600">
                                                                ₹{course.price.toLocaleString("en-IN")}
                                                            </span>
                                                            {course.original_price && course.original_price > course.price && (
                                                                <>
                                                                    <span className="text-sm text-gray-400 line-through">
                                                                        ₹{course.original_price.toLocaleString("en-IN")}
                                                                    </span>
                                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                                        {Math.round(((course.original_price - course.price) / course.original_price) * 100)}% OFF
                                                                    </span>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex gap-2 mt-4">
                                                    <button
                                                        onClick={() => setSelectedCourse(course)}
                                                        className="flex-1 flex items-center justify-center gap-1 border-2 border-primary-600 text-primary-600 py-2 rounded-xl hover:bg-primary-50 transition text-sm font-medium"
                                                    >
                                                        <Eye size={16} />
                                                        Explore
                                                    </button>
                                                    <Link
                                                        href="/signup"
                                                        className="flex-1 flex items-center justify-center gap-1 bg-primary-600 text-white py-2 rounded-xl hover:bg-primary-700 transition text-sm font-medium"
                                                    >
                                                        Enroll
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Combo Courses Section */}
                        {comboCourses.length > 0 && (
                            <div className="mt-20">
                                <div className="text-center mb-10">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                        <Award size={16} />
                                        Best Value Deals
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        💰 Save More with{" "}
                                        <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                            Combo Courses
                                        </span>
                                    </h3>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {comboCourses.map((course) => {
                                        const gradient = getGradient(course.subject);
                                        const savings = course.original_price ? course.original_price - course.price : 0;

                                        return (
                                            <div
                                                key={course.id}
                                                className={`group relative bg-gradient-to-br ${gradient} rounded-2xl overflow-hidden shadow-lg text-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}
                                            >
                                                {/* Decorative elements */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                                                <div className="relative p-6">
                                                    <span className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                                                        <Sparkles size={12} />
                                                        BEST VALUE
                                                    </span>
                                                    <h3 className="text-xl font-bold mt-4">{course.title}</h3>
                                                    <p className="text-white/80 text-sm mt-1">{course.board}</p>

                                                    <div className="flex items-center gap-2 mt-4">
                                                        <BookOpen size={16} />
                                                        <span>{course.subject}</span>
                                                        <span className="text-white/60">•</span>
                                                        <span>{course.duration || '6 months'}</span>
                                                    </div>

                                                    <div className="mt-4">
                                                        <span className="text-3xl font-bold">₹{course.price.toLocaleString("en-IN")}</span>
                                                        {course.original_price && (
                                                            <span className="text-white/60 line-through ml-2">
                                                                ₹{course.original_price.toLocaleString("en-IN")}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {savings > 0 && (
                                                        <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm mt-2">
                                                            <Award size={14} />
                                                            Save ₹{savings.toLocaleString("en-IN")}
                                                        </div>
                                                    )}

                                                    <div className="flex gap-2 mt-5">
                                                        <button
                                                            onClick={() => setSelectedCourse(course)}
                                                            className="flex-1 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 py-2.5 rounded-xl transition text-sm font-medium"
                                                        >
                                                            <Eye size={16} />
                                                            Explore
                                                        </button>
                                                        <Link
                                                            href="/signup"
                                                            className="flex-1 flex items-center justify-center gap-1 bg-white text-gray-900 py-2.5 rounded-xl hover:bg-gray-100 transition font-medium text-sm"
                                                        >
                                                            Enroll
                                                            <ArrowRight size={16} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-xl hover:bg-primary-600 hover:text-white transition font-medium"
                    >
                        View All Courses
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>

            {/* Course Detail Modal */}
            {selectedCourse && (
                <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
            )}
        </section>
    );
}

function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
    const gradient = subjectGradients[course.subject] || "from-gray-500 to-gray-600";
    const isFree = !course.price || course.price === 0;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header with gradient */}
                <div className={`bg-gradient-to-br ${gradient} p-6 relative`}>
                    {course.thumbnail_url && (
                        <Image
                            src={course.thumbnail_url}
                            alt={course.title}
                            fill
                            className="object-cover opacity-30"
                        />
                    )}
                    <div className="relative z-10">
                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                        >
                            <X className="text-white" size={20} />
                        </button>
                        <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
                            {course.class}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">{course.title}</h2>
                        <p className="text-white/80 mt-2">{course.board}</p>

                        {/* Stats row */}
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-white/90">
                            <div className="flex items-center gap-1">
                                <BookOpen size={18} />
                                <span>{course.subject}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={18} />
                                <span>{course.duration || '6 months'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Description */}
                    {course.description && (
                        <p className="text-gray-600 leading-relaxed">{course.description}</p>
                    )}

                    {/* Course Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <BookOpen className="mx-auto text-primary-600 mb-2" size={24} />
                            <p className="text-lg font-bold text-gray-900">{course.class}</p>
                            <p className="text-sm text-gray-500">Class</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <Play className="mx-auto text-primary-600 mb-2" size={24} />
                            <p className="text-lg font-bold text-gray-900">Videos</p>
                            <p className="text-sm text-gray-500">Included</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <FileText className="mx-auto text-primary-600 mb-2" size={24} />
                            <p className="text-lg font-bold text-gray-900">PDF</p>
                            <p className="text-sm text-gray-500">Notes</p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-6">
                        <h4 className="font-bold text-gray-900 mb-3">What&apos;s Included:</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                            {["Complete REET Coverage", "Practice Questions", "Doubt Sessions", "PDF Notes", "Video Lectures"].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-600">
                                    <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                        <div>
                            {isFree ? (
                                <span className="text-3xl font-bold text-green-600">Free</span>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-bold text-primary-600">
                                            ₹{course.price.toLocaleString("en-IN")}
                                        </span>
                                        {course.original_price && course.original_price > course.price && (
                                            <span className="text-lg text-gray-400 line-through">
                                                ₹{course.original_price.toLocaleString("en-IN")}
                                            </span>
                                        )}
                                    </div>
                                    {course.original_price && course.original_price > course.price && (
                                        <p className="text-sm text-green-600 font-medium">
                                            Save ₹{(course.original_price - course.price).toLocaleString("en-IN")}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                        <Link
                            href="/signup"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
                        >
                            Enroll Now
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
