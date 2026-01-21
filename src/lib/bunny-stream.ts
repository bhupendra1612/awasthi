// Bunny Stream API Integration for Video Uploads

interface BunnyStreamUploadOptions {
    file: File;
    title: string;
    collectionId?: string;
    onProgress?: (progress: number) => void;
}

interface BunnyStreamUploadResult {
    success: boolean;
    videoId?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    error?: string;
}

interface BunnyStreamVideo {
    guid: string;
    title: string;
    videoLibraryId: number;
    thumbnailFileName: string;
    status: number;
}

/**
 * Upload a video to Bunny Stream
 * This uses the same Bunny Stream library as course videos
 */
export async function uploadToBunnyStream({
    file,
    title,
    collectionId,
    onProgress,
}: BunnyStreamUploadOptions): Promise<BunnyStreamUploadResult> {
    try {
        const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
        const apiKey = process.env.BUNNY_API_KEY;

        if (!libraryId || !apiKey) {
            throw new Error("Bunny Stream credentials not configured");
        }

        // Step 1: Create video object
        const createResponse = await fetch(
            `https://video.bunnycdn.com/library/${libraryId}/videos`,
            {
                method: "POST",
                headers: {
                    "AccessKey": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    collectionId: collectionId || undefined,
                }),
            }
        );

        if (!createResponse.ok) {
            throw new Error(`Failed to create video: ${createResponse.statusText}`);
        }

        const videoData: BunnyStreamVideo = await createResponse.json();
        const videoId = videoData.guid;

        // Step 2: Upload video file
        const uploadResult = await new Promise<boolean>((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable && onProgress) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    onProgress(progress);
                }
            });

            // Handle completion
            xhr.addEventListener("load", () => {
                if (xhr.status === 200 || xhr.status === 201) {
                    resolve(true);
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            // Handle errors
            xhr.addEventListener("error", () => {
                reject(new Error("Network error during upload"));
            });

            // Open connection
            xhr.open(
                "PUT",
                `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`
            );
            xhr.setRequestHeader("AccessKey", apiKey);

            // Send file
            xhr.send(file);
        });

        if (!uploadResult) {
            throw new Error("Video upload failed");
        }

        // Step 3: Get video URLs
        const cdnHostname = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME;
        const videoUrl = `https://${cdnHostname}/${videoId}/playlist.m3u8`;
        const thumbnailUrl = `https://${cdnHostname}/${videoId}/${videoData.thumbnailFileName}`;

        return {
            success: true,
            videoId: videoId,
            videoUrl: videoUrl,
            thumbnailUrl: thumbnailUrl,
        };
    } catch (error) {
        console.error("Bunny Stream upload error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Upload failed",
        };
    }
}

/**
 * Delete a video from Bunny Stream
 */
export async function deleteFromBunnyStream(videoId: string): Promise<boolean> {
    try {
        const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
        const apiKey = process.env.BUNNY_API_KEY;

        if (!libraryId || !apiKey) {
            throw new Error("Bunny Stream credentials not configured");
        }

        const response = await fetch(
            `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
            {
                method: "DELETE",
                headers: {
                    "AccessKey": apiKey,
                },
            }
        );

        return response.ok;
    } catch (error) {
        console.error("Bunny Stream delete error:", error);
        return false;
    }
}

/**
 * Get video information from Bunny Stream
 */
export async function getBunnyStreamVideo(videoId: string): Promise<BunnyStreamVideo | null> {
    try {
        const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
        const apiKey = process.env.BUNNY_API_KEY;

        if (!libraryId || !apiKey) {
            throw new Error("Bunny Stream credentials not configured");
        }

        const response = await fetch(
            `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
            {
                method: "GET",
                headers: {
                    "AccessKey": apiKey,
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Bunny Stream get video error:", error);
        return null;
    }
}

/**
 * Check if Bunny Stream is configured
 */
export function isBunnyStreamConfigured(): boolean {
    return !!(
        process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID &&
        process.env.BUNNY_API_KEY &&
        process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME
    );
}

/**
 * Extract video ID from Bunny Stream URL
 */
export function extractVideoIdFromUrl(url: string): string | null {
    try {
        // URL format: https://vz-xxx.b-cdn.net/{videoId}/playlist.m3u8
        const match = url.match(/\/([a-f0-9-]+)\//);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}
