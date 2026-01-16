import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BookOpen, Clock, Users, Star, Play, Lock, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

interface CourseContent {
    id: string;
    title: string;
    type: "video" | "pdf";
    url: string;
    duration: string | null;
    is_free: boolean;
    order_index: number;
}

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch course details
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .single();

    if (!course) {
        notFound();
    }

    // Check if user is enrolled
    const { data: enrollment } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user?.id)
        .eq("course_id", id)
        .eq("payment_status", "paid")
        .single();

    const isEnrolled = !!enrollment;

    // Fetch course content
    const { data: content } = await supabase
        .from("course_content")
        .select("*")
        .eq("course_id", id)
        .order("order_index") as { data: CourseContent[] | null };

    const courseContent = content || [];
    const freeContent = courseContent.filter(c => c.is_free);
    const totalVideos = courseContent.filter(c => c.type === "video").length;
    const totalPdfs = courseContent.filter(c => c.type === "pdf").length;

    // Check if URL is a Bunny video ID
    const isBunnyVideo = (url: string) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(url);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Course Header */}
                    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                                {course.class}
                            </span>
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {course.subject}
                            </span>
                            {course.is_combo && (
                                <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                                    Combo
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                        <p className="text-gray-500 mt-2">{course.board}</p>

                        {course.description && (
                            <p className="text-gray-600 mt-4">{course.description}</p>
                        )}

                        <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                                <span className="font-medium">4.8</span>
                                <span>(500+ reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users size={16} />
                                <span>1000+ students</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>{course.duration}</span>
                            </div>
                        </div>
                    </div>

                    {/* Course Content */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {totalVideos} videos • {totalPdfs} PDFs
                            </p>
                        </div>

                        {courseContent.length > 0 ? (
                            <div className="divide-y">
                                {courseContent.map((item, index) => {
                                    const canAccess = isEnrolled || item.is_free;

                                    return (
                                        <div
                                            key={item.id}
                                            className={`p-4 flex items-center gap-4 ${canAccess ? "hover:bg-gray-50" : "opacity-60"}`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                                                {index + 1}
                                            </div>
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === "video" ? "bg-blue-100" : "bg-red-100"
                                                }`}>
                                                {item.type === "video" ? (
                                                    <Play className="text-blue-600" size={18} />
                                                ) : (
                                                    <FileText className="text-red-600" size={18} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.title}</p>
                                                <p className="text-sm text-gray-500">
                                                    {item.type === "video" ? "Video" : "PDF"}
                                                    {item.duration && ` • ${item.duration}`}
                                                </p>
                                            </div>
                                            {item.is_free && (
                                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                                    FREE
                                                </span>
                                            )}
                                            {canAccess ? (
                                                <Link
                                                    href={`/course/${id}/content/${item.id}`}
                                                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                                >
                                                    {item.type === "video" ? "Watch" : "View"}
                                                </Link>
                                            ) : (
                                                <Lock className="text-gray-400" size={18} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <BookOpen className="mx-auto text-gray-400 mb-3" size={40} />
                                <p className="text-gray-500">Content coming soon</p>
                            </div>
                        )}
                    </div>

                    {/* Free Preview Section */}
                    {freeContent.length > 0 && !isEnrolled && (
                        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Free Preview</h2>
                            {freeContent[0].type === "video" && isBunnyVideo(freeContent[0].url) && (
                                <VideoPlayer videoId={freeContent[0].url} title={freeContent[0].title} />
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar - Enrollment Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                        {isEnrolled ? (
                            <>
                                <div className="flex items-center gap-2 text-green-600 mb-4">
                                    <CheckCircle size={24} />
                                    <span className="font-semibold">You&apos;re Enrolled!</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-6">
                                    You have full access to all course content.
                                </p>
                                {courseContent.length > 0 && (
                                    <Link
                                        href={`/course/${id}/content/${courseContent[0].id}`}
                                        className="block w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium text-center"
                                    >
                                        Start Learning
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-gray-900">
                                            ₹{course.price.toLocaleString("en-IN")}
                                        </span>
                                        {course.original_price > course.price && (
                                            <span className="text-lg text-gray-400 line-through">
                                                ₹{course.original_price.toLocaleString("en-IN")}
                                            </span>
                                        )}
                                    </div>
                                    {course.original_price > course.price && (
                                        <p className="text-green-600 text-sm mt-1">
                                            Save ₹{(course.original_price - course.price).toLocaleString("en-IN")}
                                            ({Math.round((1 - course.price / course.original_price) * 100)}% off)
                                        </p>
                                    )}
                                </div>

                                <Link
                                    href={`/course/${id}/enroll`}
                                    className="block w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium text-center mb-3"
                                >
                                    Enroll Now
                                </Link>

                                <p className="text-center text-sm text-gray-500">
                                    Full lifetime access
                                </p>

                                <div className="mt-6 pt-6 border-t space-y-3">
                                    <h3 className="font-semibold text-gray-900">This course includes:</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Play size={16} className="text-primary-600" />
                                        <span>{totalVideos} video lessons</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FileText size={16} className="text-primary-600" />
                                        <span>{totalPdfs} PDF notes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock size={16} className="text-primary-600" />
                                        <span>Lifetime access</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle size={16} className="text-primary-600" />
                                        <span>Certificate of completion</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
