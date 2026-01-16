"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save, User } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

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
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (error) throw error;

            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update profile" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                <p className="text-gray-500 mt-1">Update your profile information</p>
            </div>

            {message.text && (
                <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-purple-600" size={40} />
                            )}
                        </div>
                        <div className="flex-1">
                            <ImageUploader
                                currentImageUrl={profile.avatar_url}
                                onImageChange={(url) => setProfile({ ...profile, avatar_url: url })}
                                folder="avatars"
                                label="Profile Photo"
                                aspectRatio="square"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject/Specialization</label>
                            <input
                                type="text"
                                value={profile.subject}
                                onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                                placeholder="e.g., Mathematics, Physics"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="+91 9876543210"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            placeholder="Tell students about yourself..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
