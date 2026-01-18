"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    ArrowLeft,
    Play,
    FileText,
    CheckCircle,
    Lock,
    ChevronDown,
    ChevronRight,
    Folder,
    Video,
    Download,
    Clock,
    BookOpen,
    Award,
    Target,
} from "lucide-react";
import Link from "next/link";

interface Chapter {
    id: string;
    title: string;
    description: string | null;
    order_index: number;
}

interface VideoItem {
    id: string;
    title: string;
    description: string | null;
    video_id: string;
    video_url: string | null;
    video_type: string;
    duration: number | null;
    order_index: number;
    is_free: boolean;
    chapter_id: string | null;
}

interface DocumentItem {
    id: string;
    title: string;
    description: string | null;
    file_url: string;
    file_type: string;
    chapter_id: string | null;
}

export default function CourseLearnPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    const supabase = createClient();

    const [course, setCourse] = useState<any>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(["uncategorized"]));
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        fetchData();
    }, [courseId]);

    async function fetchData() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // Check enrollment
            const { data: enrollment } = await supabase
                .from("enrollments")
                .select("*")
                .eq("user_id", user.id)
                .eq("course_id", courseId)
                .eq("payment_status", "paid")
                .single();

            if (!enrollment) {
                router.push(`/course/${courseId}`);
                return;
            }

            setIsEnrolled(true);

            // Fetch course details
            const { data: courseData } = await supabase
                .from("courses")
                .select("*")
                .eq("id", courseId)
                .single();
            setCourse(courseData);

            // Fetch chapters
            const { data: chaptersData } = await supabase
                .from("chapters")
                .select("*")
                .eq("course_id", courseId)
                .order("order_index");
            setChapters(chaptersData || []);

            // Fetch videos
            const { data: videosData } = await supabase
                .from("videos")
                .select("*")
                .eq("course_id", courseId)
                .order("order_index");
            setVideos(videosData || []);

            // Fetch documents
            const { data: docsData } = await supabase
                .from("documents")
                .select("*")
                .eq("course_id", courseId)
                .order("created_at");
            setDocuments(docsData || []);

            // Auto-select first video
            if (videosData && videosData.length > 0) {
                setSelectedVideo(videosData[0]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching course data:", error);
            setLoading(false);
        }
    }

    function toggleChapter(chapterId: string) {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(chapterId)) {
            newExpanded.delete(chapterId);
        } else {
            newExpanded.add(chapterId);
        }
        setExpandedChapters(newExpanded);
    }

    function getVideosByChapter(chapterId: string | null) {
        return videos.filter((v) => v.chapter_id === chapterId);
    }

    function getDocumentsByChapter(chapterId: string | null) {
        return documents.filter((d) => d.chapter_id === chapterId);
    }

    function renderVideoPlayer() {
        if (!selectedVideo) {
            return (
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                        <Play size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Select a video to start learning</p>
                    </div>
                </div>
            );
        }

        if (selectedVideo.video_type === "youtube") {
            const videoId = selectedVideo.video_id;
            return (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        } else if (selectedVideo.video_type === "bunny") {
            return (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                        src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/${selectedVideo.video_id}?autoplay=false&preload=true`}
                        className="w-full h-full"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }

        return (
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-white">Video format not supported</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
        );
    }

    if (!course || !isEnrolled) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Course not found or access denied</p>
                    <Link
                        href="/courses"
                        className="text-primary-600 hover:text-primary-700"
                    >
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    const totalVideos = videos.length;
    const totalDocuments = documents.length;
    const completedCount = completedVideos.size;
    const progress = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-16 md:top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                            <Link
                                href={`/course/${courseId}`}
                                className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                            >
                                <ArrowLeft size={18} />
                            </Link>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">{course.title}</h1>
                                <p className="text-xs md:text-sm text-gray-500 truncate">
                                    {course.class} • {course.subject}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                            <div className="text-right">
                                <p className="text-xs md:text-sm text-gray-500">Progress</p>
                                <p className="text-sm md:text-lg font-bold text-primary-600">{progress}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Main Content - Video Player */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-6 order-1">
                        {/* Video Player */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="aspect-video">
                                {renderVideoPlayer()}
                            </div>
                            {selectedVideo && (
                                <div className="p-4 md:p-6">
                                    <div className="flex items-start justify-between mb-3 md:mb-4">
                                        <div className="flex-1 min-w-0 pr-3">
                                            <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight">
                                                {selectedVideo.title}
                                            </h2>
                                            {selectedVideo.description && (
                                                <p className="text-sm md:text-base text-gray-600 line-clamp-2 md:line-clamp-none">
                                                    {selectedVideo.description}
                                                </p>
                                            )}
                                        </div>
                                        {selectedVideo.is_free && (
                                            <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs md:text-sm font-medium flex-shrink-0">
                                                FREE
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
                                        {selectedVideo.duration && (
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {Math.floor(selectedVideo.duration / 60)} min
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Video size={14} />
                                            {selectedVideo.video_type === "youtube" ? "YouTube" : "HD Video"}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Course Stats */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Video className="text-blue-600" size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-lg md:text-2xl font-bold text-gray-900">{totalVideos}</p>
                                        <p className="text-xs md:text-sm text-gray-500">Videos</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FileText className="text-green-600" size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-lg md:text-2xl font-bold text-gray-900">{totalDocuments}</p>
                                        <p className="text-xs md:text-sm text-gray-500">Documents</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Target className="text-purple-600" size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-lg md:text-2xl font-bold text-gray-900">{progress}%</p>
                                        <p className="text-xs md:text-sm text-gray-500">Complete</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Course Content */}
                    <div className="lg:col-span-1 order-2">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:sticky lg:top-24">
                            <div className="p-3 md:p-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white">
                                <h3 className="font-bold text-base md:text-lg">Course Content</h3>
                                <p className="text-xs md:text-sm text-white/80 mt-1">
                                    {totalVideos} videos • {totalDocuments} documents
                                </p>
                            </div>

                            <div className="max-h-96 lg:max-h-[calc(100vh-300px)] overflow-y-auto">
                                {/* Chapters */}
                                {chapters.map((chapter) => {
                                    const chapterVideos = getVideosByChapter(chapter.id);
                                    const chapterDocs = getDocumentsByChapter(chapter.id);
                                    const isExpanded = expandedChapters.has(chapter.id);

                                    return (
                                        <div key={chapter.id} className="border-b">
                                            <button
                                                onClick={() => toggleChapter(chapter.id)}
                                                className="w-full p-3 md:p-4 flex items-center justify-between hover:bg-gray-50 transition"
                                            >
                                                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                                    <Folder className="text-primary-600 flex-shrink-0" size={18} />
                                                    <div className="text-left min-w-0 flex-1">
                                                        <p className="font-medium text-gray-900 text-sm md:text-base truncate">{chapter.title}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {chapterVideos.length} videos, {chapterDocs.length} docs
                                                        </p>
                                                    </div>
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                                                ) : (
                                                    <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
                                                )}
                                            </button>

                                            {isExpanded && (
                                                <div className="bg-gray-50">
                                                    {/* Videos in chapter */}
                                                    {chapterVideos.map((video, index) => (
                                                        <button
                                                            key={video.id}
                                                            onClick={() => setSelectedVideo(video)}
                                                            className={`w-full p-2 md:p-3 pl-8 md:pl-12 flex items-center gap-2 md:gap-3 hover:bg-gray-100 transition text-left ${selectedVideo?.id === video.id ? "bg-primary-50 border-l-4 border-primary-600" : ""
                                                                }`}
                                                        >
                                                            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedVideo?.id === video.id
                                                                ? "bg-primary-600"
                                                                : "bg-white"
                                                                }`}>
                                                                <Play
                                                                    size={12}
                                                                    className={selectedVideo?.id === video.id ? "text-white" : "text-gray-600"}
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-xs md:text-sm font-medium truncate ${selectedVideo?.id === video.id
                                                                    ? "text-primary-600"
                                                                    : "text-gray-900"
                                                                    }`}>
                                                                    {index + 1}. {video.title}
                                                                </p>
                                                                {video.duration && (
                                                                    <p className="text-xs text-gray-500">
                                                                        {Math.floor(video.duration / 60)} min
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {video.is_free && (
                                                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex-shrink-0">
                                                                    FREE
                                                                </span>
                                                            )}
                                                        </button>
                                                    ))}

                                                    {/* Documents in chapter */}
                                                    {chapterDocs.map((doc) => (
                                                        <a
                                                            key={doc.id}
                                                            href={doc.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full p-2 md:p-3 pl-8 md:pl-12 flex items-center gap-2 md:gap-3 hover:bg-gray-100 transition"
                                                        >
                                                            <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <FileText size={12} className="text-gray-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                                                                    {doc.title}
                                                                </p>
                                                                <p className="text-xs text-gray-500">PDF Document</p>
                                                            </div>
                                                            <Download size={14} className="text-gray-400 flex-shrink-0" />
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Uncategorized Content */}
                                {(getVideosByChapter(null).length > 0 || getDocumentsByChapter(null).length > 0) && (
                                    <div className="border-b">
                                        <button
                                            onClick={() => toggleChapter("uncategorized")}
                                            className="w-full p-3 md:p-4 flex items-center justify-between hover:bg-gray-50 transition"
                                        >
                                            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                                <BookOpen className="text-gray-600 flex-shrink-0" size={18} />
                                                <div className="text-left min-w-0 flex-1">
                                                    <p className="font-medium text-gray-900 text-sm md:text-base">Other Content</p>
                                                    <p className="text-xs text-gray-500">
                                                        {getVideosByChapter(null).length} videos,{" "}
                                                        {getDocumentsByChapter(null).length} docs
                                                    </p>
                                                </div>
                                            </div>
                                            {expandedChapters.has("uncategorized") ? (
                                                <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>

                                        {expandedChapters.has("uncategorized") && (
                                            <div className="bg-gray-50">
                                                {getVideosByChapter(null).map((video, index) => (
                                                    <button
                                                        key={video.id}
                                                        onClick={() => setSelectedVideo(video)}
                                                        className={`w-full p-2 md:p-3 pl-8 md:pl-12 flex items-center gap-2 md:gap-3 hover:bg-gray-100 transition text-left ${selectedVideo?.id === video.id ? "bg-primary-50 border-l-4 border-primary-600" : ""
                                                            }`}
                                                    >
                                                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedVideo?.id === video.id
                                                            ? "bg-primary-600"
                                                            : "bg-white"
                                                            }`}>
                                                            <Play
                                                                size={12}
                                                                className={selectedVideo?.id === video.id ? "text-white" : "text-gray-600"}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-xs md:text-sm font-medium truncate ${selectedVideo?.id === video.id
                                                                ? "text-primary-600"
                                                                : "text-gray-900"
                                                                }`}>
                                                                {index + 1}. {video.title}
                                                            </p>
                                                            {video.duration && (
                                                                <p className="text-xs text-gray-500">
                                                                    {Math.floor(video.duration / 60)} min
                                                                </p>
                                                            )}
                                                        </div>
                                                        {video.is_free && (
                                                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex-shrink-0">
                                                                FREE
                                                            </span>
                                                        )}
                                                    </button>
                                                ))}

                                                {getDocumentsByChapter(null).map((doc) => (
                                                    <a
                                                        key={doc.id}
                                                        href={doc.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full p-2 md:p-3 pl-8 md:pl-12 flex items-center gap-2 md:gap-3 hover:bg-gray-100 transition"
                                                    >
                                                        <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <FileText size={12} className="text-gray-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                                                                {doc.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500">PDF Document</p>
                                                        </div>
                                                        <Download size={14} className="text-gray-400 flex-shrink-0" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}