"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Calendar,
    Clock,
    Target,
    BookOpen,
    CheckCircle,
    AlertCircle,
    Plus,
    Edit,
    Trash2,
    Play,
    Pause,
    RotateCcw,
    Timer,
    Award,
    TrendingUp,
    Brain,
    Zap,
    Star,
    ChevronLeft,
    ChevronRight,
    Filter,
    Settings,
} from "lucide-react";

interface StudySession {
    id: string;
    subject: string;
    topic: string;
    duration: number; // in minutes
    completed: boolean;
    date: string;
    type: 'study' | 'practice' | 'revision' | 'test';
    priority: 'high' | 'medium' | 'low';
}

interface StudyGoal {
    id: string;
    title: string;
    description: string;
    targetDate: string;
    progress: number;
    type: 'daily' | 'weekly' | 'monthly';
    target: number;
    current: number;
    unit: string;
}

interface WeeklyPlan {
    week: string;
    totalHours: number;
    completedHours: number;
    sessions: StudySession[];
}

export default function StudyPlan() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [studySessions, setStudySessions] = useState<StudySession[]>([]);
    const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([]);
    const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
    const [activeTimer, setActiveTimer] = useState<string | null>(null);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [showAddSession, setShowAddSession] = useState(false);
    const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchStudyPlan();
    }, [currentDate, selectedView]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeTimer) {
            interval = setInterval(() => {
                setTimerSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeTimer]);

    const fetchStudyPlan = async () => {
        try {
            // Mock data for demonstration
            const mockSessions: StudySession[] = [
                {
                    id: '1',
                    subject: 'Mathematics',
                    topic: 'Algebra - Linear Equations',
                    duration: 60,
                    completed: true,
                    date: '2024-01-15',
                    type: 'study',
                    priority: 'high'
                },
                {
                    id: '2',
                    subject: 'General Knowledge',
                    topic: 'Current Affairs - January 2024',
                    duration: 45,
                    completed: false,
                    date: '2024-01-15',
                    type: 'study',
                    priority: 'medium'
                },
                {
                    id: '3',
                    subject: 'English',
                    topic: 'Reading Comprehension Practice',
                    duration: 30,
                    completed: false,
                    date: '2024-01-15',
                    type: 'practice',
                    priority: 'medium'
                },
                {
                    id: '4',
                    subject: 'Reasoning',
                    topic: 'Logical Reasoning - Puzzles',
                    duration: 90,
                    completed: false,
                    date: '2024-01-16',
                    type: 'study',
                    priority: 'high'
                },
                {
                    id: '5',
                    subject: 'Mathematics',
                    topic: 'Geometry - Triangles Revision',
                    duration: 45,
                    completed: false,
                    date: '2024-01-16',
                    type: 'revision',
                    priority: 'low'
                }
            ];

            const mockGoals: StudyGoal[] = [
                {
                    id: '1',
                    title: 'Daily Study Target',
                    description: 'Study for at least 4 hours every day',
                    targetDate: '2024-01-31',
                    progress: 75,
                    type: 'daily',
                    target: 4,
                    current: 3,
                    unit: 'hours'
                },
                {
                    id: '2',
                    title: 'Weekly Test Goal',
                    description: 'Complete 5 practice tests this week',
                    targetDate: '2024-01-21',
                    progress: 60,
                    type: 'weekly',
                    target: 5,
                    current: 3,
                    unit: 'tests'
                },
                {
                    id: '3',
                    title: 'Monthly Score Target',
                    description: 'Achieve 85% average score this month',
                    targetDate: '2024-01-31',
                    progress: 82,
                    type: 'monthly',
                    target: 85,
                    current: 82,
                    unit: '% score'
                }
            ];

            const mockWeeklyPlan: WeeklyPlan = {
                week: 'Jan 15 - Jan 21, 2024',
                totalHours: 28,
                completedHours: 12,
                sessions: mockSessions
            };

            setStudySessions(mockSessions);
            setStudyGoals(mockGoals);
            setWeeklyPlan(mockWeeklyPlan);
        } catch (error) {
            console.error('Error fetching study plan:', error);
        } finally {
            setLoading(false);
        }
    };

    const startTimer = (sessionId: string) => {
        setActiveTimer(sessionId);
        setTimerSeconds(0);
    };

    const stopTimer = () => {
        setActiveTimer(null);
        setTimerSeconds(0);
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const markSessionComplete = (sessionId: string) => {
        setStudySessions(prev =>
            prev.map(session =>
                session.id === sessionId
                    ? { ...session, completed: true }
                    : session
            )
        );
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'study': return <BookOpen size={16} />;
            case 'practice': return <Brain size={16} />;
            case 'revision': return <RotateCcw size={16} />;
            case 'test': return <Target size={16} />;
            default: return <BookOpen size={16} />;
        }
    };

    const getTodaySessions = () => {
        const today = new Date().toISOString().split('T')[0];
        return studySessions.filter(session => session.date === today);
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
                                <div className="h-20 bg-gray-200 rounded"></div>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Plan</h1>
                    <p className="text-gray-600">Organize your preparation with a structured study schedule</p>
                </div>

                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {['day', 'week', 'month'].map((view) => (
                            <button
                                key={view}
                                onClick={() => setSelectedView(view as any)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${selectedView === view ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                                    }`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowAddSession(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        <Plus size={16} />
                        Add Session
                    </button>
                </div>
            </div>

            {/* Study Goals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {studyGoals.map((goal) => (
                    <div key={goal.id} className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">{goal.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${goal.type === 'daily' ? 'bg-blue-100 text-blue-700' :
                                    goal.type === 'weekly' ? 'bg-green-100 text-green-700' :
                                        'bg-purple-100 text-purple-700'
                                }`}>
                                {goal.type.toUpperCase()}
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{goal.description}</p>

                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{goal.current}/{goal.target} {goal.unit}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all"
                                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Target Date</span>
                            <span className="font-medium">{new Date(goal.targetDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Today's Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Sessions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Calendar size={16} />
                                <span>{new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {getTodaySessions().length > 0 ? (
                                getTodaySessions().map((session) => (
                                    <div
                                        key={session.id}
                                        className={`p-4 border-2 rounded-lg transition-all ${session.completed
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-white border-gray-200 hover:border-primary-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-2 rounded-lg ${session.completed ? 'bg-green-100' : 'bg-primary-100'
                                                    }`}>
                                                    {getTypeIcon(session.type)}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="font-medium text-gray-900">{session.topic}</h3>
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(session.priority)}`}>
                                                            {session.priority}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                        <span>{session.subject}</span>
                                                        <span>•</span>
                                                        <div className="flex items-center">
                                                            <Clock size={14} className="mr-1" />
                                                            {session.duration} min
                                                        </div>
                                                        <span>•</span>
                                                        <span className="capitalize">{session.type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {activeTimer === session.id ? (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-mono text-primary-600">
                                                            {formatTime(timerSeconds)}
                                                        </span>
                                                        <button
                                                            onClick={stopTimer}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        >
                                                            <Pause size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startTimer(session.id)}
                                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                                        disabled={session.completed}
                                                    >
                                                        <Play size={16} />
                                                    </button>
                                                )}

                                                {!session.completed ? (
                                                    <button
                                                        onClick={() => markSessionComplete(session.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                ) : (
                                                    <CheckCircle className="text-green-500" size={16} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500">No study sessions scheduled for today</p>
                                    <button
                                        onClick={() => setShowAddSession(true)}
                                        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                                    >
                                        Add Study Session
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weekly Overview */}
                    {weeklyPlan && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Overview</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary-600">{weeklyPlan.completedHours}</p>
                                    <p className="text-sm text-gray-600">Hours Completed</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{weeklyPlan.totalHours}</p>
                                    <p className="text-sm text-gray-600">Total Planned</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {Math.round((weeklyPlan.completedHours / weeklyPlan.totalHours) * 100)}%
                                    </p>
                                    <p className="text-sm text-gray-600">Progress</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">
                                        {weeklyPlan.totalHours - weeklyPlan.completedHours}
                                    </p>
                                    <p className="text-sm text-gray-600">Hours Left</p>
                                </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                <div
                                    className="bg-gradient-to-r from-primary-500 to-blue-500 h-3 rounded-full transition-all"
                                    style={{ width: `${(weeklyPlan.completedHours / weeklyPlan.totalHours) * 100}%` }}
                                ></div>
                            </div>

                            <p className="text-sm text-gray-600 text-center">
                                Week: {weeklyPlan.week}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column - Stats & Quick Actions */}
                <div className="space-y-6">
                    {/* Study Stats */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Study Stats</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Today's Progress</span>
                                <span className="font-bold text-primary-600">3/4 sessions</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Study Streak</span>
                                <span className="font-bold text-orange-600">7 days</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">This Week</span>
                                <span className="font-bold text-green-600">12/28 hours</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Avg. Daily</span>
                                <span className="font-bold text-purple-600">3.2 hours</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
                                <Plus size={16} />
                                Add Study Session
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                                <Target size={16} />
                                Set New Goal
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                                <Calendar size={16} />
                                View Full Calendar
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition">
                                <Settings size={16} />
                                Plan Settings
                            </button>
                        </div>
                    </div>

                    {/* Motivation Card */}
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Keep Going! 🔥</h2>
                            <Star size={24} />
                        </div>
                        <p className="text-sm text-yellow-100 mb-4">
                            You're on a 7-day study streak! Consistency is the key to success in government exams.
                        </p>
                        <div className="bg-white/20 rounded-lg p-3">
                            <p className="text-sm font-medium">Today's Motivation:</p>
                            <p className="text-xs text-yellow-100 mt-1">
                                "Success is the sum of small efforts repeated day in and day out."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}