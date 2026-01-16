// Bunny Stream API utilities

const BUNNY_API_URL = "https://video.bunnycdn.com/library";
const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!;
const API_KEY = process.env.BUNNY_API_KEY!;

export interface BunnyVideo {
    guid: string;
    title: string;
    dateUploaded: string;
    views: number;
    status: number; // 0=created, 1=uploaded, 2=processing, 3=transcoding, 4=finished, 5=error
    length: number; // duration in seconds
    thumbnailFileName: string;
}

// Create a new video entry in Bunny
export async function createVideo(title: string): Promise<{ guid: string; uploadUrl: string }> {
    const response = await fetch(`${BUNNY_API_URL}/${LIBRARY_ID}/videos`, {
        method: "POST",
        headers: {
            "AccessKey": API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        throw new Error("Failed to create video");
    }

    const data = await response.json();
    return {
        guid: data.guid,
        uploadUrl: `${BUNNY_API_URL}/${LIBRARY_ID}/videos/${data.guid}`,
    };
}

// Get video details
export async function getVideo(videoId: string): Promise<BunnyVideo> {
    const response = await fetch(`${BUNNY_API_URL}/${LIBRARY_ID}/videos/${videoId}`, {
        headers: {
            "AccessKey": API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to get video");
    }

    return response.json();
}

// List all videos
export async function listVideos(page = 1, perPage = 100): Promise<{ items: BunnyVideo[]; totalItems: number }> {
    const response = await fetch(
        `${BUNNY_API_URL}/${LIBRARY_ID}/videos?page=${page}&itemsPerPage=${perPage}`,
        {
            headers: {
                "AccessKey": API_KEY,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to list videos");
    }

    return response.json();
}

// Delete a video
export async function deleteVideo(videoId: string): Promise<void> {
    const response = await fetch(`${BUNNY_API_URL}/${LIBRARY_ID}/videos/${videoId}`, {
        method: "DELETE",
        headers: {
            "AccessKey": API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete video");
    }
}

// Get video status text
export function getVideoStatusText(status: number): string {
    const statuses: Record<number, string> = {
        0: "Created",
        1: "Uploaded",
        2: "Processing",
        3: "Transcoding",
        4: "Ready",
        5: "Error",
    };
    return statuses[status] || "Unknown";
}

// Format duration
export function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Get embed URL for video player
export function getVideoEmbedUrl(videoId: string): string {
    return `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}`;
}

// Get thumbnail URL
export function getThumbnailUrl(videoId: string): string {
    const cdnHostname = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME;
    return `https://${cdnHostname}/${videoId}/thumbnail.jpg`;
}

// Get direct play URL (HLS)
export function getPlayUrl(videoId: string): string {
    const cdnHostname = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME;
    return `https://${cdnHostname}/${videoId}/playlist.m3u8`;
}
