import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Play, FileText, ChevronLeft, ChevronRight, File } from "lucide-react";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

interface CourseContent {
    id: string;
    title: string;
    type: "video" | "pdf" | "document";
    url: string;
    duration: string | null;
    is_free: boolean;
    order_index: number;
    file_type?: string;
}

// Convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
    // Handle various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
    }
    return null;
}

// Check if URL is a YouTube URL
function isYouTubeUrl(url: string): boolean {
    return url.includes("youtube.com") || url.includes("youtu.be");
}

export default async function ContentViewPage({
    params,
}: {
    params: Promise<{ id: string; contentId: string }>;
}) {
    const { id: courseId, contentId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch course
    const { data: course } = await supabase
        .from("courses")
        .select("id, title")
        .eq("id", courseId)
        .single();

    if (!course) {
        notFound();
    }

    // Fetch current content
    const { data: content } = await supabase
        .from("course_content")
        .select("*")
        .eq("id", contentId)
        .eq("course_id", courseId)
        .single() as { data: CourseContent | null };

    if (!content) {
        notFound();
    }

    // Check access
    const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user?.id)
        .eq("course_id", courseId)
        .eq("payment_status", "paid")
        .single();

    const hasAccess = !!enrollment || content.is_free;

    if (!hasAccess) {
        redirect(`/course/${courseId}`);
    }

    // Fetch all content for navigation
    const { data: allContent } = await supabase
        .from("course_content")
        .select("id, title, type, order_index")
        .eq("course_id", courseId)
        .order("order_index") as { data: CourseContent[] | null };

    const contentList = allContent || [];
    const currentIndex = contentList.findIndex(c => c.id === contentId);
    const prevContent = currentIndex > 0 ? contentList[currentIndex - 1] : null;
    const nextContent = currentIndex < contentList.length - 1 ? contentList[currentIndex + 1] : null;

    // Check if URL is a Bunny video ID
    const isBunnyVideo = (url: string) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(url);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/course/${courseId}`}
                            className="text-gray-400 hover:text-white transition flex items-center gap-2"
                        >
                            <ArrowLeft size={20} />
                            <span className="hidden sm:inline">Back to Course</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-700" />
                        <h1 className="text-white font-medium truncate max-w-md">{content.title}</h1>
                    </div>
                    <div className="text-sm text-gray-400">
                        {currentIndex + 1} / {contentList.length}
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Main Content Area */}
                <div className="flex-1">
                    {content.type === "video" ? (
                        <div className="aspect-video bg-black">
                            {isBunnyVideo(content.url) ? (
                                <VideoPlayer videoId={content.url} title={content.title} className="rounded-none" />
                            ) : isYouTubeUrl(content.url) ? (
                                <iframe
                                    src={getYouTubeEmbedUrl(content.url) || content.url}
                                    title={content.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <iframe
                                    src={content.url}
                                    title={content.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}
                        </div>
                    ) : content.type === "document" ? (
                        <div className="h-[calc(100vh-120px)] bg-white flex flex-col items-center justify-center">
                            <File className="text-gray-400 mb-4" size={64} />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
                            <p className="text-gray-500 mb-4">{content.file_type || "Document"}</p>
                            <a
                                href={content.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                            >
                                Download / View Document
                            </a>
                        </div>
                    ) : (
                        <div className="h-[calc(100vh-120px)] bg-white">
                            <iframe
                                src={content.url}
                                title={content.title}
                                className="w-full h-full"
                            />
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="bg-gray-800 px-4 py-4">
                        <div className="max-w-4xl mx-auto flex items-center justify-between">
                            {prevContent ? (
                                <Link
                                    href={`/course/${courseId}/content/${prevContent.id}`}
                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                                >
                                    <ChevronLeft size={20} />
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500">Previous</p>
                                        <p className="text-sm truncate max-w-[200px]">{prevContent.title}</p>
                                    </div>
                                </Link>
                            ) : (
                                <div />
                            )}

                            {nextContent ? (
                                <Link
                                    href={`/course/${courseId}/content/${nextContent.id}`}
                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                                >
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Next</p>
                                        <p className="text-sm truncate max-w-[200px]">{nextContent.title}</p>
                                    </div>
                                    <ChevronRight size={20} />
                                </Link>
                            ) : (
                                <Link
                                    href={`/course/${courseId}`}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                                >
                                    Complete Course
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Content List */}
                <aside className="hidden lg:block w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto h-[calc(100vh-57px)]">
                    <div className="p-4 border-b border-gray-700">
                        <h2 className="text-white font-semibold">{course.title}</h2>
                        <p className="text-sm text-gray-400 mt-1">{contentList.length} lessons</p>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {contentList.map((item, index) => (
                            <Link
                                key={item.id}
                                href={`/course/${courseId}/content/${item.id}`}
                                className={`flex items-center gap-3 p-4 hover:bg-gray-700 transition ${item.id === contentId ? "bg-gray-700" : ""
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${item.id === contentId
                                    ? "bg-primary-600 text-white"
                                    : "bg-gray-600 text-gray-300"
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm truncate ${item.id === contentId ? "text-white" : "text-gray-300"
                                        }`}>
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        {item.type === "video" ? <Play size={12} /> : item.type === "document" ? <File size={12} /> : <FileText size={12} />}
                                        {item.type === "video" ? "Video" : item.type === "document" ? "Document" : "PDF"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
