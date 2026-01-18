"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Download,
    FileText,
    Video,
    Image,
    Archive,
    Calendar,
    Search,
    Filter,
    Eye,
    Trash2,
    FolderOpen,
    BookOpen,
    Clock,
    CheckCircle,
} from "lucide-react";

interface DownloadItem {
    id: string;
    title: string;
    description: string;
    type: 'pdf' | 'video' | 'image' | 'archive' | 'document';
    size: string;
    downloadUrl: string;
    courseTitle?: string;
    subject?: string;
    downloadedAt: string;
    isOfflineAvailable: boolean;
}

export default function StudentDownloads() {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [filteredDownloads, setFilteredDownloads] = useState<DownloadItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchDownloads();
    }, []);

    useEffect(() => {
        filterDownloads();
    }, [downloads, searchQuery, selectedType]);

    const fetchDownloads = async () => {
        try {
            // Mock data for demonstration
            const mockDownloads: DownloadItem[] = [
                {
                    id: '1',
                    title: 'Mathematics Formula Sheet',
                    description: 'Complete formula sheet for SSC Mathematics',
                    type: 'pdf',
                    size: '2.5 MB',
                    downloadUrl: '/downloads/math-formulas.pdf',
                    courseTitle: 'SSC Mathematics Complete Course',
                    subject: 'Mathematics',
                    downloadedAt: '2024-01-15T10:30:00Z',
                    isOfflineAvailable: true
                },
                {
                    id: '2',
                    title: 'Algebra Basics Video Lecture',
                    description: 'Introduction to algebraic equations and solving methods',
                    type: 'video',
                    size: '125 MB',
                    downloadUrl: '/downloads/algebra-basics.mp4',
                    courseTitle: 'Mathematics for Class 10',
                    subject: 'Mathematics',
                    downloadedAt: '2024-01-14T15:45:00Z',
                    isOfflineAvailable: true
                },
                {
                    id: '3',
                    title: 'Current Affairs January 2024',
                    description: 'Monthly current affairs compilation for government exams',
                    type: 'pdf',
                    size: '8.2 MB',
                    downloadUrl: '/downloads/current-affairs-jan-2024.pdf',
                    courseTitle: 'General Knowledge Course',
                    subject: 'General Knowledge',
                    downloadedAt: '2024-01-13T09:15:00Z',
                    isOfflineAvailable: true
                },
                {
                    id: '4',
                    title: 'English Grammar Rules',
                    description: 'Comprehensive guide to English grammar for competitive exams',
                    type: 'document',
                    size: '1.8 MB',
                    downloadUrl: '/downloads/english-grammar.docx',
                    courseTitle: 'English for Government Exams',
                    subject: 'English',
                    downloadedAt: '2024-01-12T14:20:00Z',
                    isOfflineAvailable: false
                },
                {
                    id: '5',
                    title: 'Reasoning Practice Questions',
                    description: 'Collection of logical reasoning questions with solutions',
                    type: 'pdf',
                    size: '5.1 MB',
                    downloadUrl: '/downloads/reasoning-practice.pdf',
                    courseTitle: 'Logical Reasoning Course',
                    subject: 'Reasoning',
                    downloadedAt: '2024-01-11T11:30:00Z',
                    isOfflineAvailable: true
                }
            ];

            setDownloads(mockDownloads);
        } catch (error) {
            console.error('Error fetching downloads:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterDownloads = () => {
        let filtered = downloads;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply type filter
        if (selectedType !== 'all') {
            filtered = filtered.filter(item => item.type === selectedType);
        }

        setFilteredDownloads(filtered);
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf':
            case 'document':
                return <FileText className="text-red-500" size={24} />;
            case 'video':
                return <Video className="text-blue-500" size={24} />;
            case 'image':
                return <Image className="text-green-500" size={24} />;
            case 'archive':
                return <Archive className="text-purple-500" size={24} />;
            default:
                return <FileText className="text-gray-500" size={24} />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pdf':
            case 'document':
                return 'bg-red-100 text-red-700';
            case 'video':
                return 'bg-blue-100 text-blue-700';
            case 'image':
                return 'bg-green-100 text-green-700';
            case 'archive':
                return 'bg-purple-100 text-purple-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleDownload = (item: DownloadItem) => {
        // In a real app, this would trigger the actual download
        console.log('Downloading:', item.title);
        // You could also track download analytics here
    };

    const handleDelete = (itemId: string) => {
        if (window.confirm('Are you sure you want to remove this download?')) {
            setDownloads(prev => prev.filter(item => item.id !== itemId));
        }
    };

    const types = [
        { key: 'all', label: 'All Files', count: downloads.length },
        { key: 'pdf', label: 'PDFs', count: downloads.filter(d => d.type === 'pdf').length },
        { key: 'video', label: 'Videos', count: downloads.filter(d => d.type === 'video').length },
        { key: 'document', label: 'Documents', count: downloads.filter(d => d.type === 'document').length },
        { key: 'image', label: 'Images', count: downloads.filter(d => d.type === 'image').length },
    ];

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Downloads</h1>
                <p className="text-gray-600">Access your downloaded study materials and resources</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{downloads.length}</p>
                            <p className="text-sm text-gray-600">Total Files</p>
                        </div>
                        <Download className="text-blue-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {downloads.filter(d => d.isOfflineAvailable).length}
                            </p>
                            <p className="text-sm text-gray-600">Offline Available</p>
                        </div>
                        <CheckCircle className="text-green-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {downloads.filter(d => d.type === 'pdf').length}
                            </p>
                            <p className="text-sm text-gray-600">PDF Files</p>
                        </div>
                        <FileText className="text-red-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {downloads.filter(d => d.type === 'video').length}
                            </p>
                            <p className="text-sm text-gray-600">Videos</p>
                        </div>
                        <Video className="text-blue-500" size={24} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search downloads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="flex flex-wrap gap-2">
                        {types.map((type) => (
                            <button
                                key={type.key}
                                onClick={() => setSelectedType(type.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedType === type.key
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {type.label} ({type.count})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Downloads List */}
            {filteredDownloads.length > 0 ? (
                <div className="space-y-4">
                    {filteredDownloads.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    {/* File Icon */}
                                    <div className="flex-shrink-0">
                                        {getFileIcon(item.type)}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-lg font-medium text-gray-900 truncate">{item.title}</h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                                                {item.type.toUpperCase()}
                                            </span>
                                            {item.isOfflineAvailable && (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                                    OFFLINE
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>

                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            {item.courseTitle && (
                                                <div className="flex items-center">
                                                    <BookOpen size={14} className="mr-1" />
                                                    <span>{item.courseTitle}</span>
                                                </div>
                                            )}
                                            {item.subject && (
                                                <div className="flex items-center">
                                                    <FolderOpen size={14} className="mr-1" />
                                                    <span>{item.subject}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-1" />
                                                <span>{new Date(item.downloadedAt).toLocaleDateString()}</span>
                                            </div>
                                            <span>{item.size}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handleDownload(item)}
                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                        title="Download"
                                    >
                                        <Download size={20} />
                                    </button>
                                    <button
                                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                                        title="Preview"
                                    >
                                        <Eye size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Remove"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Download className="mx-auto text-gray-300 mb-4" size={64} />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {searchQuery || selectedType !== 'all' ? 'No downloads found' : 'No downloads yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery || selectedType !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Start downloading study materials from your courses'
                        }
                    </p>
                    {!searchQuery && selectedType === 'all' && (
                        <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                            Browse Courses
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}