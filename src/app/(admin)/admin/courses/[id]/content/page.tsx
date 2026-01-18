"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Video, FileText, Plus, Trash2, Edit, GripVertical, Youtube, Save, X, Upload, ExternalLink, FolderPlus, Folder, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import VideoUploader from "@/components/admin/VideoUploader";

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

export default function AdminCourseContentPage() {
    const params = useParams();
    const courseId = params.id as string;
    const supabase = createClient();

    const [course, setCourse] = useState<any>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(["uncategorized"]));

    // Chapter form
    const [showChapterForm, setShowChapterForm] = useState(false);
    const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
    const [chapterForm, setChapterForm] = useState({ title: "", description: "" });
    const [savingChapter, setSavingChapter] = useState(false);

    // Video form
    const [showVideoForm, setShowVideoForm] = useState(false);
    const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
    const [selectedChapterForVideo, setSelectedChapterForVideo] = useState<string | null>(null);
    const [videoForm, setVideoForm] = useState({
        title: "", description: "", video_id: "", video_url: "",
        video_type: "youtube" as "youtube" | "upload", duration: "", is_free: false,
    });
    const [savingVideo, setSavingVideo] = useState(false);
    // Video uploader states
    const [showVideoUploader, setShowVideoUploader] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);

    // Document form
    const [showDocForm, setShowDocForm] = useState(false);
    const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
    const [selectedChapterForDoc, setSelectedChapterForDoc] = useState<string | null>(null);
    const [docForm, setDocForm] = useState({ title: "", description: "", file_url: "" });
    const [savingDoc, setSavingDoc] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);

    useEffect(() => { fetchData(); }, [courseId]);

    async function fetchData() {
        const { data: courseData } = await supabase.from("courses").select("*").eq("id", courseId).single();
        setCourse(courseData);
        const { data: chaptersData } = await supabase.from("chapters").select("*").eq("course_id", courseId).order("order_index");
        setChapters(chaptersData || []);
        const { data: videosData } = await supabase.from("videos").select("*").eq("course_id", courseId).order("order_index");
        setVideos(videosData || []);
        const { data: docsData } = await supabase.from("documents").select("*").eq("course_id", courseId).order("created_at");
        setDocuments(docsData || []);
        setLoading(false);
    }

    function toggleChapter(chapterId: string) {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(chapterId)) newExpanded.delete(chapterId);
        else newExpanded.add(chapterId);
        setExpandedChapters(newExpanded);
    }

    async function handleSaveChapter(e: React.FormEvent) {
        e.preventDefault();
        setSavingChapter(true);
        try {
            if (editingChapter) {
                await supabase.from("chapters").update({ title: chapterForm.title, description: chapterForm.description || null }).eq("id", editingChapter.id);
            } else {
                await supabase.from("chapters").insert({ course_id: courseId, title: chapterForm.title, description: chapterForm.description || null, order_index: chapters.length });
            }
            setShowChapterForm(false); setEditingChapter(null); setChapterForm({ title: "", description: "" }); fetchData();
        } finally { setSavingChapter(false); }
    }

    async function handleDeleteChapter(id: string) {
        if (!confirm("Delete this chapter? Content will be moved to uncategorized.")) return;
        await supabase.from("videos").update({ chapter_id: null }).eq("chapter_id", id);
        await supabase.from("documents").update({ chapter_id: null }).eq("chapter_id", id);
        await supabase.from("chapters").delete().eq("id", id);
        fetchData();
    }

    function extractYouTubeId(url: string): string {
        const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /^([a-zA-Z0-9_-]{11})$/];
        for (const pattern of patterns) { const match = url.match(pattern); if (match) return match[1]; }
        return url;
    }

    async function handleBunnyVideoUploadComplete(videoId: string, title: string) {
        setSavingVideo(true);
        try {
            const videoData = {
                course_id: courseId,
                title: title,
                video_id: videoId,
                video_type: "bunny",
                video_url: null,
                duration: null,
                is_free: false,
                chapter_id: selectedChapterForVideo || null,
                order_index: videos.length,
            };

            const { error } = await supabase.from("videos").insert(videoData);
            if (error) throw error;

            setShowVideoUploader(false);
            setSelectedChapterForVideo(null);
            fetchData();
        } catch (error: any) {
            console.error("Save video error:", error);
            alert(`Video uploaded to Bunny but failed to save to course: ${error.message}`);
        } finally {
            setSavingVideo(false);
        }
    }

    async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        // This function is no longer used - we use the VideoUploader component for Bunny.net uploads
        alert("Please use the 'Upload Video' button to upload videos through Bunny.net");
    }

    async function handleSaveVideo(e: React.FormEvent) {
        e.preventDefault();
        setSavingVideo(true);
        try {
            const videoData: any = {
                title: videoForm.title, description: videoForm.description || null, video_type: videoForm.video_type,
                duration: videoForm.duration ? parseInt(videoForm.duration) : null, is_free: videoForm.is_free, chapter_id: selectedChapterForVideo || null,
            };
            if (videoForm.video_type === "youtube") { videoData.video_id = extractYouTubeId(videoForm.video_id); videoData.video_url = null; }
            else { videoData.video_url = videoForm.video_url; videoData.video_id = ""; }
            if (editingVideo) { await supabase.from("videos").update(videoData).eq("id", editingVideo.id); }
            else { await supabase.from("videos").insert({ ...videoData, course_id: courseId, order_index: videos.length }); }
            setShowVideoForm(false); setEditingVideo(null);
            setVideoForm({ title: "", description: "", video_id: "", video_url: "", video_type: "youtube", duration: "", is_free: false });
            setSelectedChapterForVideo(null); fetchData();
        } finally { setSavingVideo(false); }
    }

    async function handleDeleteVideo(id: string) {
        if (!confirm("Delete this video?")) return;
        await supabase.from("videos").delete().eq("id", id); fetchData();
    }

    function openVideoForm(chapterId: string | null) {
        setSelectedChapterForVideo(chapterId); setEditingVideo(null);
        setVideoForm({ title: "", description: "", video_id: "", video_url: "", video_type: "youtube", duration: "", is_free: false });
        setShowVideoForm(true);
    }

    function openBunnyVideoUploader(chapterId: string | null) {
        setSelectedChapterForVideo(chapterId);
        setShowVideoUploader(true);
    }

    function editVideo(video: VideoItem) {
        setEditingVideo(video); setSelectedChapterForVideo(video.chapter_id);
        setVideoForm({
            title: video.title, description: video.description || "", video_id: video.video_id || "", video_url: video.video_url || "",
            video_type: (video.video_type as "youtube" | "upload") || "youtube", duration: video.duration?.toString() || "", is_free: video.is_free
        });
        setShowVideoForm(true);
    }

    async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingDoc(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `documents/${courseId}/${fileName}`;
            const { error } = await supabase.storage.from("course-files").upload(filePath, file, { cacheControl: '3600', upsert: false });
            if (error) throw new Error(error.message);
            const { data: { publicUrl } } = supabase.storage.from("course-files").getPublicUrl(filePath);
            setDocForm({ ...docForm, file_url: publicUrl });
        } catch (error: any) { alert(`Failed to upload: ${error.message}`); }
        finally { setUploadingDoc(false); }
    }

    async function handleSaveDoc(e: React.FormEvent) {
        e.preventDefault();
        if (!docForm.file_url) { alert("Please upload a file"); return; }
        setSavingDoc(true);
        try {
            const fileType = docForm.file_url.split(".").pop()?.toLowerCase() || "pdf";
            const docData = { title: docForm.title, description: docForm.description || null, file_url: docForm.file_url, file_type: fileType, chapter_id: selectedChapterForDoc || null };
            if (editingDoc) { await supabase.from("documents").update(docData).eq("id", editingDoc.id); }
            else { await supabase.from("documents").insert({ ...docData, course_id: courseId }); }
            setShowDocForm(false); setEditingDoc(null); setDocForm({ title: "", description: "", file_url: "" }); setSelectedChapterForDoc(null); fetchData();
        } finally { setSavingDoc(false); }
    }

    async function handleDeleteDoc(id: string) {
        if (!confirm("Delete this document?")) return;
        await supabase.from("documents").delete().eq("id", id); fetchData();
    }

    function openDocForm(chapterId: string | null) {
        setSelectedChapterForDoc(chapterId); setEditingDoc(null); setDocForm({ title: "", description: "", file_url: "" }); setShowDocForm(true);
    }

    const getChapterVideos = (chapterId: string | null) => videos.filter(v => v.chapter_id === chapterId);
    const getChapterDocs = (chapterId: string | null) => documents.filter(d => d.chapter_id === chapterId);

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;
    if (!course) return <div className="text-center py-20"><p className="text-gray-500">Course not found</p></div>;

    const renderChapterContent = (chapterId: string | null, chapterTitle: string) => {
        const chapterVideos = getChapterVideos(chapterId);
        const chapterDocs = getChapterDocs(chapterId);
        const isExpanded = expandedChapters.has(chapterId || "uncategorized");

        return (
            <div key={chapterId || "uncategorized"} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition" onClick={() => toggleChapter(chapterId || "uncategorized")}>
                    <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronRight size={20} className="text-gray-500" />}
                        <Folder className="text-primary-600" size={20} />
                        <span className="font-semibold text-gray-900">{chapterTitle}</span>
                        <span className="text-sm text-gray-500">({chapterVideos.length} videos, {chapterDocs.length} docs)</span>
                    </div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openBunnyVideoUploader(chapterId)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Upload Video"><Upload size={18} /></button>
                        <button onClick={() => openVideoForm(chapterId)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Add YouTube Video"><Youtube size={18} /></button>
                        <button onClick={() => openDocForm(chapterId)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Add Document"><FileText size={18} /></button>
                        {chapterId && (
                            <>
                                <button onClick={() => { const ch = chapters.find(c => c.id === chapterId)!; setEditingChapter(ch); setChapterForm({ title: ch.title, description: ch.description || "" }); setShowChapterForm(true); }} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Edit size={18} /></button>
                                <button onClick={() => handleDeleteChapter(chapterId)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                            </>
                        )}
                    </div>
                </div>
                {isExpanded && (
                    <div className="p-4 space-y-3">
                        {chapterVideos.length === 0 && chapterDocs.length === 0 ? (
                            <p className="text-center text-gray-400 py-4">No content yet. Add videos or documents.</p>
                        ) : (
                            <>
                                {chapterVideos.map((video, idx) => (
                                    <div key={video.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">{idx + 1}</span>
                                        {video.video_type === "youtube" ? (
                                            <div className="w-20 h-12 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                                                <img src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0"><Video className="text-white" size={20} /></div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{video.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                {video.video_type === "youtube" ? <Youtube size={12} className="text-red-500" /> : <Upload size={12} className="text-blue-500" />}
                                                <span>{video.video_type === "youtube" ? "YouTube" : "Uploaded"}</span>
                                                {video.duration && <span>• {video.duration} min</span>}
                                                {video.is_free && <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Free</span>}
                                            </div>
                                        </div>
                                        <button onClick={() => editVideo(video)} className="p-2 text-gray-400 hover:text-primary-600"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteVideo(video.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                {chapterDocs.map((doc) => (
                                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><FileText className="text-red-600" size={20} /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{doc.title}</p>
                                            <span className="text-xs text-gray-500 uppercase">{doc.file_type}</span>
                                        </div>
                                        <a href={doc.file_url} target="_blank" className="p-2 text-gray-400 hover:text-primary-600"><ExternalLink size={16} /></a>
                                        <button onClick={() => { setEditingDoc(doc); setSelectedChapterForDoc(doc.chapter_id); setDocForm({ title: doc.title, description: doc.description || "", file_url: doc.file_url }); setShowDocForm(true); }} className="p-2 text-gray-400 hover:text-primary-600"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Link href={`/admin/courses/${courseId}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition">
                <ArrowLeft size={20} /> Back to Course
            </Link>

            <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-2xl p-6 text-white mb-6">
                <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-300">Organize course content by chapters/topics</p>
                <div className="flex gap-4 mt-4 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full">{chapters.length} Chapters</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">{videos.length} Videos</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">{documents.length} Documents</span>
                </div>
            </div>

            <button onClick={() => { setEditingChapter(null); setChapterForm({ title: "", description: "" }); setShowChapterForm(true); }} className="w-full bg-white border-2 border-dashed border-primary-300 rounded-xl p-4 text-primary-600 hover:border-primary-500 hover:bg-primary-50 transition flex items-center justify-center gap-2 mb-6">
                <FolderPlus size={24} /> Add New Chapter/Topic
            </button>

            <div className="space-y-4">
                {chapters.map(chapter => renderChapterContent(chapter.id, chapter.title))}
                {renderChapterContent(null, "📁 Uncategorized Content")}
            </div>

            {/* Bunny Video Uploader */}
            {showVideoUploader && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl">
                        <VideoUploader
                            onUploadComplete={handleBunnyVideoUploadComplete}
                            onCancel={() => setShowVideoUploader(false)}
                        />
                    </div>
                </div>
            )}

            {/* Chapter Modal */}
            {showChapterForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">{editingChapter ? "Edit Chapter" : "Add Chapter"}</h3>
                            <button onClick={() => setShowChapterForm(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveChapter} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chapter/Topic Title *</label>
                                <input type="text" value={chapterForm.title} onChange={e => setChapterForm({ ...chapterForm, title: e.target.value })} placeholder="e.g., Chapter 1: Introduction" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea value={chapterForm.description} onChange={e => setChapterForm({ ...chapterForm, description: e.target.value })} placeholder="Brief description..." rows={2} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={savingChapter} className="flex-1 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                                    {savingChapter ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    {editingChapter ? "Update" : "Create"} Chapter
                                </button>
                                <button type="button" onClick={() => setShowChapterForm(false)} className="px-6 py-3 border rounded-xl hover:bg-gray-50">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {showVideoForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">{editingVideo ? "Edit Video" : "Add Video"}</h3>
                            <button onClick={() => setShowVideoForm(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveVideo} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Video Title *</label>
                                <input type="text" value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="e.g., Introduction to Algebra" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL or ID *</label>
                                <div className="relative">
                                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                                    <input type="text" value={videoForm.video_id} onChange={e => setVideoForm({ ...videoForm, video_id: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                                    <input type="number" value={videoForm.duration} onChange={e => setVideoForm({ ...videoForm, duration: e.target.value })} placeholder="15" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
                                    <select value={selectedChapterForVideo || ""} onChange={e => setSelectedChapterForVideo(e.target.value || null)} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                                        <option value="">Uncategorized</option>
                                        {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
                                    </select>
                                </div>
                            </div>
                            <label className="flex items-center gap-3 p-4 bg-green-50 rounded-xl cursor-pointer">
                                <input type="checkbox" checked={videoForm.is_free} onChange={e => setVideoForm({ ...videoForm, is_free: e.target.checked })} className="w-5 h-5 text-green-600 rounded" />
                                <div><span className="font-medium text-gray-900">Free Preview</span><p className="text-sm text-gray-500">Allow non-enrolled students to watch</p></div>
                            </label>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={savingVideo} className="flex-1 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                                    {savingVideo ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    {editingVideo ? "Update" : "Add"} YouTube Video
                                </button>
                                <button type="button" onClick={() => setShowVideoForm(false)} className="px-6 py-3 border rounded-xl hover:bg-gray-50">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Document Modal */}
            {showDocForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">{editingDoc ? "Edit Document" : "Add Document"}</h3>
                            <button onClick={() => setShowDocForm(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveDoc} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Document Title *</label>
                                <input type="text" value={docForm.title} onChange={e => setDocForm({ ...docForm, title: e.target.value })} placeholder="e.g., Chapter 1 Notes" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea value={docForm.description} onChange={e => setDocForm({ ...docForm, description: e.target.value })} placeholder="Brief description..." rows={2} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
                                <select value={selectedChapterForDoc || ""} onChange={e => setSelectedChapterForDoc(e.target.value || null)} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                                    <option value="">Uncategorized</option>
                                    {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File *</label>
                                {docForm.file_url ? (
                                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                                        <FileText className="text-green-600" size={24} />
                                        <span className="flex-1 text-sm text-green-700 truncate">File uploaded</span>
                                        <button type="button" onClick={() => setDocForm({ ...docForm, file_url: "" })} className="text-red-500"><X size={18} /></button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary-400 transition">
                                        {uploadingDoc ? <Loader2 className="animate-spin text-primary-600" size={32} /> : (
                                            <><Upload className="text-gray-400 mb-2" size={32} /><span className="text-sm text-gray-500">PDF, DOC, DOCX, Images</span></>
                                        )}
                                        <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleDocUpload} className="hidden" disabled={uploadingDoc} />
                                    </label>
                                )}
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={savingDoc || !docForm.file_url} className="flex-1 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                                    {savingDoc ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    {editingDoc ? "Update" : "Add"} Document
                                </button>
                                <button type="button" onClick={() => setShowDocForm(false)} className="px-6 py-3 border rounded-xl hover:bg-gray-50">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
