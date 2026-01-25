"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Upload, Trash2, Eye, EyeOff, Video, Image as ImageIcon } from "lucide-react";
import { uploadToBunnyStream, isBunnyStreamConfigured, extractVideoIdFromUrl, deleteFromBunnyStream } from "@/lib/bunny-stream";

interface GalleryItem {
    id: string;
    title: string;
    description: string | null;
    image_url: string;
    category: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
}

interface VideoItem {
    id: string;
    title: string;
    description: string | null;
    video_url: string;
    thumbnail_url: string | null;
    category: string;
    duration: number | null;
    order_index: number;
    is_active: boolean;
    created_at: string;
}

export default function AdminGalleryPage() {
    const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "classroom",
        order_index: 0,
        is_active: true,
    });
    const [videoFormData, setVideoFormData] = useState({
        title: "",
        description: "",
        video_url: "",
        thumbnail_url: "",
        category: "classroom",
        duration: 0,
        order_index: 0,
        is_active: true,
    });
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [thumbnailProgress, setThumbnailProgress] = useState(0);
    const [bunnyConfigured, setBunnyConfigured] = useState(false);

    useEffect(() => {
        setBunnyConfigured(isBunnyStreamConfigured());
    }, []);

    const categories = [
        { value: "classroom", label: "Classroom" },
        { value: "events", label: "Events" },
        { value: "facilities", label: "Facilities" },
        { value: "achievements", label: "Achievements" },
        { value: "testimonials", label: "Testimonials" },
    ];

    useEffect(() => {
        fetchGalleryItems();
        fetchVideoItems();
    }, []);

    const fetchGalleryItems = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("gallery")
                .select("*")
                .order("order_index", { ascending: true });

            if (error) throw error;
            setGalleryItems(data || []);
        } catch (error) {
            console.error("Error fetching gallery:", error);
            alert("Failed to fetch gallery items");
        } finally {
            setLoading(false);
        }
    };

    const fetchVideoItems = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("video_gallery")
                .select("*")
                .order("order_index", { ascending: true });

            if (error) throw error;
            setVideoItems(data || []);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        setUploading(true);
        try {
            const supabase = createClient();
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = fileName; // Fixed: removed duplicate "gallery/" prefix

            const { error: uploadError } = await supabase.storage
                .from("gallery")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("gallery")
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from("gallery")
                .insert({
                    title: formData.title || file.name,
                    description: formData.description || null,
                    image_url: publicUrl,
                    category: formData.category,
                    order_index: formData.order_index,
                    is_active: formData.is_active,
                });

            if (dbError) throw dbError;

            alert("Image uploaded successfully!");
            setFormData({
                title: "",
                description: "",
                category: "classroom",
                order_index: 0,
                is_active: true,
            });
            fetchGalleryItems();
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleVideoSubmit = async () => {
        if (!videoFormData.title) {
            alert("Please fill in title");
            return;
        }

        // Check if we have either a URL or a file
        if (!videoFormData.video_url && !videoFile) {
            alert("Please provide a video URL or upload a video file");
            return;
        }

        try {
            const supabase = createClient();
            let finalVideoUrl = videoFormData.video_url;
            let finalThumbnailUrl = videoFormData.thumbnail_url;

            // Upload video file to Bunny Stream if provided
            if (videoFile) {
                if (!bunnyConfigured) {
                    alert("Bunny Stream is not configured. Please check your .env.local file.");
                    return;
                }

                setUploadingVideo(true);
                setUploadProgress(0);

                const result = await uploadToBunnyStream({
                    file: videoFile,
                    title: videoFormData.title,
                    onProgress: (progress) => setUploadProgress(progress),
                });

                if (!result.success) {
                    throw new Error(result.error || "Video upload failed");
                }

                finalVideoUrl = result.videoUrl!;
                finalThumbnailUrl = result.thumbnailUrl || finalThumbnailUrl;
                setUploadingVideo(false);
            }

            // Upload thumbnail to Supabase Storage if provided (thumbnails are small, no need for Bunny)
            if (thumbnailFile) {
                setUploadingThumbnail(true);
                setThumbnailProgress(0);

                const fileExt = thumbnailFile.name.split(".").pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `gallery/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("gallery")
                    .upload(filePath, thumbnailFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from("gallery")
                    .getPublicUrl(filePath);

                finalThumbnailUrl = publicUrl;
                setUploadingThumbnail(false);
            }

            // Insert into database
            const { error } = await supabase
                .from("video_gallery")
                .insert({
                    title: videoFormData.title,
                    description: videoFormData.description || null,
                    video_url: finalVideoUrl,
                    thumbnail_url: finalThumbnailUrl || null,
                    category: videoFormData.category,
                    duration: videoFormData.duration || null,
                    order_index: videoFormData.order_index,
                    is_active: videoFormData.is_active,
                });

            if (error) throw error;

            alert("Video added successfully!");
            setVideoFormData({
                title: "",
                description: "",
                video_url: "",
                thumbnail_url: "",
                category: "classroom",
                duration: 0,
                order_index: 0,
                is_active: true,
            });
            setVideoFile(null);
            setThumbnailFile(null);
            setUploadProgress(0);
            setThumbnailProgress(0);
            fetchVideoItems();
        } catch (error) {
            console.error("Error adding video:", error);
            alert(`Failed to add video: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setUploadingVideo(false);
            setUploadingThumbnail(false);
        }
    };

    const handleDeleteImage = async (id: string, imageUrl: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            const supabase = createClient();
            const filePath = imageUrl.split("/").slice(-2).join("/");
            await supabase.storage.from("gallery").remove([filePath]);

            const { error } = await supabase
                .from("gallery")
                .delete()
                .eq("id", id);

            if (error) throw error;

            alert("Image deleted successfully!");
            fetchGalleryItems();
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image");
        }
    };

    const handleDeleteVideo = async (id: string, videoUrl: string) => {
        if (!confirm("Are you sure you want to delete this video?")) return;

        try {
            const supabase = createClient();

            // Try to delete from Bunny Stream if it's a Bunny video
            const videoId = extractVideoIdFromUrl(videoUrl);
            if (videoId) {
                await deleteFromBunnyStream(videoId);
            }

            // Delete from database
            const { error } = await supabase
                .from("video_gallery")
                .delete()
                .eq("id", id);

            if (error) throw error;

            alert("Video deleted successfully!");
            fetchVideoItems();
        } catch (error) {
            console.error("Error deleting video:", error);
            alert("Failed to delete video");
        }
    };

    const handleToggleImageActive = async (id: string, currentStatus: boolean) => {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("gallery")
                .update({ is_active: !currentStatus })
                .eq("id", id);

            if (error) throw error;
            fetchGalleryItems();
        } catch (error) {
            console.error("Error toggling status:", error);
            alert("Failed to update status");
        }
    };

    const handleToggleVideoActive = async (id: string, currentStatus: boolean) => {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("video_gallery")
                .update({ is_active: !currentStatus })
                .eq("id", id);

            if (error) throw error;
            fetchVideoItems();
        } catch (error) {
            console.error("Error toggling status:", error);
            alert("Failed to update status");
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                <p className="text-gray-600 mt-2">Upload and manage photos and videos</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("photos")}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${activeTab === "photos"
                        ? "text-primary-600"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <ImageIcon size={20} />
                    Photos ({galleryItems.length})
                    {activeTab === "photos" && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("videos")}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${activeTab === "videos"
                        ? "text-primary-600"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <Video size={20} />
                    Videos ({videoItems.length})
                    {activeTab === "videos" && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600"></div>
                    )}
                </button>
            </div>

            {/* Photos Tab */}
            {activeTab === "photos" && (
                <>
                    {/* Upload Form */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Enter image title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Optional description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order Index
                                </label>
                                <input
                                    type="number"
                                    value={formData.order_index}
                                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition">
                                <Upload size={20} />
                                {uploading ? "Uploading..." : "Choose Image"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-sm text-gray-500">Max size: 5MB. Formats: JPG, PNG, WebP</p>
                        </div>
                    </div>

                    {/* Gallery Items */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Gallery Items ({galleryItems.length})
                        </h2>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                            </div>
                        ) : galleryItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-12">No images uploaded yet</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {galleryItems.map((item) => (
                                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="relative aspect-square">
                                            <Image
                                                src={item.image_url}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                            {!item.is_active && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="text-white font-semibold">Hidden</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {categories.find(c => c.value === item.category)?.label}
                                            </p>
                                            {item.description && (
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => handleToggleImageActive(item.id, item.is_active)}
                                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${item.is_active
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {item.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteImage(item.id, item.image_url)}
                                                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                                                >
                                                    <Trash2 size={16} className="mx-auto" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Videos Tab */}
            {activeTab === "videos" && (
                <>
                    {/* Video Form */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Add New Video</h2>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Two Options:</strong>
                                <br />
                                1. <strong>Upload from Computer:</strong> Select video and thumbnail files below
                                <br />
                                2. <strong>Use Bunny CDN:</strong> Paste video URL and thumbnail URL (for faster loading)
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={videoFormData.title}
                                    onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Enter video title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={videoFormData.category}
                                    onChange={(e) => setVideoFormData({ ...videoFormData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Option 1: Upload from Computer */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Option 1: Upload from Computer to Bunny Stream</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Videos upload to the same Bunny Stream library as your course videos (Library ID: {process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID})
                            </p>
                            {!bunnyConfigured && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-amber-800">
                                        ⚠️ <strong>Bunny Stream not configured.</strong> Please check your .env.local file.
                                    </p>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Video File (Max 500MB)
                                    </label>
                                    <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition ${bunnyConfigured
                                        ? "bg-primary-600 text-white hover:bg-primary-700 cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}>
                                        <Upload size={20} />
                                        {uploadingVideo ? `Uploading... ${uploadProgress}%` : videoFile ? videoFile.name : "Choose Video"}
                                        <input
                                            type="file"
                                            accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                            disabled={uploadingVideo || !bunnyConfigured}
                                            className="hidden"
                                        />
                                    </label>
                                    {videoFile && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    )}
                                    {uploadingVideo && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thumbnail Image (Optional)
                                    </label>
                                    <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition ${bunnyConfigured
                                        ? "bg-gray-600 text-white hover:bg-gray-700 cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}>
                                        <Upload size={20} />
                                        {uploadingThumbnail ? `Uploading... ${thumbnailProgress}%` : thumbnailFile ? thumbnailFile.name : "Choose Thumbnail"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                                            disabled={uploadingThumbnail || !bunnyConfigured}
                                            className="hidden"
                                        />
                                    </label>
                                    {thumbnailFile && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Size: {(thumbnailFile.size / 1024).toFixed(2)} KB
                                        </p>
                                    )}
                                    {uploadingThumbnail && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${thumbnailProgress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Option 2: Bunny Stream URLs */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Option 2: Use Existing Bunny Stream Video</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                If you already uploaded a video to Bunny Stream, paste the video URL here
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Video URL (Bunny Stream)
                                    </label>
                                    <input
                                        type="url"
                                        value={videoFormData.video_url}
                                        onChange={(e) => setVideoFormData({ ...videoFormData, video_url: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="https://vz-xxx.b-cdn.net/{videoId}/playlist.m3u8"
                                        disabled={!!videoFile}
                                    />
                                    {videoFile && (
                                        <p className="text-xs text-amber-600 mt-1">
                                            Video file selected - URL will be ignored
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thumbnail URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={videoFormData.thumbnail_url}
                                        onChange={(e) => setVideoFormData({ ...videoFormData, thumbnail_url: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="https://your-bunny-cdn-url.com/thumbnail.jpg"
                                        disabled={!!thumbnailFile}
                                    />
                                    {thumbnailFile && (
                                        <p className="text-xs text-amber-600 mt-1">
                                            Thumbnail file selected - URL will be ignored
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={videoFormData.description}
                                    onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Optional description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (seconds)
                                </label>
                                <input
                                    type="number"
                                    value={videoFormData.duration}
                                    onChange={(e) => setVideoFormData({ ...videoFormData, duration: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="e.g., 120"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleVideoSubmit}
                            disabled={uploadingVideo || uploadingThumbnail}
                            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {uploadingVideo || uploadingThumbnail ? "Uploading..." : "Add Video"}
                        </button>
                    </div>

                    {/* Video Items */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Video Items ({videoItems.length})
                        </h2>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                            </div>
                        ) : videoItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-12">No videos added yet</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videoItems.map((video) => (
                                    <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="relative aspect-video bg-gray-900">
                                            {video.thumbnail_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={video.thumbnail_url}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Video size={48} className="text-white/50" />
                                                </div>
                                            )}
                                            {!video.is_active && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="text-white font-semibold">Hidden</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 truncate">{video.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {categories.find(c => c.value === video.category)?.label}
                                            </p>
                                            {video.description && (
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                    {video.description}
                                                </p>
                                            )}
                                            {video.duration && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                                </p>
                                            )}
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => handleToggleVideoActive(video.id, video.is_active)}
                                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${video.is_active
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {video.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVideo(video.id, video.video_url)}
                                                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                                                >
                                                    <Trash2 size={16} className="mx-auto" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
