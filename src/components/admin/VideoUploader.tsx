"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle, Film } from "lucide-react";
import * as tus from "tus-js-client";

interface VideoUploaderProps {
    onUploadComplete: (videoId: string, title: string) => void;
    onCancel?: () => void;
}

export default function VideoUploader({ onUploadComplete, onCancel }: VideoUploaderProps) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"idle" | "creating" | "uploading" | "done" | "error">("idle");
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadRef = useRef<tus.Upload | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith("video/")) {
                setError("Please select a video file");
                return;
            }
            setFile(selectedFile);
            if (!title) {
                setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
            }
            setError("");
        }
    };

    const handleUpload = async () => {
        if (!file || !title.trim()) {
            setError("Please provide a title and select a video file");
            return;
        }

        setUploading(true);
        setError("");
        setProgress(0);

        try {
            // Step 1: Create video entry in Bunny and get auth signature
            setStatus("creating");
            const createRes = await fetch("/api/videos/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: title.trim() }),
            });

            if (!createRes.ok) {
                const errData = await createRes.json();
                throw new Error(errData.error || "Failed to create video entry");
            }

            const { videoId, libraryId, expirationTime, signature } = await createRes.json();
            setProgress(5);

            // Step 2: Upload using TUS protocol with proper authentication
            setStatus("uploading");

            const upload = new tus.Upload(file, {
                endpoint: "https://video.bunnycdn.com/tusupload",
                retryDelays: [0, 3000, 5000, 10000, 20000],
                headers: {
                    "AuthorizationSignature": signature,
                    "AuthorizationExpire": String(expirationTime),
                    "VideoId": videoId,
                    "LibraryId": libraryId,
                },
                metadata: {
                    filetype: file.type,
                    title: title.trim(),
                },
                onError: (err) => {
                    console.error("TUS upload error:", err);
                    setError("Upload failed: " + err.message);
                    setStatus("error");
                    setUploading(false);
                },
                onProgress: (bytesUploaded, bytesTotal) => {
                    const percentage = Math.round((bytesUploaded / bytesTotal) * 90) + 5;
                    setProgress(percentage);
                },
                onSuccess: () => {
                    setProgress(100);
                    setStatus("done");
                    setTimeout(() => {
                        onUploadComplete(videoId, title.trim());
                    }, 1000);
                },
            });

            uploadRef.current = upload;

            // Check for previous uploads to resume
            const previousUploads = await upload.findPreviousUploads();
            if (previousUploads.length > 0) {
                upload.resumeFromPreviousUpload(previousUploads[0]);
            }

            upload.start();

        } catch (err) {
            console.error("Upload error:", err);
            setError(err instanceof Error ? err.message : "Upload failed");
            setStatus("error");
            setUploading(false);
        }
    };

    const handleCancel = () => {
        if (uploadRef.current) {
            uploadRef.current.abort();
        }
        setUploading(false);
        setStatus("idle");
        setProgress(0);
        if (onCancel) onCancel();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        if (bytes < 1024 * 1024 * 1024) {
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Upload Video</h3>
                {onCancel && !uploading && (
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            {status === "done" ? (
                <div className="text-center py-8">
                    <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                    <p className="text-lg font-medium text-gray-900">Upload Complete!</p>
                    <p className="text-gray-500 mt-1">Video is being processed by Bunny Stream</p>
                </div>
            ) : (
                <>
                    {/* Title Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Chapter 1 - Introduction to Algebra"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            disabled={uploading}
                        />
                    </div>

                    {/* File Drop Zone */}
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${file ? "border-primary-300 bg-primary-50" : "border-gray-200 hover:border-primary-300"
                            } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />
                        {file ? (
                            <div>
                                <Film className="mx-auto text-primary-500 mb-3" size={40} />
                                <p className="font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                                {!uploading && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        className="mt-2 text-sm text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                <Upload className="mx-auto text-gray-400 mb-3" size={40} />
                                <p className="font-medium text-gray-700">Click to select video</p>
                                <p className="text-sm text-gray-500 mt-1">MP4, MOV, AVI - No size limit</p>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {uploading && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">
                                    {status === "creating" && "Creating video entry..."}
                                    {status === "uploading" && "Uploading video..."}
                                </span>
                                <span className="text-primary-600 font-medium">{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-600 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Upload is resumable - you can close and continue later
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-6 flex gap-3">
                        {uploading ? (
                            <button
                                onClick={handleCancel}
                                className="flex-1 border border-red-300 text-red-600 py-3 rounded-lg hover:bg-red-50 transition font-medium"
                            >
                                Cancel Upload
                            </button>
                        ) : (
                            <button
                                onClick={handleUpload}
                                disabled={!file || !title.trim()}
                                className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Upload size={20} />
                                Upload Video
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
