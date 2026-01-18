"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    BookOpen,
    PlayCircle,
    Clock,
    Users,
    Star,
    Download,
    CheckCircle,
    Lock,
    Filter,
    Search,
    Grid,
    List,
    Calendar,
    Award,
    Target,
    TrendingUp,
    FileText,
    Video,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Course {
    id: string;
    title: string;
    description: string;
    subject: string;
    class: string;
    board: string;
    price: number;
    original_price?: number;
    thumbnail_url?: string;
    progress: number;
    total_videos: number;
    completed_videos: number;
    total_documents: number;
    enrollment_date: string;
    last_accessed?: string;
    is_completed: boolean;
}

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'in_progress' | 'completed' | 'not_started';

export default function StudentCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const supabase = createClient();

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [courses, searchQuery, activeFilter]);

    const fetchEnrolledCourses = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: enrollments } = await supabase
                .from('enrollments')
                .select(`
                    *,
                    courses (
                        id,
                        title,
                        description,
                        subject,
                        class,
                        board,
                        price,
                        original_price,
                        thumbnail_url
                    )
                `)
                .eq('user_id', user.id)
                .eq('status', 'active');

            if (enrollments) {
                const coursesData = enrollments.map(enrollment => ({
                    id: enrollment.courses.id,
                    title: enrollment.courses.title,
                    description: enrollment.courses.description,
                    subject: enrollment.courses.subject,
                    class: enrollment.courses.class,
                    board: enrollment.courses.board,
                    price: enrollment.courses.price,
                    original_price: enrollment.courses.original_price,
                    thumbnail_url: enrollment.courses.thumbnail_url,
                    progress: Math.floor(Math.random() * 100), // Mock progress
                    total_videos: Math.floor(Math.random() * 50) + 10,
                    completed_videos: Math.floor(Math.random() * 30),
                    total_documents: Math.floor(Math.random() * 20) + 5,
                    enrollment_date: enrollment.enrolled_at,
                    last_accessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                    is_completed: Math.random() > 0.7
                }));
                setCourses(coursesData);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterCourses = () => {
        let filtered = courses;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.class.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (activeFilter !== 'all') {
            filtered = filtered.filter(course => {
                switch (activeFilter) {
                    case 'completed':
                        return course.is_completed;
                    case 'in_progress':
                        return course.progress > 0 && !course.is_completed;
                    case 'not_started':
                        return course.progress === 0;
                    default:
                        return true;
                }
            });
        }

        setFilteredCourses(filtered);
    };

    const getProgressColor = (progress: number) => {
        if (progress === 0) return 'bg-gray-200';
        if (progress < 30) return 'bg-red-500';
        if (progress < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getProgressText = (progress: number, isCompleted: boolean) => {
        if (isCompleted) return 'Completed';
        if (progress === 0) return 'Not Started';
        return 'In Progress';
    };

    const filters = [
        { key: 'all' as FilterType, label: 'All Courses', count: courses.length },
        { key: 'in_progress' as FilterType, label: 'In Progress', count: courses.filter(c => c.progress > 0 && !c.is_completed).length },
        { key: 'completed' as FilterType, label: 'Completed', count: courses.filter(c => c.is_completed).length },
        { key: 'not_started' as FilterType, label: 'Not Started', count: courses.filter(c => c.progress === 0).length },
    ];

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
                                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
                <p className="text-gray-600">
                    Continue your government exam preparation journey
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                            <p className="text-sm text-gray-600">Total Courses</p>
                        </div>
                        <BookOpen className="text-blue-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {courses.filter(c => c.progress > 0 && !c.is_completed).length}
                            </p>
                            <p className="text-sm text-gray-600">In Progress</p>
                        </div>
                        <TrendingUp className="text-orange-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {courses.filter(c => c.is_completed).length}
                            </p>
                            <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <CheckCircle className="text-green-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length) || 0}%
                            </p>
                            <p className="text-sm text-gray-600">Avg Progress</p>
                        </div>
                        <Target className="text-purple-500" size={24} />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter.key
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {filter.label} ({filter.count})
                            </button>
                        ))}
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                                }`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                                }`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Courses Grid/List */}
            {filteredCourses.length > 0 ? (
                <div className={viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
                                }`}
                        >
                            {viewMode === 'grid' ? (
                                <>
                                    {/* Course Thumbnail */}
                                    <div className="relative h-48 bg-gradient-to-br from-primary-100 to-blue-100">
                                        {course.thumbnail_url ? (
                                            <Image
                                                src={course.thumbnail_url}
                                                alt={course.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <BookOpen className="text-primary-300" size={48} />
                                            </div>
                                        )}

                                        {/* Progress Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full text-white ${course.is_completed ? 'bg-green-500' :
                                                course.progress > 0 ? 'bg-blue-500' : 'bg-gray-400'
                                                }`}>
                                                {getProgressText(course.progress, course.is_completed)}
                                            </span>
                                        </div>

                                        {/* Class Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                                                {course.class}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Course Content */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">{course.subject} • {course.board}</p>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-medium">{course.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Course Stats */}
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                            <div className="flex items-center">
                                                <Video size={14} className="mr-1" />
                                                <span>{course.completed_videos}/{course.total_videos}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FileText size={14} className="mr-1" />
                                                <span>{course.total_documents} docs</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            href={`/student/enrolled-courses/${course.id}`}
                                            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition font-medium"
                                        >
                                            {course.progress > 0 ? (
                                                <>
                                                    <PlayCircle size={16} />
                                                    Continue Learning
                                                </>
                                            ) : (
                                                <>
                                                    <PlayCircle size={16} />
                                                    Start Course
                                                </>
                                            )}
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* List View */}
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-blue-100 rounded-lg flex items-center justify-center mr-4">
                                        <BookOpen className="text-primary-600" size={24} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{course.subject} • {course.class} • {course.board}</p>

                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                                    <div className="flex items-center">
                                                        <Video size={14} className="mr-1" />
                                                        <span>{course.completed_videos}/{course.total_videos} videos</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FileText size={14} className="mr-1" />
                                                        <span>{course.total_documents} documents</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-1 max-w-xs">
                                                        <div className="flex items-center justify-between text-sm mb-1">
                                                            <span className="text-gray-600">Progress</span>
                                                            <span className="font-medium">{course.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                                                                style={{ width: `${course.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <span className={`px-2 py-1 text-xs font-bold rounded-full text-white ${course.is_completed ? 'bg-green-500' :
                                                        course.progress > 0 ? 'bg-blue-500' : 'bg-gray-400'
                                                        }`}>
                                                        {getProgressText(course.progress, course.is_completed)}
                                                    </span>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/student/enrolled-courses/${course.id}`}
                                                className="ml-4 flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
                                            >
                                                <PlayCircle size={16} />
                                                {course.progress > 0 ? 'Continue' : 'Start'}
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {searchQuery || activeFilter !== 'all' ? 'No courses found' : 'No courses enrolled'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery || activeFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Start your learning journey by enrolling in courses'
                        }
                    </p>
                    {!searchQuery && activeFilter === 'all' && (
                        <Link
                            href="/courses"
                            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                        >
                            Browse Courses
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}