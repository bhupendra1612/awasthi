"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save, User, Mail, Phone, BookOpen, GraduationCap, Award, CheckCircle, Target } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const examCategories = [
    "SSC", "Railway", "Bank", "RPSC", "RSMSSB", "Police", "REET", "Patwari", "Other"
];

const subjects = [
    "Mathematics", "Reasoning", "English", "Hindi", "General Knowledge",
    "Current Affairs", "Science", "Computer", "Rajasthan GK", "Other"
];

export default function TeacherProfilePage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [profile, setProfile] = useState({
        full_name: "",
        email: "",
        subject: "",
        phone: "",
        bio: "",
        avatar_url: null as string | null,
        experience_years: "",
        qualification: "",
        exam_specialization: [] as string[],
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (data) {
            setProfile({
                full_name: data.full_name || "",
                email: data.email || user.email || "",
                subject: data.subject || "",
                phone: data.phone || "",
                bio: data.bio || "",
                avatar_url: data.avatar_url || null,
                experience_years: data.experience_years?.toString() || "",
                qualification: data.qualification || "",
                exam_specialization: data.exam_specialization || [],
            });
        }
        setLoading(false);
    }

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: profile.full_name,
                    subject: profile.subject,
                    phone: profile.phone,
                    bio: profile.bio,
                    avatar_url: profile.avatar_url,
                    experience_years: profile.experience_years ? parseInt(profile.experience_years) : null,
                    qualification: profile.qualification,
                    exam_specialization: profile.exam_specialization,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (error) throw error;

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (err) {
            setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update profile" });
        } finally {
            setSaving(false);
        }
    };

    const toggleExamSpecialization = (exam: string) => {
        setProfile(prev => ({
            ...prev,
            exam_specialization: prev.exam_specialization.includes(exam)
                ? prev.exam_specialization.filter(e => e !== exam)
                : [...prev.exam_specialization, exam]
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary-600 mx-auto mb-4" size={40} />
                    <p className="text-gray-500">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                <p className="text-gray-500 mt-1">Update your teacher profile for Awasthi Classes</p>
            </div>

            {/* Success/Error Message */}
            {message.text && (
                <div className={`px-4 py-3 rounded-xl flex items-center gap-2 ${message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                    {message.type === "success" && <CheckCircle size={18} />}
                    {message.text}
                </div>
            )}

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 h-24 relative">
                    <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
                </div>

                <div className="px-8 pb-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-12 mb-8">
                        <div className="w-28 h-28 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden border-4 border-white">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center">
                                    <User className="text-primary-600" size={48} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <ImageUploader
                                currentImageUrl={profile.avatar_url}
                                onImageChange={(url) => setProfile({ ...profile, avatar_url: url })}
                                folder="profiles"
                                label="Change Photo"
                                aspectRatio="square"
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended: Square image, at least 200x200px</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User size={20} className="text-primary-600" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            placeholder="+91 9876543210"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                                    <div className="relative">
                                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            value={profile.experience_years}
                                            onChange={(e) => setProfile({ ...profile, experience_years: e.target.value })}
                                            placeholder="e.g., 5"
                                            min="0"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Teaching Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <GraduationCap size={20} className="text-primary-600" />
                                Teaching Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject/Specialization</label>
                                    <select
                                        value={profile.subject}
                                        onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                                    <input
                                        type="text"
                                        value={profile.qualification}
                                        onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                                        placeholder="e.g., M.Sc Mathematics, B.Ed"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Exam Specialization */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Target size={20} className="text-primary-600" />
                                Exam Specialization
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">Select the exams you specialize in teaching</p>
                            <div className="flex flex-wrap gap-2">
                                {examCategories.map(exam => (
                                    <button
                                        key={exam}
                                        type="button"
                                        onClick={() => toggleExamSpecialization(exam)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${profile.exam_specialization.includes(exam)
                                            ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {profile.exam_specialization.includes(exam) && <CheckCircle size={14} className="inline mr-1" />}
                                        {exam}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen size={20} className="text-primary-600" />
                                About You
                            </h3>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Tell students about your teaching experience, achievements, and teaching style..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">{profile.bio.length}/500 characters</p>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="text-yellow-600" size={20} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">💡 Profile Tips</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Add a professional photo to build trust with students</li>
                            <li>• Mention your teaching experience and achievements</li>
                            <li>• Select all exams you can teach for better visibility</li>
                            <li>• Keep your bio concise but informative</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
