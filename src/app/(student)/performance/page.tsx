"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    TrendingUp,
    TrendingDown,
    Target,
    Award,
    Clock,
    Calendar,
    BarChart3,
    PieChart,
    Activity,
    Zap,
    Trophy,
    Star,
    CheckCircle,
    AlertCircle,
    BookOpen,
    Brain,
    Users,
    ArrowUp,
    ArrowDown,
    Filter,
    Download,
} from "lucide-react";

interface PerformanceData {
    totalTests: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    totalStudyTime: number;
    streak: number;
    rank: number;
    totalStudents: number;
    improvement: number;
    subjectWisePerformance: SubjectPerformance[];
    recentTests: TestResult[];
    monthlyProgress: MonthlyData[];
    strengths: string[];
    weaknesses: string[];
}

interface SubjectPerformance {
    subject: string;
    averageScore: number;
    testsAttempted: number;
    improvement: number;
    color: string;
}

interface TestResult {
    id: string;
    title: string;
    subject: string;
    score: number;
    maxScore: number;
    date: string;
    duration: number;
    rank: number;
    type: 'mock' | 'practice' | 'daily';
}

interface MonthlyData {
    month: string;
    averageScore: number;
    testsAttempted: number;
    studyHours: number;
}

export default function StudentPerformance() {
    const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const supabase = createClient();

    useEffect(() => {
        fetchPerformanceData();
    }, [selectedPeriod, selectedSubject]);

    const fetchPerformanceData = async () => {
        try {
            // Mock data for demonstration
            const mockData: PerformanceData = {
                totalTests: 45,
                averageScore: 78.5,
                bestScore: 95,
                worstScore: 52,
                totalStudyTime: 156,
                streak: 7,
                rank: 23,
                totalStudents: 1250,
                improvement: 12.5,
                subjectWisePerformance: [
                    { subject: 'Mathematics', averageScore: 82, testsAttempted: 15, improvement: 8.5, color: 'bg-blue-500' },
                    { subject: 'General Knowledge', averageScore: 76, testsAttempted: 12, improvement: -2.3, color: 'bg-green-500' },
                    { subject: 'English', averageScore: 85, testsAttempted: 10, improvement: 15.2, color: 'bg-purple-500' },
                    { subject: 'Reasoning', averageScore: 71, testsAttempted: 8, improvement: 5.8, color: 'bg-orange-500' },
                ],
                recentTests: [
                    { id: '1', title: 'SSC CGL Mock Test #15', subject: 'Mathematics', score: 85, maxScore: 100, date: '2024-01-15', duration: 120, rank: 15, type: 'mock' },
                    { id: '2', title: 'Daily Practice Test', subject: 'General Knowledge', score: 78, maxScore: 100, date: '2024-01-14', duration: 30, rank: 25, type: 'daily' },
                    { id: '3', title: 'Railway Group D Practice', subject: 'Reasoning', score: 92, maxScore: 100, date: '2024-01-13', duration: 90, rank: 8, type: 'practice' },
                    { id: '4', title: 'English Comprehension Test', subject: 'English', score: 88, maxScore: 100, date: '2024-01-12', duration: 60, rank: 12, type: 'practice' },
                    { id: '5', title: 'SSC CGL Mock Test #14', subject: 'Mathematics', score: 76, maxScore: 100, date: '2024-01-11', duration: 120, rank: 28, type: 'mock' },
                ],
                monthlyProgress: [
                    { month: 'Sep', averageScore: 65, testsAttempted: 8, studyHours: 32 },
                    { month: 'Oct', averageScore: 70, testsAttempted: 12, studyHours: 45 },
                    { month: 'Nov', averageScore: 75, testsAttempted: 15, studyHours: 52 },
                    { month: 'Dec', averageScore: 78, testsAttempted: 18, studyHours: 58 },
                    { month: 'Jan', averageScore: 82, testsAttempted: 10, studyHours: 35 },
                ],
                strengths: ['Algebra', 'Data Interpretation', 'Reading Comprehension', 'Logical Reasoning'],
                weaknesses: ['Geometry', 'Current Affairs', 'Speed & Time', 'Profit & Loss']
            };

            setPerformanceData(mockData);
        } catch (error) {
            console.error('Error fetching performance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-100';
        if (score >= 60) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const getTestTypeColor = (type: string) => {
        switch (type) {
            case 'mock': return 'bg-red-100 text-red-700';
            case 'practice': return 'bg-blue-100 text-blue-700';
            case 'daily': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!performanceData) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <BarChart3 className="mx-auto text-gray-300 mb-4" size={64} />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No performance data available</h3>
                    <p className="text-gray-600">Take some tests to see your performance analytics</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
                    <p className="text-gray-600">Track your progress and identify areas for improvement</p>
                </div>

                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                    {/* Period Filter */}
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>

                    {/* Export Button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{performanceData.totalTests}</p>
                            <p className="text-sm text-gray-600">Tests Taken</p>
                        </div>
                        <BarChart3 className="text-blue-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{performanceData.averageScore}%</p>
                            <p className="text-sm text-gray-600">Avg Score</p>
                        </div>
                        <Target className="text-green-500" size={24} />
                    </div>
                    <div className="flex items-center mt-1">
                        {performanceData.improvement > 0 ? (
                            <ArrowUp className="text-green-500" size={12} />
                        ) : (
                            <ArrowDown className="text-red-500" size={12} />
                        )}
                        <span className={`text-xs ml-1 ${performanceData.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(performanceData.improvement)}%
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">#{performanceData.rank}</p>
                            <p className="text-sm text-gray-600">Current Rank</p>
                        </div>
                        <Trophy className="text-yellow-500" size={24} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">out of {performanceData.totalStudents}</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{performanceData.bestScore}%</p>
                            <p className="text-sm text-gray-600">Best Score</p>
                        </div>
                        <Star className="text-purple-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{performanceData.totalStudyTime}h</p>
                            <p className="text-sm text-gray-600">Study Time</p>
                        </div>
                        <Clock className="text-orange-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{performanceData.streak}</p>
                            <p className="text-sm text-gray-600">Day Streak</p>
                        </div>
                        <Zap className="text-red-500" size={24} />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Subject-wise Performance */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Subject-wise Performance</h2>
                        <div className="space-y-4">
                            {performanceData.subjectWisePerformance.map((subject) => (
                                <div key={subject.subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-4 h-4 rounded-full ${subject.color}`}></div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{subject.subject}</h3>
                                            <p className="text-sm text-gray-600">{subject.testsAttempted} tests attempted</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-bold ${getScoreColor(subject.averageScore)}`}>
                                            {subject.averageScore}%
                                        </p>
                                        <div className="flex items-center">
                                            {subject.improvement > 0 ? (
                                                <ArrowUp className="text-green-500" size={12} />
                                            ) : (
                                                <ArrowDown className="text-red-500" size={12} />
                                            )}
                                            <span className={`text-xs ml-1 ${subject.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {Math.abs(subject.improvement)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Test Results */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Test Results</h2>
                        <div className="space-y-4">
                            {performanceData.recentTests.map((test) => (
                                <div key={test.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="font-medium text-gray-900">{test.title}</h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTestTypeColor(test.type)}`}>
                                                {test.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>{test.subject}</span>
                                            <span>•</span>
                                            <span>{new Date(test.date).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{test.duration} min</span>
                                            <span>•</span>
                                            <span>Rank #{test.rank}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(test.score)} ${getScoreColor(test.score)}`}>
                                            {test.score}/{test.maxScore}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{((test.score / test.maxScore) * 100).toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Progress Chart */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Progress</h2>
                        <div className="space-y-4">
                            {performanceData.monthlyProgress.map((month, index) => (
                                <div key={month.month} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm font-medium text-gray-600 w-8">{month.month}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{ width: `${month.averageScore}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{month.averageScore}%</p>
                                        <p className="text-xs text-gray-500">{month.testsAttempted} tests</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Strengths */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Strengths</h2>
                        <div className="space-y-2">
                            {performanceData.strengths.map((strength, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <CheckCircle className="text-green-500" size={16} />
                                    <span className="text-sm text-gray-700">{strength}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Areas for Improvement</h2>
                        <div className="space-y-2">
                            {performanceData.weaknesses.map((weakness, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <AlertCircle className="text-orange-500" size={16} />
                                    <span className="text-sm text-gray-700">{weakness}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-sm font-medium">
                            Get Practice Recommendations
                        </button>
                    </div>

                    {/* Performance Tips */}
                    <div className="bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl p-6 text-white">
                        <h2 className="text-xl font-bold mb-4">💡 Performance Tips</h2>
                        <div className="space-y-3 text-sm">
                            <p>• Focus on your weak areas: Geometry and Current Affairs</p>
                            <p>• Maintain your study streak to improve consistency</p>
                            <p>• Take more mock tests to improve your ranking</p>
                            <p>• Review incorrect answers to avoid similar mistakes</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
                                <Brain size={16} />
                                Take Practice Test
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                                <BookOpen size={16} />
                                Study Weak Topics
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                                <Users size={16} />
                                Compare with Peers
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}