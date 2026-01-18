"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Trophy,
    Award,
    Star,
    Target,
    Zap,
    Crown,
    Medal,
    Shield,
    Flame,
    BookOpen,
    Brain,
    Clock,
    TrendingUp,
    Users,
    CheckCircle,
    Lock,
    Calendar,
    BarChart3,
    Sparkles,
    Gift,
} from "lucide-react";

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'study' | 'test' | 'streak' | 'milestone' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    points: number;
    unlocked: boolean;
    unlockedAt?: string;
    progress?: number;
    maxProgress?: number;
    requirements: string[];
}

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    earned: boolean;
    earnedAt?: string;
}

interface Leaderboard {
    rank: number;
    totalPoints: number;
    totalAchievements: number;
    monthlyRank: number;
    weeklyRank: number;
}

export default function StudentAchievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedRarity, setSelectedRarity] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            // Mock data for demonstration
            const mockAchievements: Achievement[] = [
                {
                    id: '1',
                    title: 'First Steps',
                    description: 'Complete your first test',
                    icon: 'trophy',
                    category: 'milestone',
                    rarity: 'common',
                    points: 10,
                    unlocked: true,
                    unlockedAt: '2024-01-10',
                    requirements: ['Complete 1 test']
                },
                {
                    id: '2',
                    title: 'Study Streak Master',
                    description: 'Study for 7 consecutive days',
                    icon: 'flame',
                    category: 'streak',
                    rarity: 'rare',
                    points: 50,
                    unlocked: true,
                    unlockedAt: '2024-01-15',
                    requirements: ['Study for 7 consecutive days']
                },
                {
                    id: '3',
                    title: 'Perfect Score',
                    description: 'Score 100% in any test',
                    icon: 'star',
                    category: 'test',
                    rarity: 'epic',
                    points: 100,
                    unlocked: false,
                    progress: 95,
                    maxProgress: 100,
                    requirements: ['Score 100% in any test']
                },
                {
                    id: '4',
                    title: 'Speed Demon',
                    description: 'Complete a test in under 30 minutes',
                    icon: 'zap',
                    category: 'test',
                    rarity: 'rare',
                    points: 75,
                    unlocked: true,
                    unlockedAt: '2024-01-12',
                    requirements: ['Complete a test in under 30 minutes']
                },
                {
                    id: '5',
                    title: 'Knowledge Seeker',
                    description: 'Complete 50 tests',
                    icon: 'brain',
                    category: 'milestone',
                    rarity: 'epic',
                    points: 200,
                    unlocked: false,
                    progress: 24,
                    maxProgress: 50,
                    requirements: ['Complete 50 tests']
                },
                {
                    id: '6',
                    title: 'Mathematics Master',
                    description: 'Score above 90% in 10 Math tests',
                    icon: 'crown',
                    category: 'special',
                    rarity: 'legendary',
                    points: 500,
                    unlocked: false,
                    progress: 3,
                    maxProgress: 10,
                    requirements: ['Score above 90% in 10 Math tests']
                }
            ];

            const mockBadges: Badge[] = [
                {
                    id: '1',
                    name: 'Early Bird',
                    description: 'Study before 8 AM',
                    icon: 'clock',
                    color: 'bg-yellow-500',
                    earned: true,
                    earnedAt: '2024-01-11'
                },
                {
                    id: '2',
                    name: 'Night Owl',
                    description: 'Study after 10 PM',
                    icon: 'moon',
                    color: 'bg-purple-500',
                    earned: false
                },
                {
                    id: '3',
                    name: 'Consistent Learner',
                    description: 'Study every day for a month',
                    icon: 'calendar',
                    color: 'bg-green-500',
                    earned: false
                },
                {
                    id: '4',
                    name: 'Top Performer',
                    description: 'Rank in top 10 this month',
                    icon: 'trending-up',
                    color: 'bg-red-500',
                    earned: true,
                    earnedAt: '2024-01-14'
                }
            ];

            const mockLeaderboard: Leaderboard = {
                rank: 23,
                totalPoints: 485,
                totalAchievements: 12,
                monthlyRank: 15,
                weeklyRank: 8
            };

            setAchievements(mockAchievements);
            setBadges(mockBadges);
            setLeaderboard(mockLeaderboard);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName: string) => {
        const icons: { [key: string]: any } = {
            trophy: Trophy,
            award: Award,
            star: Star,
            target: Target,
            zap: Zap,
            crown: Crown,
            medal: Medal,
            shield: Shield,
            flame: Flame,
            book: BookOpen,
            brain: Brain,
            clock: Clock,
        };
        return icons[iconName] || Trophy;
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'border-gray-300 bg-gray-50';
            case 'rare': return 'border-blue-300 bg-blue-50';
            case 'epic': return 'border-purple-300 bg-purple-50';
            case 'legendary': return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const getRarityTextColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'text-gray-700';
            case 'rare': return 'text-blue-700';
            case 'epic': return 'text-purple-700';
            case 'legendary': return 'text-yellow-700';
            default: return 'text-gray-700';
        }
    };

    const filteredAchievements = achievements.filter(achievement => {
        const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
        const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
        return categoryMatch && rarityMatch;
    });

    const categories = [
        { key: 'all', label: 'All', count: achievements.length },
        { key: 'milestone', label: 'Milestones', count: achievements.filter(a => a.category === 'milestone').length },
        { key: 'test', label: 'Tests', count: achievements.filter(a => a.category === 'test').length },
        { key: 'streak', label: 'Streaks', count: achievements.filter(a => a.category === 'streak').length },
        { key: 'study', label: 'Study', count: achievements.filter(a => a.category === 'study').length },
        { key: 'special', label: 'Special', count: achievements.filter(a => a.category === 'special').length },
    ];

    const rarities = [
        { key: 'all', label: 'All Rarities' },
        { key: 'common', label: 'Common' },
        { key: 'rare', label: 'Rare' },
        { key: 'epic', label: 'Epic' },
        { key: 'legendary', label: 'Legendary' },
    ];

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements & Badges</h1>
                <p className="text-gray-600">Track your progress and celebrate your accomplishments</p>
            </div>

            {/* Stats Overview */}
            {leaderboard && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{leaderboard.totalPoints}</p>
                                <p className="text-sm text-gray-600">Total Points</p>
                            </div>
                            <Star className="text-yellow-500" size={24} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{leaderboard.totalAchievements}</p>
                                <p className="text-sm text-gray-600">Achievements</p>
                            </div>
                            <Trophy className="text-blue-500" size={24} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">#{leaderboard.rank}</p>
                                <p className="text-sm text-gray-600">Overall Rank</p>
                            </div>
                            <Crown className="text-purple-500" size={24} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">#{leaderboard.weeklyRank}</p>
                                <p className="text-sm text-gray-600">Weekly Rank</p>
                            </div>
                            <TrendingUp className="text-green-500" size={24} />
                        </div>
                    </div>
                </div>
            )}

            {/* Badges Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Badges</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.map((badge) => {
                        const IconComponent = getIcon(badge.icon);
                        return (
                            <div
                                key={badge.id}
                                className={`p-4 rounded-lg border-2 transition-all ${badge.earned
                                        ? 'border-primary-300 bg-primary-50'
                                        : 'border-gray-200 bg-gray-50 opacity-60'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center mx-auto mb-2 ${!badge.earned && 'grayscale'
                                        }`}>
                                        <IconComponent className="text-white" size={20} />
                                    </div>
                                    <h3 className="font-medium text-gray-900 text-sm">{badge.name}</h3>
                                    <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                                    {badge.earned && badge.earnedAt && (
                                        <p className="text-xs text-primary-600 mt-1">
                                            Earned {new Date(badge.earnedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.key}
                                onClick={() => setSelectedCategory(category.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.key
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category.label} ({category.count})
                            </button>
                        ))}
                    </div>

                    {/* Rarity Filter */}
                    <select
                        value={selectedRarity}
                        onChange={(e) => setSelectedRarity(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        {rarities.map((rarity) => (
                            <option key={rarity.key} value={rarity.key}>
                                {rarity.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAchievements.map((achievement) => {
                    const IconComponent = getIcon(achievement.icon);
                    const isLocked = !achievement.unlocked;

                    return (
                        <div
                            key={achievement.id}
                            className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-md ${getRarityColor(achievement.rarity)
                                } ${isLocked ? 'opacity-75' : ''}`}
                        >
                            {/* Rarity Indicator */}
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${achievement.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
                                        achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-700' :
                                            achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-700' :
                                                'bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800'
                                    }`}>
                                    {achievement.rarity}
                                </span>
                            </div>

                            {/* Lock Overlay */}
                            {isLocked && (
                                <div className="absolute top-3 left-3">
                                    <Lock className="text-gray-400" size={20} />
                                </div>
                            )}

                            {/* Achievement Icon */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${achievement.rarity === 'legendary'
                                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                                    : achievement.unlocked
                                        ? 'bg-primary-600'
                                        : 'bg-gray-400'
                                }`}>
                                <IconComponent className="text-white" size={24} />
                            </div>

                            {/* Achievement Info */}
                            <div className="mb-4">
                                <h3 className={`text-lg font-bold mb-2 ${getRarityTextColor(achievement.rarity)}`}>
                                    {achievement.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>

                                {/* Points */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <Star className="text-yellow-500" size={16} />
                                        <span className="font-medium text-gray-900">{achievement.points} points</span>
                                    </div>
                                    {achievement.unlocked && achievement.unlockedAt && (
                                        <span className="text-xs text-gray-500">
                                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full transition-all"
                                                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Requirements */}
                                <div>
                                    <p className="text-xs font-medium text-gray-700 mb-1">Requirements:</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        {achievement.requirements.map((req, index) => (
                                            <li key={index} className="flex items-center space-x-1">
                                                {achievement.unlocked ? (
                                                    <CheckCircle className="text-green-500" size={12} />
                                                ) : (
                                                    <div className="w-3 h-3 border border-gray-300 rounded-full"></div>
                                                )}
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Achievement Status */}
                            {achievement.unlocked ? (
                                <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-100 py-2 rounded-lg">
                                    <CheckCircle size={16} />
                                    <span className="text-sm font-medium">Unlocked</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2 text-gray-500 bg-gray-100 py-2 rounded-lg">
                                    <Lock size={16} />
                                    <span className="text-sm font-medium">Locked</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredAchievements.length === 0 && (
                <div className="text-center py-12">
                    <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No achievements found</h3>
                    <p className="text-gray-600">Try adjusting your filters to see more achievements</p>
                </div>
            )}
        </div>
    );
}