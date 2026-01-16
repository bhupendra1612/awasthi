"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { uploadImage, deleteImage, getPathFromUrl } from "@/lib/storage";
import type { ImageFolder } from "@/lib/storage";

interface ImageUploaderProps {
    currentImageUrl?: string | null;
    onImageChange: (url: string | null) => void;
    folder: ImageFolder;
    label?: string;
    aspectRatio?: "video" | "square" | "banner";
}

export default function ImageUploader({
    currentImageUrl,
    onImageChange,
    folder,
    label = "Upload Image",
    aspectRatio = "video",
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const aspectClasses = {
        video: "aspect-video",
        square: "aspect-square",
        banner: "aspect-[3/1]",
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB");
            return;
        }

        setError(null);
        setUploading(true);

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload to Supabase
        const result = await uploadImage(file, folder);

        if ("error" in result) {
            console.error("Upload failed:", result.error);
            setError(`Upload failed: ${result.error}`);
            setPreview(currentImageUrl || null);
        } else {
            console.log("Upload success:", result.url);
            setPreview(result.url); // Update preview with actual URL
            onImageChange(result.url);
        }

        setUploading(false);
    };

    const handleRemove = async () => {
        if (!currentImageUrl) return;

        setUploading(true);

        // Delete from storage
        const path = getPathFromUrl(currentImageUrl, "course-files");
        if (path) {
            await deleteImage(path);
        }

        setPreview(null);
        onImageChange(null);
        setUploading(false);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            <div
                className={`relative ${aspectClasses[aspectRatio]} bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 transition overflow-hidden`}
            >
                {preview ? (
                    <>
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        {/* Overlay with actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition flex items-center gap-2"
                            >
                                <Upload size={18} />
                                Change
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={uploading}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition flex items-center gap-2"
                            >
                                <X size={18} />
                                Remove
                            </button>
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="animate-spin text-white" size={32} />
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 hover:text-primary-600 transition"
                    >
                        {uploading ? (
                            <Loader2 className="animate-spin" size={32} />
                        ) : (
                            <>
                                <ImageIcon size={40} className="mb-2" />
                                <span className="text-sm font-medium">Click to upload</span>
                                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
