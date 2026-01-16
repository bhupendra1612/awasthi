import { createClient } from "@/lib/supabase/client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export type StorageBucket = "course-files";

export type ImageFolder = "courses" | "profiles" | "teachers" | "banners" | "course-thumbnails" | "test-thumbnails";
export type DocumentFolder = "pdfs" | "notes" | "tests" | "assignments";

/**
 * Upload an image to public storage
 */
export async function uploadImage(
    file: File,
    folder: ImageFolder,
    fileName?: string
): Promise<{ url: string; path: string } | { error: string }> {
    const supabase = createClient();

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const name = fileName || `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const path = `${folder}/${name}.${ext}`;

    const { error } = await supabase.storage
        .from("course-files")
        .upload(path, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (error) {
        console.error("Upload error:", error);
        return { error: error.message };
    }

    // Get public URL
    const url = `${SUPABASE_URL}/storage/v1/object/public/course-files/${path}`;

    return { url, path };
}

/**
 * Delete an image from public storage
 */
export async function deleteImage(path: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    const { error } = await supabase.storage
        .from("course-files")
        .remove([path]);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Upload a document to storage
 */
export async function uploadDocument(
    file: File,
    folder: DocumentFolder,
    fileName?: string
): Promise<{ path: string } | { error: string }> {
    const supabase = createClient();

    const ext = file.name.split(".").pop();
    const name = fileName || `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const path = `${folder}/${name}.${ext}`;

    const { error } = await supabase.storage
        .from("course-files")
        .upload(path, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (error) {
        return { error: error.message };
    }

    return { path };
}

/**
 * Delete a document from storage
 */
export async function deleteDocument(path: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    const { error } = await supabase.storage
        .from("course-files")
        .remove([path]);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Get signed URL for document (valid for 1 hour)
 */
export async function getSignedUrl(path: string): Promise<string | null> {
    const supabase = createClient();

    const { data, error } = await supabase.storage
        .from("course-files")
        .createSignedUrl(path, 3600); // 1 hour

    if (error || !data) {
        console.error("Signed URL error:", error);
        return null;
    }

    return data.signedUrl;
}

/**
 * Get public URL for document
 */
export function getDocumentUrl(path: string): string {
    return `${SUPABASE_URL}/storage/v1/object/public/course-files/${path}`;
}

/**
 * Extract path from full URL
 */
export function getPathFromUrl(url: string): string | null {
    const pattern = new RegExp(`/storage/v1/object/public/course-files/(.+)`);
    const match = url.match(pattern);
    return match ? match[1] : null;
}