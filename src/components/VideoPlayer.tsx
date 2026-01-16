"use client";

interface VideoPlayerProps {
    videoId: string;
    title?: string;
    className?: string;
}

export default function VideoPlayer({ videoId, title, className = "" }: VideoPlayerProps) {
    const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || "574761";
    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&preload=true`;

    return (
        <div className={`relative aspect-video bg-black rounded-xl overflow-hidden ${className}`}>
            <iframe
                src={embedUrl}
                title={title || "Video Player"}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}
