"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon, Video } from "lucide-react";

interface GalleryItem {
    id: string;
    title: string;
    description: string | null;
    image_url: string;
    category: string;
    order_index: number;
    is_active: boolean;
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
}

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
    const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [loading, setLoading] = useState(true);

    const categories = [
        { value: "all", label: "All" },
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

    useEffect(() => {
        if (selectedCategory === "all") {
            setFilteredItems(galleryItems);
            setFilteredVideos(videoItems);
        } else {
            setFilteredItems(galleryItems.filter(item => item.category === selectedCategory));
            setFilteredVideos(videoItems.filter(item => item.category === selectedCategory));
        }
    }, [selectedCategory, galleryItems, videoItems]);

    const fetchGalleryItems = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("gallery")
                .select("*")
                .eq("is_active", true)
                .order("order_index", { ascending: true });

            if (error) throw error;
            setGalleryItems(data || []);
        } catch (error) {
            console.error("Error fetching gallery:", error);
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
                .eq("is_active", true)
                .order("order_index", { ascending: true });

            if (error) throw error;
            setVideoItems(data || []);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    const openLightbox = (item: GalleryItem) => {
        setLightboxImage(item);
    };

    const closeLightbox = () => {
        setLightboxImage(null);
    };

    const openVideoModal = (video: VideoItem) => {
        setSelectedVideo(video);
    };

    const closeVideoModal = () => {
        setSelectedVideo(null);
    };

    const navigateLightbox = (direction: "prev" | "next") => {
        if (!lightboxImage) return;

        const currentIndex = filteredItems.findIndex(item => item.id === lightboxImage.id);
        let newIndex;

        if (direction === "prev") {
            newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
        } else {
            newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
        }

        setLightboxImage(filteredItems[newIndex]);
    };

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Spacer for fixed header */}
            <div className="h-16"></div>

            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeIn">Our Gallery</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                        Glimpses of our coaching institute, events, and achievements
                    </p>
                </div>
            </div>

            {/* Tabs - Photos/Videos */}
            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-2 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("photos")}
                            className={`flex items-center gap-2 px-8 py-4 font-semibold transition-all relative ${activeTab === "photos"
                                ? "text-primary-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <ImageIcon size={20} />
                            Photos
                            {activeTab === "photos" && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-blue-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("videos")}
                            className={`flex items-center gap-2 px-8 py-4 font-semibold transition-all relative ${activeTab === "videos"
                                ? "text-primary-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <Video size={20} />
                            Videos
                            {activeTab === "videos" && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-blue-600"></div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${selectedCategory === category.value
                                    ? "bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg shadow-primary-600/30"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-primary-600"
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gallery Grid - Photos */}
            {activeTab === "photos" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {loading ? (
                        <div className="text-center py-32">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
                            <p className="mt-6 text-gray-600 text-lg font-medium">Loading gallery...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="text-6xl mb-4">📷</div>
                            <p className="text-gray-500 text-xl font-medium">No images found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => openLightbox(item)}
                                    className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    <Image
                                        src={item.image_url}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                                            {item.description && (
                                                <p className="text-white/90 text-sm line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Category Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {categories.find(c => c.value === item.category)?.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Gallery Grid - Videos */}
            {activeTab === "videos" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {loading ? (
                        <div className="text-center py-32">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
                            <p className="mt-6 text-gray-600 text-lg font-medium">Loading videos...</p>
                        </div>
                    ) : filteredVideos.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="text-6xl mb-4">🎥</div>
                            <p className="text-gray-500 text-xl font-medium">No videos found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredVideos.map((video, index) => (
                                <div
                                    key={video.id}
                                    onClick={() => openVideoModal(video)}
                                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    {video.thumbnail_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={video.thumbnail_url}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                            <Video size={64} className="text-white/50" />
                                        </div>
                                    )}
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                            <Play size={32} className="text-primary-600 ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                    {/* Video Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="text-white font-bold text-lg mb-1">{video.title}</h3>
                                        {video.description && (
                                            <p className="text-white/80 text-sm line-clamp-2 mb-2">
                                                {video.description}
                                            </p>
                                        )}
                                        {video.duration && (
                                            <span className="inline-block bg-black/50 px-2 py-1 rounded text-white text-xs">
                                                {formatDuration(video.duration)}
                                            </span>
                                        )}
                                    </div>
                                    {/* Category Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                                        {categories.find(c => c.value === video.category)?.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

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

            {/* Image Lightbox */}
            {lightboxImage && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 p-2 rounded-full hover:bg-white/10"
                    >
                        <X size={32} />
                    </button>
                    <button
                        onClick={() => navigateLightbox("prev")}
                        className="absolute left-4 text-white hover:text-gray-300 transition z-10 p-2 rounded-full hover:bg-white/10"
                    >
                        <ChevronLeft size={48} />
                    </button>
                    <button
                        onClick={() => navigateLightbox("next")}
                        className="absolute right-4 text-white hover:text-gray-300 transition z-10 p-2 rounded-full hover:bg-white/10"
                    >
                        <ChevronRight size={48} />
                    </button>
                    <div className="max-w-6xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={lightboxImage.image_url}
                                alt={lightboxImage.title}
                                width={1200}
                                height={800}
                                className="max-w-full max-h-full object-contain rounded-lg"
                            />
                        </div>
                        <div className="mt-6 text-center max-w-2xl">
                            <h3 className="text-white text-2xl font-semibold mb-2">{lightboxImage.title}</h3>
                            {lightboxImage.description && (
                                <p className="text-white/80">{lightboxImage.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <button
                        onClick={closeVideoModal}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 p-2 rounded-full hover:bg-white/10"
                    >
                        <X size={32} />
                    </button>
                    <div className="max-w-5xl w-full">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                            <video
                                src={selectedVideo.video_url}
                                controls
                                autoPlay
                                className="w-full h-full"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div className="text-center">
                            <h3 className="text-white text-2xl font-semibold mb-2">{selectedVideo.title}</h3>
                            {selectedVideo.description && (
                                <p className="text-white/80">{selectedVideo.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
