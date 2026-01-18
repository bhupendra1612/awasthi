import { createClient } from "@/lib/supabase/server";
import { BookOpen, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Course {
    id: string;
    title: string;
    description: string;
    class: string;
    subject: string;
    board: string;
    price: number;
    original_price: number;
    duration: string;
    is_combo: boolean;
    is_published: boolean;
    is_featured: boolean;
    thumbnail_url: string | null;
}

export default async function CoursesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch all published courses
    const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("class")
        .order("subject") as { data: Course[] | null };

    // Fetch user's enrollments
    const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user?.id)
        .eq("payment_status", "paid");

    const enrolledCourseIds = new Set(enrollments?.map(e => e.course_id) || []);

    // Group courses by class
    const coursesByClass: Record<string, Course[]> = {};
    const comboCourses: Course[] = [];

    courses?.forEach(course => {
        if (course.is_combo) {
            comboCourses.push(course);
        } else {
            if (!coursesByClass[course.class]) {
                coursesByClass[course.class] = [];
            }
            coursesByClass[course.class].push(course);
        }
    });

    const classOrder = ["Class 9", "Class 10", "Class 11", "Class 12"];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>
                <p className="text-gray-500 mt-1">Browse our comprehensive courses for Government Exam Preparation</p>
            </div>

            {/* Combo Courses */}
            {comboCourses.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">💰 Combo Courses - Best Value</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {comboCourses.map((course) => {
                            const isFree = !course.price || course.price === 0;
                            return (
                                <div
                                    key={course.id}
                                    className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl overflow-hidden shadow-lg text-white"
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video relative">
                                        {course.thumbnail_url ? (
                                            <Image
                                                src={course.thumbnail_url}
                                                alt={course.title}
                                                fill
                                                className="object-cover opacity-80"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-primary-500">
                                                <BookOpen className="text-white/30" size={60} />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                                <Sparkles size={12} />
                                                COMBO
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold">{course.title}</h3>
                                        <p className="text-primary-100 text-sm mt-1">{course.board}</p>
                                        <div className="mt-4">
                                            {isFree ? (
                                                <span className="text-2xl font-bold text-green-300">Free</span>
                                            ) : (
                                                <>
                                                    <span className="text-2xl font-bold">₹{course.price.toLocaleString("en-IN")}</span>
                                                    {course.original_price > course.price && (
                                                        <span className="text-primary-200 line-through ml-2">
                                                            ₹{course.original_price.toLocaleString("en-IN")}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        {!isFree && course.original_price > course.price && (
                                            <p className="text-sm text-primary-100 mt-1">
                                                Save ₹{(course.original_price - course.price).toLocaleString("en-IN")}
                                            </p>
                                        )}
                                        {enrolledCourseIds.has(course.id) ? (
                                            <Link
                                                href={`/course/${course.id}`}
                                                className="mt-4 block text-center bg-green-500 text-white py-2 rounded-lg font-medium"
                                            >
                                                Continue Learning
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/course/${course.id}`}
                                                className="mt-4 block text-center bg-white text-primary-600 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
                                            >
                                                View Details
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Courses by Class */}
            {classOrder.map((className) => {
                const classCourses = coursesByClass[className];
                if (!classCourses || classCourses.length === 0) return null;

                return (
                    <section key={className} className="mb-12">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">{className} Courses</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {classCourses.map((course) => {
                                const isFree = !course.price || course.price === 0;
                                return (
                                    <div
                                        key={course.id}
                                        className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100 ${course.is_featured ? "ring-2 ring-primary-500" : ""}`}
                                    >
                                        {/* Thumbnail */}
                                        <div className="aspect-video relative bg-gradient-to-br from-blue-400 to-blue-600">
                                            {course.thumbnail_url ? (
                                                <Image
                                                    src={course.thumbnail_url}
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <BookOpen className="text-white/30" size={60} />
                                                </div>
                                            )}
                                            {course.is_featured && (
                                                <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                                    <Sparkles size={12} />
                                                    POPULAR
                                                </span>
                                            )}
                                            {isFree && (
                                                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    FREE
                                                </span>
                                            )}
                                            <div className="absolute bottom-3 left-3">
                                                <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-2 py-1 rounded">
                                                    {course.class}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                                {course.subject}
                                            </span>
                                            <h3 className="font-semibold text-gray-900 mt-2 line-clamp-1">{course.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{course.board}</p>
                                            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                                <Clock size={14} />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div>
                                                    {isFree ? (
                                                        <span className="text-lg font-bold text-green-600">Free</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-lg font-bold text-primary-600">
                                                                ₹{course.price.toLocaleString("en-IN")}
                                                            </span>
                                                            {course.original_price > course.price && (
                                                                <span className="text-sm text-gray-400 line-through ml-2">
                                                                    ₹{course.original_price.toLocaleString("en-IN")}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                {!isFree && course.original_price > course.price && (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                        {Math.round(((course.original_price - course.price) / course.original_price) * 100)}% OFF
                                                    </span>
                                                )}
                                            </div>
                                            {enrolledCourseIds.has(course.id) ? (
                                                <Link
                                                    href={`/course/${course.id}`}
                                                    className="mt-3 block text-center bg-green-600 text-white py-2 rounded-lg font-medium"
                                                >
                                                    Continue Learning
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/course/${course.id}`}
                                                    className="mt-3 block text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                                                >
                                                    View Details
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
            })}

            {(!courses || courses.length === 0) && (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h2>
                    <p className="text-gray-500">Check back soon for new courses!</p>
                </div>
            )}
        </div>
    );
}
