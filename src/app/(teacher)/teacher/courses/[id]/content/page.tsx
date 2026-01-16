"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Plus, Video, FileText, Trash2, GripVertical, Loader2, Upload, Eye, File } from "lucide-react";
import Link from "next/link";
import VideoUploader from "@/components/admin/VideoUploader";
import DocumentUploader from "@/components/admin/DocumentUploader";

interface ContentItem {
    id: string;
    title: string;
    type: "video" | "pdf" | "document";
    url: string;
    duration?: string;
    order_index: number;
    is_free: boolean;
    file_type?: string;
}

export default function TeacherCourseContentPage() {
    const params = useParams();
    const courseId = params.id as string;
    const supabase = createClient();

    const [course, setCourse] = useState<{ title: string } | null>(null);
    const [content, setContent] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const [showDocUploader, setShowDocUploader] = useState(false);

    const [newContent, setNewContent] = useState({
        title: "",
        type: "video" as "video" | "pdf",
        url: "",
        duration: "",
        is_free: false,
    });

    useEffect(() => {
        fetchData();
    }, [courseId]);

    async function fetchData() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Verify teacher owns this course
        const { data: courseData } = await supabase
            .from("courses")
            .select("title, teacher_id")
            .eq("id", courseId)
            .eq("teacher_id", user.id)
            .single();

        if (!courseData) {
            setLoading(false);
            return;
        }

        // Fetch videos and documents separately
        const { data: videosData } = await supabase
            .from("videos")
            .select("*")
            .eq("course_id", courseId)
            .order("order_index");

        const { data: documentsData } = await supabase
            .from("documents")
            .select("*")
            .eq("course_id", courseId);

        // Combine and format the content
        const combinedContent: ContentItem[] = [];

        // Add videos
        if (videosData) {
            videosData.forEach((video) => {
                combinedContent.push({
                    id: video.id,
                    title: video.title,
                    type: "video",
                    url: video.video_id,
                    duration: video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : undefined,
                    order_index: video.order_index,
                    is_free: video.is_free,
                });
            });
        }

        // Add documents
        if (documentsData) {
            documentsData.forEach((doc) => {
                combinedContent.push({
                    id: doc.id,
                    title: doc.title,
                    type: "document",
                    url: doc.file_url,
                    order_index: 999, // Put documents at the end for now
                    is_free: false, // Documents don't have is_free in schema
                    file_type: doc.file_type,
                });
            });
        }

        // Sort by order_index
        combinedContent.sort((a, b) => a.order_index - b.order_index);

        setCourse(courseData);
        setContent(combinedContent);
        setLoading(false);
    }

    const handleVideoUploadComplete = async (videoId: string, title: string) => {
        setSaving(true);
        try {
            const { error } = await supabase.from("videos").insert({
                course_id: courseId,
                title: title,
                video_id: videoId,
                is_free: false,
                order_index: content.length,
            });

            if (error) throw error;

            setShowUploader(false);
            fetchData();
        } catch (err) {
            console.error("Save content error:", err);
            alert("Video uploaded but failed to save to course.");
        } finally {
            setSaving(false);
        }
    };

    const handleDocumentUploadComplete = async (url: string, title: string, fileType: string) => {
        setSaving(true);
        try {
            const { error } = await supabase.from("documents").insert({
                course_id: courseId,
                title: title,
                file_url: url,
                file_type: fileType,
            });

            if (error) throw error;

            setShowDocUploader(false);
            fetchData();
        } catch (err) {
            console.error("Save document error:", err);
            alert("Document uploaded but failed to save to course.");
        } finally {
            setSaving(false);
        }
    };

    const handleAddContent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase.from("course_content").insert({
                course_id: courseId,
                title: newContent.title,
                type: newContent.type,
                url: newContent.url,
                duration: newContent.duration || null,
                is_free: newContent.is_free,
                order_index: content.length,
            });

            if (error) throw error;

            setNewContent({ title: "", type: "video", url: "", duration: "", is_free: false });
            setShowAddForm(false);
            fetchData();
        } catch (err) {
            console.error("Add content error:", err);
            alert("Failed to add content");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteContent = async (contentId: string) => {
        if (!confirm("Delete this content?")) return;

        try {
            // Find the content item to determine which table to delete from
            const contentItem = content.find(item => item.id === contentId);
            if (!contentItem) return;

            let error;
            if (contentItem.type === "video") {
                const result = await supabase
                    .from("videos")
                    .delete()
                    .eq("id", contentId);
                error = result.error;
            } else {
                const result = await supabase
                    .from("documents")
                    .delete()
                    .eq("id", contentId);
                error = result.error;
            }

            if (error) throw error;
            fetchData();
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete content");
        }
    };

    const toggleFree = async (contentId: string, currentValue: boolean) => {
        try {
            // Only videos support is_free toggle (documents don't have this field)
            const contentItem = content.find(item => item.id === contentId);
            if (!contentItem || contentItem.type !== "video") return;

            const { error } = await supabase
                .from("videos")
                .update({ is_free: !currentValue })
                .eq("id", contentId);

            if (error) throw error;
            fetchData();
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    const isBunnyVideo = (url: string) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(url);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
                <p className="text-gray-500">This course doesn't exist or you don't have access.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <Link
                href={`/teacher/courses/${courseId}`}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Course
            </Link>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                        <p className="text-gray-500 mt-1">Manage course content - videos and documents</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => setShowUploader(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                            <Upload size={20} />
                            Upload Video
                        </button>
                        <button
                            onClick={() => setShowDocUploader(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <File size={20} />
                            Upload Document
                        </button>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add Link
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Uploader */}
            {showUploader && (
                <div className="mb-6">
                    <VideoUploader
                        onUploadComplete={handleVideoUploadComplete}
                        onCancel={() => setShowUploader(false)}
                    />
                </div>
            )}

            {/* Document Uploader */}
            {showDocUploader && (
                <div className="mb-6">
                    <DocumentUploader
                        onUploadComplete={handleDocumentUploadComplete}
                        onCancel={() => setShowDocUploader(false)}
                    />
                </div>
            )}

            {/* Add Content Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add External Content</h3>
                    <form onSubmit={handleAddContent} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={newContent.title}
                                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                                    placeholder="e.g., Chapter 1 - Introduction"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                                <select
                                    value={newContent.type}
                                    onChange={(e) => setNewContent({ ...newContent, type: e.target.value as "video" | "pdf" })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    <option value="video">Video (YouTube/External)</option>
                                    <option value="pdf">PDF</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {newContent.type === "video" ? "Video URL *" : "PDF URL *"}
                            </label>
                            <input
                                type="url"
                                value={newContent.url}
                                onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                                placeholder={newContent.type === "video" ? "https://youtube.com/watch?v=..." : "https://..."}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                required
                            />
                        </div>

                        {newContent.type === "video" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                <input
                                    type="text"
                                    value={newContent.duration}
                                    onChange={(e) => setNewContent({ ...newContent, duration: e.target.value })}
                                    placeholder="e.g., 15:30"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_free"
                                checked={newContent.is_free}
                                onChange={(e) => setNewContent({ ...newContent, is_free: e.target.checked })}
                                className="w-4 h-4 text-purple-600 rounded"
                            />
                            <label htmlFor="is_free" className="text-sm text-gray-700">
                                Free preview (accessible without enrollment)
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : "Add Content"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Content List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {content.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {content.map((item) => (
                            <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                                <GripVertical className="text-gray-400 cursor-move" size={20} />
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === "video" ? "bg-blue-100" :
                                    item.type === "document" ? "bg-orange-100" : "bg-red-100"
                                    }`}>
                                    {item.type === "video" ? (
                                        <Video className="text-blue-600" size={20} />
                                    ) : item.type === "document" ? (
                                        <File className="text-orange-600" size={20} />
                                    ) : (
                                        <FileText className="text-red-600" size={20} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.type === "video"
                                            ? (isBunnyVideo(item.url) ? "Bunny Stream" : "External Video")
                                            : item.type === "document"
                                                ? (item.file_type || "Document")
                                                : "PDF"}
                                        {item.duration && ` • ${item.duration}`}
                                    </p>
                                </div>
                                {(item.type === "document" || item.type === "pdf") && (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="View"
                                    >
                                        <Eye size={18} />
                                    </a>
                                )}
                                {item.type === "video" && (
                                    <button
                                        onClick={() => toggleFree(item.id, item.is_free)}
                                        className={`text-xs px-3 py-1 rounded-full ${item.is_free
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {item.is_free ? "Free" : "Paid"}
                                    </button>
                                )}
                                {item.type === "document" && (
                                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                        Document
                                    </span>
                                )}
                                <button
                                    onClick={() => handleDeleteContent(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
                        <p className="text-gray-500 mb-4">Upload videos, documents, or add external links</p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <button
                                onClick={() => setShowUploader(true)}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                Upload Video
                            </button>
                            <button
                                onClick={() => setShowDocUploader(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Upload Document
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
