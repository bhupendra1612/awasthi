"use client";

import { useState, useRef } from "react";
import { uploadDocument, getDocumentUrl } from "@/lib/storage";
import { FileText, Upload, X, Loader2, CheckCircle } from "lucide-react";

interface DocumentUploaderProps {
    onUploadComplete: (url: string, fileName: string, fileType: string) => void;
    onCancel: () => void;
}

const ALLOWED_TYPES = [
    "application/pdf",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const FILE_EXTENSIONS: Record<string, string> = {
    "application/pdf": "PDF",
    "text/csv": "CSV",
    "application/vnd.ms-excel": "Excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
    "application/msword": "Word",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
    "application/vnd.ms-powerpoint": "PowerPoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
};

export default function DocumentUploader({ onUploadComplete, onCancel }: DocumentUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!ALLOWED_TYPES.includes(selectedFile.type)) {
            setError("Invalid file type. Please upload PDF, CSV, Excel, Word, or PowerPoint files.");
            return;
        }

        if (selectedFile.size > 50 * 1024 * 1024) {
            setError("File too large. Maximum size is 50MB.");
            return;
        }

        setFile(selectedFile);
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, "")); // Remove extension for title
        setError("");
    };

    const handleUpload = async () => {
        if (!file || !title.trim()) {
            setError("Please select a file and enter a title.");
            return;
        }

        setUploading(true);
        setProgress(10);

        try {
            setProgress(30);

            // Use our storage utility function
            const result = await uploadDocument(file, "pdfs", title);

            if ("error" in result) {
                throw new Error(result.error);
            }

            setProgress(80);

            // Get public URL for the uploaded document
            const publicUrl = getDocumentUrl(result.path);

            setProgress(100);

            const fileType = FILE_EXTENSIONS[file.type] || "Document";
            onUploadComplete(publicUrl, title, fileType);
        } catch (err) {
            console.error("Upload error:", err);
            setError(err instanceof Error ? err.message : "Failed to upload document");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-dashed border-blue-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
                    <p className="text-sm text-gray-500">PDF, CSV, Excel, Word, PowerPoint (max 50MB)</p>
                </div>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                >
                    <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 font-medium">Click to select a document</p>
                    <p className="text-sm text-gray-400 mt-1">or drag and drop</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                {FILE_EXTENSIONS[file.type] || "Document"} • {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        {!uploading && (
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setTitle("");
                                }}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Document Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Chapter 1 Notes"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            disabled={uploading}
                        />
                    </div>

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Uploading...</span>
                                <span className="text-blue-600">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleUpload}
                            disabled={uploading || !title.trim()}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {uploading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Upload size={20} />
                                    Upload Document
                                </>
                            )}
                        </button>
                        <button
                            onClick={onCancel}
                            disabled={uploading}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.csv,.xls,.xlsx,.doc,.docx,.ppt,.pptx"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
