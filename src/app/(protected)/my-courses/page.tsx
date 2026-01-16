import { createClient } from "@/lib/supabase/server";
import { BookOpen, Play, Clock } from "lucide-react";
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    description: string;
    class: string;
    subject: string;
    price: number;
    thumbnail_url: string | null;
    is_combo: boolean;
}

interface Enrollment {
    course_id: string;
    status: string;
    enrolled_at: string;
    courses: Course;
}

export default async function MyCoursesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch user's enrollments
    const { data: enrollments } = await supabase
        .from("enrollments")
        .select(`
      course_id,
      status,
      enrolled_at,
      courses (
        id, title, description, class, subject, price, thumbnail_url, is_combo
      )
    `)
        .eq("user_id", user?.id)
        .eq("payment_status", "paid")
        .order("enrolled_at", { ascending: false }) as { data: Enrollment[] | null };

    const myCourses = enrollments || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                <p className="text-gray-500 mt-1">Continue learning from where you left off</p>
            </div>

            {myCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myCourses.map((enrollment) => {
                        const course = enrollment.courses;
                        if (!course) return null;

                        return (
                            <div
                                key={course.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                            >
                                <div className="aspect-video bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative overflow-hidden">
                                    {course.thumbnail_url && (
                                        <img
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/20" />
                                    <Play className="text-white/90 relative z-10" size={48} />
                                    {enrollment.status === "completed" && (
                                        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                                            COMPLETED
                                        </span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                            {course.class}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {course.subject}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{course.title}</h3>
                                    {course.description && (
                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                                    )}

                                    {/* Progress Bar Placeholder */}
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="text-primary-600 font-medium">0%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-600 w-0" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                                        <Clock size={16} />
                                        <span>Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString("en-IN")}</span>
                                    </div>

                                    <Link
                                        href={`/course/${course.id}`}
                                        className="mt-4 block text-center bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 transition font-medium"
                                    >
                                        Continue Learning
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-gray-400" size={40} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h2>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        You haven&apos;t enrolled in any courses yet. Browse our courses and start your learning journey!
                    </p>
                    <Link
                        href="/courses"
                        className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-medium"
                    >
                        Browse Courses
                    </Link>
                </div>
            )}
        </div>
    );
}
