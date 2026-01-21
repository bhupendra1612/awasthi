"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import {
    BookOpen,
    Clock,
    Users,
    Star,
    Filter,
    X,
    Eye,
    ArrowRight,
    Sparkles,
    CheckCircle,
    Play,
    FileText,
    Calculator,
    Atom,
    FlaskConical,
    Award,
} from "lucide-react";

interface Course {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    price: number;
    original_price: number | null;
    duration: string;
    level: string;
    exam_type: string;
    is_published: boolean;
    is_featured: boolean;
    is_combo: boolean;
    board: string;
    subject: string;
    class: string;
    created_at: string;
}

const subjectIcons: Record<string, typeof Calculator> = {
    Maths: Calculator,
    Science: Atom,
    Physics: Atom,
    Chemistry: FlaskConical,
    "All Subjects": BookOpen,
    PCM: Atom,
    English: BookOpen,
    REET: BookOpen,
    Patwari: BookOpen,
    SSC: BookOpen,
    Police: BookOpen,
    Railway: BookOpen,
};

const subjectGradients: Record<string, string> = {
    Maths: "from-blue-500 to-cyan-500",
    Science: "from-green-500 to-emerald-500",
    Physics: "from-cyan-500 to-blue-500",
    Chemistry: "from-pink-500 to-rose-500",
    "All Subjects": "from-purple-500 to-pink-500",
    PCM: "from-orange-500 to-red-500",
    English: "from-indigo-500 to-violet-500",
    REET: "from-blue-600 to-indigo-600",
    Patwari: "from-green-600 to-teal-600",
    SSC: "from-purple-600 to-pink-600",
    Police: "from-red-600 to-orange-600",
    Railway: "from-cyan-600 to-blue-600",
};

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [comboCourses, setComboCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [filteredCombos, setFilteredCombos] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState<string>("all");
    const [selectedPrice, setSelectedPrice] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const examTypes = [
        { value: "all", label: "All Exams" },
        { value: "REET", label: "REET" },
        { value: "Patwari", label: "Patwari" },
        { value: "SSC", label: "SSC / LDC" },
        { value: "Police", label: "Rajasthan Police" },
        { value: "Railway", label: "Railway" },
    ];

    const priceFilters = [
        { value: "all", label: "All Courses" },
        { value: "free", label: "Free" },
        { value: "paid", label: "Paid" },
        { value: "combo", label: "Combo" },
    ];

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [selectedExam, selectedPrice, courses, comboCourses]);

    const fetchCourses = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .eq("is_published", true)
                .order("created_at", { ascending: false });

            if (error) throw error;

            const processedData = (data || []).map(course => ({
                ...course,
                board: course.board || 'CBSE',
                duration: course.duration || '6 months',
                level: course.level || 'All Levels',
                exam_type: course.exam_type || 'General',
                subject: course.subject || 'All Subjects',
                class: course.class || 'All Classes',
                is_featured: course.is_featured || false,
                is_combo: course.is_combo || false,
                description: course.description || '',
                original_price: course.original_price || null,
            }));

            // Debug: Log exam types to console
            console.log('Available exam types:', [...new Set(processedData.map(c => c.exam_type))]);
            console.log('Available subjects:', [...new Set(processedData.map(c => c.subject))]);

            const regular = processedData.filter((c) => !c.is_combo);
            const combos = processedData.filter((c) => c.is_combo);

            setCourses(regular);
            setComboCourses(combos);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterCourses = () => {
        let filtered = [...courses];
        let filteredCombo = [...comboCourses];

        // Filter by exam type - check both exam_type and subject fields
        if (selectedExam !== "all") {
            filtered = filtered.filter(course => {
                const examType = (course.exam_type || '').toLowerCase();
                const subject = (course.subject || '').toLowerCase();
                const title = (course.title || '').toLowerCase();
                const searchTerm = selectedExam.toLowerCase();

                return examType.includes(searchTerm) ||
                    subject.includes(searchTerm) ||
                    title.includes(searchTerm);
            });
            filteredCombo = filteredCombo.filter(course => {
                const examType = (course.exam_type || '').toLowerCase();
                const subject = (course.subject || '').toLowerCase();
                const title = (course.title || '').toLowerCase();
                const searchTerm = selectedExam.toLowerCase();

                return examType.includes(searchTerm) ||
                    subject.includes(searchTerm) ||
                    title.includes(searchTerm);
            });
        }

        // Filter by price
        if (selectedPrice === "free") {
            filtered = filtered.filter(course => !course.price || course.price === 0);
            filteredCombo = filteredCombo.filter(course => !course.price || course.price === 0);
        } else if (selectedPrice === "paid") {
            filtered = filtered.filter(course => course.price > 0 && course.price < 5000);
            filteredCombo = filteredCombo.filter(course => course.price > 0 && course.price < 5000);
        } else if (selectedPrice === "combo") {
            filtered = filtered.filter(course => course.price >= 5000);
            filteredCombo = filteredCombo.filter(course => course.price >= 5000);
        }

        setFilteredCourses(filtered);
        setFilteredCombos(filteredCombo);
    };

    const clearFilters = () => {
        setSelectedExam("all");
        setSelectedPrice("all");
    };

    const getIcon = (subject: string) => subjectIcons[subject] || BookOpen;
    const getGradient = (subject: string) => subjectGradients[subject] || "from-gray-500 to-gray-600";

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <div className="h-16"></div>

                {/* Hero Section - Compact */}
                <div className="relative bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 text-white py-12 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Courses</h1>
                        <p className="text-base md:text-lg text-white/90">
                            Expert coaching for government competitive examinations
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <BookOpen size={16} />
                                <span>{courses.length + comboCourses.length} Courses</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users size={16} />
                                <span>Expert Teachers</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star size={16} />
                                <span>Quality Content</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section - Compact */}
                <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        {/* Desktop Filters */}
                        <div className="hidden md:flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700">Filter by Exam:</span>
                                <div className="flex gap-2">
                                    {examTypes.map((exam) => (
                                        <button
                                            key={exam.value}
                                            onClick={() => setSelectedExam(exam.value)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedExam === exam.value
                                                ? "bg-primary-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            {exam.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700">Filter by Price:</span>
                                <div className="flex gap-2">
                                    {priceFilters.map((filter) => (
                                        <button
                                            key={filter.value}
                                            onClick={() => setSelectedPrice(filter.value)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedPrice === filter.value
                                                ? "bg-green-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results & Clear - Desktop */}
                        <div className="hidden md:flex items-center justify-between mt-2">
                            <div className="text-sm text-gray-600">
                                Showing {filteredCourses.length + filteredCombos.length} of {courses.length + comboCourses.length} courses
                            </div>
                            {(selectedExam !== "all" || selectedPrice !== "all") && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <X size={14} />
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg w-full justify-center"
                        >
                            <Filter size={18} />
                            Filters
                        </button>

                        {/* Mobile Filters */}
                        {showFilters && (
                            <div className="md:hidden mt-3 space-y-3 pb-2">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Exam</label>
                                    <div className="flex flex-wrap gap-2">
                                        {examTypes.map((exam) => (
                                            <button
                                                key={exam.value}
                                                onClick={() => setSelectedExam(exam.value)}
                                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedExam === exam.value
                                                    ? "bg-primary-600 text-white shadow-md"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {exam.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Price</label>
                                    <div className="flex flex-wrap gap-2">
                                        {priceFilters.map((filter) => (
                                            <button
                                                key={filter.value}
                                                onClick={() => setSelectedPrice(filter.value)}
                                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedPrice === filter.value
                                                    ? "bg-green-600 text-white shadow-md"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Showing {filteredCourses.length + filteredCombos.length} of {courses.length + comboCourses.length} courses
                                    </div>
                                    {(selectedExam !== "all" || selectedPrice !== "all") && (
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <X size={14} />
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {loading ? (
                        <div className="text-center py-32">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
                            <p className="mt-6 text-gray-600 text-lg font-medium">Loading courses...</p>
                        </div>
                    ) : filteredCourses.length === 0 && filteredCombos.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-gray-500 text-xl font-medium mb-4">No courses found</p>
                            <p className="text-gray-400">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <>
                            {/* Regular Courses */}
                            {filteredCourses.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCourses.map((course, index) => {
                                        const Icon = getIcon(course.subject || course.exam_type);
                                        const gradient = getGradient(course.subject || course.exam_type);
                                        const isFree = !course.price || course.price === 0;

                                        return (
                                            <div
                                                key={course.id}
                                                className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${course.is_featured ? "ring-2 ring-primary-500" : ""
                                                    }`}
                                                style={{
                                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                                }}
                                            >
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
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                                    <div className="absolute bottom-3 left-3">
                                                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                                                            {course.exam_type || course.class}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition line-clamp-1">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">{course.board}</p>

                                                    <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen size={14} />
                                                            <span>{course.subject || course.exam_type}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            <span>{course.duration}</span>
                                                        </div>
                                                    </div>

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

                            {/* Combo Courses */}
                            {filteredCombos.length > 0 && (
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
                                        {filteredCombos.map((course, index) => {
                                            const gradient = getGradient(course.subject || course.exam_type);
                                            const savings = course.original_price ? course.original_price - course.price : 0;

                                            return (
                                                <div
                                                    key={course.id}
                                                    className={`group relative bg-gradient-to-br ${gradient} rounded-2xl overflow-hidden shadow-lg text-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}
                                                    style={{
                                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                                    }}
                                                >
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
                                                            <span>{course.subject || course.exam_type}</span>
                                                            <span className="text-white/60">•</span>
                                                            <span>{course.duration}</span>
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
                </div>

                <style jsx>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
            <Footer />

            {/* Course Detail Modal */}
            {selectedCourse && (
                <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
            )}
        </>
    );
}

function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
    const gradient = subjectGradients[course.subject || course.exam_type] || "from-gray-500 to-gray-600";
    const isFree = !course.price || course.price === 0;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
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
                            {course.exam_type || course.class}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">{course.title}</h2>
                        <p className="text-white/80 mt-2">{course.board}</p>

                        <div className="flex flex-wrap items-center gap-4 mt-4 text-white/90">
                            <div className="flex items-center gap-1">
                                <BookOpen size={18} />
                                <span>{course.subject || course.exam_type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={18} />
                                <span>{course.duration}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {course.description && (
                        <p className="text-gray-600 leading-relaxed">{course.description}</p>
                    )}

                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <BookOpen className="mx-auto text-primary-600 mb-2" size={24} />
                            <p className="text-lg font-bold text-gray-900">{course.exam_type || course.class}</p>
                            <p className="text-sm text-gray-500">Exam</p>
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

                    <div className="mt-6">
                        <h4 className="font-bold text-gray-900 mb-3">What&apos;s Included:</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                            {["Complete Syllabus Coverage", "Practice Questions", "Doubt Sessions", "PDF Notes", "Video Lectures"].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-600">
                                    <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

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
