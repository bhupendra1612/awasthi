"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Video, FileText, File, Trash2, Eye, Loader2, Search, Filter } from "lucide-react";
import Link from "next/link";

interface ContentItem {
    id: string;
    title: string;
    type: "video" | "pdf" | "document";
    url: string;
    duration: string | null;
    is_free: boolean;
    file_type: string | null;
    order_index: number;
    created_at: string;
    course_id: string;
    courses: {
        id: string;
        title: string;
    };
}

export default function ContentPage() {
    const supabase = createClient();
    const [content, setContent] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    async function fetchContent() {
        const { data, error } = await supabase
            .from("course_content")
            .select(`
                *,
                courses (
                    id,
                    title
                )
            `)
            .order("created_at", { ascending: false });

        if (data) {
            setContent(data as ContentItem[]);
        }
        setLoading(false);
    }

    const handleDelete = async (contentId: string) => {
        if (!confirm("Are you sure you want to delete this content?")) return;

        setDeleting(contentId);
        try {
            const { error } = await supabase
                .from("course_content")
                .delete()
                .eq("id", contentId);

            if (error) throw error;
            fetchContent();
        } catch (err) {
            alert("Failed to delete content");
        } finally {
            setDeleting(null);
        }
    };

    const toggleFree = async (contentId: string, currentValue: boolean) => {
        try {
            const { error } = await supabase
                .from("course_content")
                .update({ is_free: !currentValue })
                .eq("id", contentId);

            if (error) throw error;
            fetchContent();
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    // Check if URL is a Bunny video ID
    const isBunnyVideo = (url: string) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(url);
    };

    // Filter content
    const filteredContent = content.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.courses?.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || item.type === filterType;
        return matchesSearch && matchesType;
    });

    // Stats
    const stats = {
        total: content.length,
        videos: content.filter(c => c.type === "video").length,
        pdfs: content.filter(c => c.type === "pdf").length,
        documents: content.filter(c => c.type === "document").length,
        free: content.filter(c => c.is_free).length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Content Library</h2>
                <p className="text-gray-500 mt-1">Manage all course content in one place</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Total Content</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Videos</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.videos}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">PDFs</p>
                    <p className="text-2xl font-bold text-red-600">{stats.pdfs}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Documents</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.documents}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Free Content</p>
                    <p className="text-2xl font-bold text-green-600">{stats.free}</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search content or course name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="all">All Types</option>
                            <option value="video">Videos</option>
                            <option value="pdf">PDFs</option>
                            <option value="document">Documents</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filteredContent.length > 0 ? (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Content</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Course</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Type</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Access</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredContent.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
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
                                            <div>
                                                <p className="font-medium text-gray-900">{item.title}</p>
                                                <p className="text-xs text-gray-400">
                                                    {item.type === "video" && isBunnyVideo(item.url)
                                                        ? "Bunny Stream"
                                                        : item.type === "video"
                                                            ? "External Video"
                                                            : item.file_type || item.type.toUpperCase()}
                                                    {item.duration && ` • ${item.duration}`}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/courses/${item.course_id}/content`}
                                            className="text-primary-600 hover:underline text-sm"
                                        >
                                            {item.courses?.title || "Unknown Course"}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${item.type === "video" ? "bg-blue-100 text-blue-700" :
                                                item.type === "document" ? "bg-orange-100 text-orange-700" :
                                                    "bg-red-100 text-red-700"
                                            }`}>
                                            {item.type === "video" ? <Video size={12} /> :
                                                item.type === "document" ? <File size={12} /> :
                                                    <FileText size={12} />}
                                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleFree(item.id, item.is_free)}
                                            className={`text-xs px-3 py-1 rounded-full ${item.is_free
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {item.is_free ? "Free" : "Paid"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {item.type !== "video" || !isBunnyVideo(item.url) ? (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </a>
                                            ) : null}
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deleting === item.id}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {deleting === item.id ? (
                                                    <Loader2 className="animate-spin" size={18} />
                                                ) : (
                                                    <Trash2 size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchQuery || filterType !== "all" ? "No content found" : "No content yet"}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {searchQuery || filterType !== "all"
                                ? "Try adjusting your search or filter"
                                : "Add content to your courses to see them here"}
                        </p>
                        <Link
                            href="/admin/courses"
                            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                        >
                            Go to Courses
                        </Link>
                    </div>
                )}
            </div>

            {/* Info Note */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                    <strong>Tip:</strong> To add new content, go to a specific course and click "Manage Content" or use the + button in the courses list.
                </p>
            </div>
        </div>
    );
}
