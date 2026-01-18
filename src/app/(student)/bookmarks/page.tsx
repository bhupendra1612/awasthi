"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Bookmark,
    BookOpen,
    Video,
    FileText,
    Brain,
    Target,
    Search,
    Filter,
    Calendar,
    Clock,
    Eye,
    Trash2,
    ExternalLink,
    Star,
    Tag,
    FolderOpen,
    Plus,
} from "lucide-react";
import Link from "next/link";

interface BookmarkItem {
    id: string;
    title: string;
    description: string;
    type: 'course' | 'video' | 'document' | 'test' | 'article' | 'question';
    url: string;
    thumbnailUrl?: string;
    subject?: string;
    courseTitle?: string;
    tags: string[];
    bookmarkedAt: string;
    lastAccessed?: string;
    isCompleted?: boolean;
    progress?: number;
}

interface BookmarkFolder {
    id: string;
    name: string;
    description: string;
    color: string;
    itemCount: number;
    createdAt: string;
}

export default function StudentBookmarks() {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [folders, setFolders] = useState<BookmarkFolder[]>([]);
    const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedFolder, setSelectedFolder] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [showAddFolder, setShowAddFolder] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchBookmarks();
    }, []);

    useEffect(() => {
        filterBookmarks();
    }, [bookmarks, searchQuery, selectedType, selectedFolder]);

    const fetchBookmarks = async () => {
        try {
            // Mock data for demonstration
            const mockBookmarks: BookmarkItem[] = [
                {
                    id: '1',
                    title: 'Algebra Fundamentals',
                    description: 'Complete guide to algebraic equations and problem-solving techniques',
                    type: 'course',
                    url: '/courses/algebra-fundamentals',
                    subject: 'Mathematics',
                    courseTitle: 'SSC Mathematics Complete Course',
                    tags: ['algebra', 'equations', 'mathematics'],
                    bookmarkedAt: '2024-01-15T10:30:00Z',
                    lastAccessed: '2024-01-16T09:15:00Z',
                    progress: 65,
                    isCompleted: false
                },
                {
                    id: '2',
                    title: 'Current Affairs - January 2024',
                    description: 'Important current events and news for government exam preparation',
                    type: 'document',
                    url: '/documents/current-affairs-jan-2024',
                    subject: 'General Knowledge',
                    tags: ['current affairs', 'gk', 'news'],
                    bookmarkedAt: '2024-01-14T15:45:00Z',
                    lastAccessed: '2024-01-15T11:20:00Z',
                    isCompleted: true
                },
                {
                    id: '3',
                    title: 'SSC CGL Mock Test #15',
                    description: 'Full-length mock test for SSC CGL preparation',
                    type: 'test',
                    url: '/tests/ssc-cgl-mock-15',
                    subject: 'All Subjects',
                    tags: ['ssc', 'cgl', 'mock test', 'practice'],
                    bookmarkedAt: '2024-01-13T09:15:00Z',
                    lastAccessed: '2024-01-14T14:30:00Z',
                    isCompleted: true
                },
                {
                    id: '4',
                    title: 'Quadratic Equations Video Lecture',
                    description: 'Detailed explanation of quadratic equations with examples',
                    type: 'video',
                    url: '/videos/quadratic-equations',
                    subject: 'Mathematics',
                    courseTitle: 'Advanced Mathematics',
                    tags: ['quadratic', 'equations', 'video', 'mathematics'],
                    bookmarkedAt: '2024-01-12T14:20:00Z',
                    progress: 80,
                    isCompleted: false
                },
                {
                    id: '5',
                    title: 'English Grammar Rules',
                    description: 'Comprehensive guide to English grammar for competitive exams',
                    type: 'article',
                    url: '/articles/english-grammar-rules',
                    subject: 'English',
                    tags: ['grammar', 'english', 'rules', 'competitive'],
                    bookmarkedAt: '2024-01-11T11:30:00Z',
                    lastAccessed: '2024-01-13T16:45:00Z',
                    isCompleted: false
                },
                {
                    id: '6',
                    title: 'Logical Reasoning Practice Question',
                    description: 'Challenging logical reasoning problem with detailed solution',
                    type: 'question',
                    url: '/questions/logical-reasoning-1',
                    subject: 'Reasoning',
                    tags: ['logical reasoning', 'practice', 'problem solving'],
                    bookmarkedAt: '2024-01-10T08:45:00Z',
                    isCompleted: true
                }
            ];

            const mockFolders: BookmarkFolder[] = [
                {
                    id: '1',
                    name: 'Mathematics',
                    description: 'All math-related bookmarks',
                    color: 'bg-blue-500',
                    itemCount: 12,
                    createdAt: '2024-01-01T00:00:00Z'
                },
                {
                    id: '2',
                    name: 'Current Affairs',
                    description: 'Latest news and current events',
                    color: 'bg-green-500',
                    itemCount: 8,
                    createdAt: '2024-01-05T00:00:00Z'
                },
                {
                    id: '3',
                    name: 'Mock Tests',
                    description: 'Practice tests and assessments',
                    color: 'bg-purple-500',
                    itemCount: 15,
                    createdAt: '2024-01-08T00:00:00Z'
                },
                {
                    id: '4',
                    name: 'Important Questions',
                    description: 'Key questions for revision',
                    color: 'bg-red-500',
                    itemCount: 25,
                    createdAt: '2024-01-10T00:00:00Z'
                }
            ];

            setBookmarks(mockBookmarks);
            setFolders(mockFolders);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterBookmarks = () => {
        let filtered = bookmarks;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Apply type filter
        if (selectedType !== 'all') {
            filtered = filtered.filter(item => item.type === selectedType);
        }

        setFilteredBookmarks(filtered);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'course':
                return <BookOpen className="text-blue-500" size={20} />;
            case 'video':
                return <Video className="text-red-500" size={20} />;
            case 'document':
                return <FileText className="text-green-500" size={20} />;
            case 'test':
                return <Target className="text-purple-500" size={20} />;
            case 'article':
                return <FileText className="text-orange-500" size={20} />;
            case 'question':
                return <Brain className="text-pink-500" size={20} />;
            default:
                return <Bookmark className="text-gray-500" size={20} />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'course':
                return 'bg-blue-100 text-blue-700';
            case 'video':
                return 'bg-red-100 text-red-700';
            case 'document':
                return 'bg-green-100 text-green-700';
            case 'test':
                return 'bg-purple-100 text-purple-700';
            case 'article':
                return 'bg-orange-100 text-orange-700';
            case 'question':
                return 'bg-pink-100 text-pink-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleRemoveBookmark = (itemId: string) => {
        if (window.confirm('Are you sure you want to remove this bookmark?')) {
            setBookmarks(prev => prev.filter(item => item.id !== itemId));
        }
    };

    const types = [
        { key: 'all', label: 'All Items', count: bookmarks.length },
        { key: 'course', label: 'Courses', count: bookmarks.filter(b => b.type === 'course').length },
        { key: 'video', label: 'Videos', count: bookmarks.filter(b => b.type === 'video').length },
        { key: 'document', label: 'Documents', count: bookmarks.filter(b => b.type === 'document').length },
        { key: 'test', label: 'Tests', count: bookmarks.filter(b => b.type === 'test').length },
        { key: 'question', label: 'Questions', count: bookmarks.filter(b => b.type === 'question').length },
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookmarks</h1>
                    <p className="text-gray-600">Save and organize your favorite study materials</p>
                </div>

                <button
                    onClick={() => setShowAddFolder(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition mt-4 lg:mt-0"
                >
                    <Plus size={16} />
                    New Folder
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{bookmarks.length}</p>
                            <p className="text-sm text-gray-600">Total Bookmarks</p>
                        </div>
                        <Bookmark className="text-blue-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{folders.length}</p>
                            <p className="text-sm text-gray-600">Folders</p>
                        </div>
                        <FolderOpen className="text-green-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {bookmarks.filter(b => b.isCompleted).length}
                            </p>
                            <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <Star className="text-yellow-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {bookmarks.filter(b => b.lastAccessed &&
                                    new Date(b.lastAccessed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                                ).length}
                            </p>
                            <p className="text-sm text-gray-600">Recent</p>
                        </div>
                        <Clock className="text-purple-500" size={24} />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar - Folders */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Folders</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedFolder('all')}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${selectedFolder === 'all'
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Bookmark size={16} />
                                <span>All Bookmarks</span>
                                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                    {bookmarks.length}
                                </span>
                            </button>

                            {folders.map((folder) => (
                                <button
                                    key={folder.id}
                                    onClick={() => setSelectedFolder(folder.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${selectedFolder === folder.id
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded ${folder.color}`}></div>
                                    <span className="flex-1 truncate">{folder.name}</span>
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                        {folder.itemCount}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Filters */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search bookmarks..."
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
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedType === type.key
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

                    {/* Bookmarks List */}
                    {filteredBookmarks.length > 0 ? (
                        <div className="space-y-4">
                            {filteredBookmarks.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            {/* Type Icon */}
                                            <div className="flex-shrink-0 mt-1">
                                                {getTypeIcon(item.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-medium text-gray-900 truncate">{item.title}</h3>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                                                        {item.type.toUpperCase()}
                                                    </span>
                                                    {item.isCompleted && (
                                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                                            COMPLETED
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                                                {/* Progress Bar */}
                                                {item.progress !== undefined && !item.isCompleted && (
                                                    <div className="mb-3">
                                                        <div className="flex items-center justify-between text-sm mb-1">
                                                            <span className="text-gray-600">Progress</span>
                                                            <span className="font-medium">{item.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-primary-600 h-2 rounded-full"
                                                                style={{ width: `${item.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {item.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Meta Info */}
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    {item.subject && (
                                                        <div className="flex items-center">
                                                            <Tag size={14} className="mr-1" />
                                                            <span>{item.subject}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center">
                                                        <Calendar size={14} className="mr-1" />
                                                        <span>Saved {new Date(item.bookmarkedAt).toLocaleDateString()}</span>
                                                    </div>
                                                    {item.lastAccessed && (
                                                        <div className="flex items-center">
                                                            <Clock size={14} className="mr-1" />
                                                            <span>Accessed {new Date(item.lastAccessed).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2 ml-4">
                                            <Link
                                                href={item.url}
                                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                                title="Open"
                                            >
                                                <ExternalLink size={20} />
                                            </Link>
                                            <button
                                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                                                title="Preview"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveBookmark(item.id)}
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
                            <Bookmark className="mx-auto text-gray-300 mb-4" size={64} />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                {searchQuery || selectedType !== 'all' ? 'No bookmarks found' : 'No bookmarks yet'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchQuery || selectedType !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Start bookmarking your favorite study materials'
                                }
                            </p>
                            {!searchQuery && selectedType === 'all' && (
                                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                                    Browse Content
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}