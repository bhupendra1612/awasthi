"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, Users, Star, Filter, X, IndianRupee } from "lucide-react";

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    price: number;
    duration: string;
    level: string;
    exam_type: string;
    is_published: boolean;
    is_featured: boolean;
    created_at: string;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState<string>("all");
    const [selectedPrice, setSelectedPrice] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);

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
    }, [selectedExam, selectedPrice, courses]);

    const fetchCourses = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .eq("is_published", true)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setCourses(data || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterCourses = () => {
        let filtered = [...courses];

        // Filter by exam type
        if (selectedExam !== "all") {
            filtered = filtered.filter(course =>
                course.exam_type?.toLowerCase().includes(selectedExam.toLowerCase())
            );
        }

        // Filter by price
        if (selectedPrice === "free") {
            filtered = filtered.filter(course => course.price === 0);
        } else if (selectedPrice === "paid") {
            filtered = filtered.filter(course => course.price > 0 && course.price < 5000);
        } else if (selectedPrice === "combo") {
            filtered = filtered.filter(course => course.price >= 5000);
        }

        setFilteredCourses(filtered);
    };

    const clearFilters = () => {
        setSelectedExam("all");
        setSelectedPrice("all");
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                {/* Spacer for fixed header */}
                <div className="h-16"></div>

                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 text-white py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeIn">Our Courses</h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                            Expert coaching for government competitive examinations
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <BookOpen size={20} />
                                <span>{courses.length} Courses</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={20} />
                                <span>Expert Teachers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star size={20} />
                                <span>Quality Content</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg mb-4"
                        >
                            <Filter size={20} />
                            Filters
                        </button>

                        {/* Filters */}
                        <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4`}>
                            {/* Exam Type Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Filter by Exam
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {examTypes.map((exam) => (
                                        <button
                                            key={exam.value}
                                            onClick={() => setSelectedExam(exam.value)}
                                            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedExam === exam.value
                                                    ? "bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg"
                                                    : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-primary-600"
                                                }`}
                                        >
                                            {exam.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Filter by Price
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {priceFilters.map((filter) => (
                                        <button
                                            key={filter.value}
                                            onClick={() => setSelectedPrice(filter.value)}
                                            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedPrice === filter.value
                                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                                                    : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-600"
                                                }`}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(selectedExam !== "all" || selectedPrice !== "all") && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <X size={16} />
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 text-sm text-gray-600">
                            Showing {filteredCourses.length} of {courses.length} courses
                        </div>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {loading ? (
                        <div className="text-center py-32">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
                            <p className="mt-6 text-gray-600 text-lg font-medium">Loading courses...</p>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-gray-500 text-xl font-medium mb-4">No courses found</p>
                            <p className="text-gray-400">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course, index) => (
                                <Link
                                    key={course.id}
                                    href={`/courses/${course.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        {course.thumbnail_url ? (
                                            <Image
                                                src={course.thumbnail_url}
                                                alt={course.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary-600 to-blue-600 flex items-center justify-center">
                                                <BookOpen size={64} className="text-white/50" />
                                            </div>
                                        )}
                                        {/* Featured Badge */}
                                        {course.is_featured && (
                                            <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Star size={12} fill="currentColor" />
                                                Featured
                                            </div>
                                        )}
                                        {/* Price Badge */}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                                            {course.price === 0 ? (
                                                <span className="text-green-600">FREE</span>
                                            ) : course.price >= 5000 ? (
                                                <span className="text-purple-600">COMBO</span>
                                            ) : (
                                                <span className="text-primary-600 flex items-center">
                                                    <IndianRupee size={14} />
                                                    {course.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Exam Type */}
                                        {course.exam_type && (
                                            <div className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                                                {course.exam_type}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition line-clamp-2">
                                            {course.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {course.description}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} />
                                                <span>{course.duration || "Self-paced"}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                                    {course.level || "All Levels"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <button className="mt-4 w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/30 transition-all">
                                            View Details
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add keyframes for animation */}
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
        </>
    );
}
