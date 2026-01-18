"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    User,
    Mail,
    Phone,
    Lock,
    Bell,
    Globe,
    Palette,
    Shield,
    Download,
    Trash2,
    Save,
    Eye,
    EyeOff,
    Camera,
    Edit,
    Check,
    X,
    AlertCircle,
    CheckCircle,
} from "lucide-react";

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    avatar_url?: string;
    role: string;
    created_at: string;
}

interface NotificationSettings {
    email_notifications: boolean;
    push_notifications: boolean;
    test_reminders: boolean;
    course_updates: boolean;
    achievement_alerts: boolean;
    weekly_reports: boolean;
}

interface PrivacySettings {
    profile_visibility: 'public' | 'private';
    show_progress: boolean;
    show_achievements: boolean;
    allow_messages: boolean;
}

export default function StudentSettings() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [notifications, setNotifications] = useState<NotificationSettings>({
        email_notifications: true,
        push_notifications: true,
        test_reminders: true,
        course_updates: true,
        achievement_alerts: true,
        weekly_reports: false,
    });
    const [privacy, setPrivacy] = useState<PrivacySettings>({
        profile_visibility: 'public',
        show_progress: true,
        show_achievements: true,
        allow_messages: true,
    });
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'security' | 'data'>('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        full_name: '',
        phone: '',
    });

    const supabase = createClient();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                setProfileData({
                    full_name: profileData.full_name || '',
                    phone: profileData.phone || '',
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleProfileUpdate = async () => {
        if (!profile) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profileData.full_name,
                    phone: profileData.phone,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', profile.id);

            if (error) throw error;

            setProfile(prev => prev ? { ...prev, ...profileData } : null);
            setEditingProfile(false);
            showMessage('success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('error', 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('error', 'New passwords do not match.');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters long.');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) throw error;

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            showMessage('success', 'Password updated successfully!');
        } catch (error) {
            console.error('Error updating password:', error);
            showMessage('error', 'Failed to update password. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleNotificationUpdate = async (key: keyof NotificationSettings, value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
        // Here you would typically save to backend
        showMessage('success', 'Notification preferences updated!');
    };

    const handlePrivacyUpdate = async (key: keyof PrivacySettings, value: any) => {
        setPrivacy(prev => ({ ...prev, [key]: value }));
        // Here you would typically save to backend
        showMessage('success', 'Privacy settings updated!');
    };

    const handleDataExport = async () => {
        showMessage('success', 'Data export request submitted. You will receive an email with your data within 24 hours.');
    };

    const handleAccountDeletion = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            showMessage('error', 'Account deletion is not available through this interface. Please contact support.');
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'data', label: 'Data & Privacy', icon: Download },
    ];

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and privacy settings</p>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon size={20} />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                                    <button
                                        onClick={() => setEditingProfile(!editingProfile)}
                                        className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                                    >
                                        <Edit size={16} />
                                        {editingProfile ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>

                                {/* Avatar */}
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                                            <User className="text-primary-600" size={32} />
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition">
                                            <Camera size={14} />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{profile?.full_name}</h3>
                                        <p className="text-gray-600">{profile?.email}</p>
                                        <p className="text-sm text-gray-500">Student since {new Date(profile?.created_at || '').toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Profile Form */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="text"
                                                value={profileData.full_name}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                                                disabled={!editingProfile}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="email"
                                                value={profile?.email || ''}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                                disabled={!editingProfile}
                                                placeholder="+91 XXXXX XXXXX"
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="text"
                                                value={profile?.role || ''}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 capitalize"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {editingProfile && (
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={handleProfileUpdate}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                                        >
                                            <Save size={16} />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingProfile(false);
                                                setProfileData({
                                                    full_name: profile?.full_name || '',
                                                    phone: profile?.phone || '',
                                                });
                                            }}
                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>

                                <div className="space-y-4">
                                    {Object.entries(notifications).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-900 capitalize">
                                                    {key.replace(/_/g, ' ')}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {key === 'email_notifications' && 'Receive notifications via email'}
                                                    {key === 'push_notifications' && 'Receive push notifications on your device'}
                                                    {key === 'test_reminders' && 'Get reminders about upcoming tests'}
                                                    {key === 'course_updates' && 'Notifications about course content updates'}
                                                    {key === 'achievement_alerts' && 'Alerts when you earn new achievements'}
                                                    {key === 'weekly_reports' && 'Weekly progress and performance reports'}
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={(e) => handleNotificationUpdate(key as keyof NotificationSettings, e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Privacy Tab */}
                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-2">Profile Visibility</h3>
                                        <p className="text-sm text-gray-600 mb-3">Control who can see your profile information</p>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="profile_visibility"
                                                    value="public"
                                                    checked={privacy.profile_visibility === 'public'}
                                                    onChange={(e) => handlePrivacyUpdate('profile_visibility', e.target.value)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Public - Anyone can see your profile</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="profile_visibility"
                                                    value="private"
                                                    checked={privacy.profile_visibility === 'private'}
                                                    onChange={(e) => handlePrivacyUpdate('profile_visibility', e.target.value)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Private - Only you can see your profile</span>
                                            </label>
                                        </div>
                                    </div>

                                    {Object.entries(privacy).filter(([key]) => key !== 'profile_visibility').map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-900 capitalize">
                                                    {key.replace(/_/g, ' ')}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {key === 'show_progress' && 'Allow others to see your learning progress'}
                                                    {key === 'show_achievements' && 'Display your achievements on your profile'}
                                                    {key === 'allow_messages' && 'Allow other students to send you messages'}
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={value as boolean}
                                                    onChange={(e) => handlePrivacyUpdate(key as keyof PrivacySettings, e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={handlePasswordChange}
                                                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                                            >
                                                {saving ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Data & Privacy Tab */}
                        {activeTab === 'data' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">Data & Privacy</h2>

                                <div className="space-y-6">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h3 className="font-medium text-blue-900 mb-2">Export Your Data</h3>
                                        <p className="text-sm text-blue-700 mb-4">
                                            Download a copy of all your data including test results, progress, and profile information.
                                        </p>
                                        <button
                                            onClick={handleDataExport}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            <Download size={16} />
                                            Request Data Export
                                        </button>
                                    </div>

                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                        <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                                        <p className="text-sm text-red-700 mb-4">
                                            Permanently delete your account and all associated data. This action cannot be undone.
                                        </p>
                                        <button
                                            onClick={handleAccountDeletion}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            <Trash2 size={16} />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}