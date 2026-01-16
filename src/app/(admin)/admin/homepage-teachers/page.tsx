"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    UserPlus, Trash2, Loader2, Search, Edit2, Save, X,
    GraduationCap, Award, ArrowUp, ArrowDown, Eye, EyeOff,
    Upload, Crown
} from "lucide-react";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";

interface Teacher {
    id: string;
    name: string;
    designation: string | null;
    bio: string | null;
    photo_url: string | null;
    subjects: string[] | null;
    experience_years: number;
    qualifications: string[] | null;
    order_index: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
}

export default function HomepageTeachersPage() {
    const supabase = createClient();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        bio: "",
        photo_url: "",
        subjects: "",
        experience_years: 0,
        qualifications: "",
        is_featured: false,
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    async function fetchTeachers() {
        const { data, error } = await supabase
            .from("teachers")
            .select("*")
            .order("order_index", { ascending: true });

        if (error) {
            console.error("Error fetching teachers:", error);
        } else {
            setTeachers(data || []);
        }
        setLoading(false);
    }

    const resetForm = () => {
        setFormData({
            name: "",
            designation: "",
            bio: "",
            photo_url: "",
            subjects: "",
            experience_years: 0,
            qualifications: "",
            is_featured: false,
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (teacher: Teacher) => {
        setFormData({
            name: teacher.name,
            designation: teacher.designation || "",
            bio: teacher.bio || "",
            photo_url: teacher.photo_url || "",
            subjects: teacher.subjects?.join(", ") || "",
            experience_years: teacher.experience_years,
            qualifications: teacher.qualifications?.join(", ") || "",
            is_featured: teacher.is_featured || false,
        });
        setEditingId(teacher.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        const teacherData = {
            name: formData.name,
            designation: formData.designation || null,
            bio: formData.bio || null,
            photo_url: formData.photo_url || null,
            subjects: formData.subjects ? formData.subjects.split(",").map(s => s.trim()) : null,
            experience_years: formData.experience_years,
            qualifications: formData.qualifications ? formData.qualifications.split(",").map(q => q.trim()) : null,
            is_featured: formData.is_featured,
        };

        try {
            if (editingId) {
                const { error } = await supabase
                    .from("teachers")
                    .update(teacherData)
                    .eq("id", editingId);

                if (error) throw error;
                setSuccess("Teacher updated successfully!");
            } else {
                const maxOrder = teachers.length > 0 ? Math.max(...teachers.map(t => t.order_index)) : 0;
                const { error } = await supabase
                    .from("teachers")
                    .insert({ ...teacherData, order_index: maxOrder + 1 });

                if (error) throw error;
                setSuccess("Teacher added successfully!");
            }

            resetForm();
            fetchTeachers();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save teacher");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("teachers")
            .update({ is_active: !currentStatus })
            .eq("id", id);

        if (!error) fetchTeachers();
    };

    const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("teachers")
            .update({ is_featured: !currentStatus })
            .eq("id", id);

        if (!error) fetchTeachers();
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;

        const { error } = await supabase
            .from("teachers")
            .delete()
            .eq("id", id);

        if (!error) {
            setSuccess("Teacher deleted successfully!");
            fetchTeachers();
        }
    };

    const handleReorder = async (id: string, direction: "up" | "down") => {
        const index = teachers.findIndex(t => t.id === id);
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === teachers.length - 1)
        ) return;

        const swapIndex = direction === "up" ? index - 1 : index + 1;
        const currentTeacher = teachers[index];
        const swapTeacher = teachers[swapIndex];

        await supabase
            .from("teachers")
            .update({ order_index: swapTeacher.order_index })
            .eq("id", currentTeacher.id);

        await supabase
            .from("teachers")
            .update({ order_index: currentTeacher.order_index })
            .eq("id", swapTeacher.id);

        fetchTeachers();
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (teacher.designation?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Homepage Teachers</h2>
                    <p className="text-gray-500 mt-1">Manage teachers displayed on the homepage</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                >
                    <UserPlus size={20} />
                    Add Teacher
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>
            )}
            {success && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-6">{success}</div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {editingId ? "Edit Teacher" : "Add New Teacher"}
                        </h3>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Guidelines */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">👨‍🏫 Homepage Teacher Guidelines</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Upload a professional photo (square format recommended)</li>
                            <li>• Use "Featured" to highlight top teachers at the top of homepage</li>
                            <li>• Teachers are displayed in the order you set (use arrows to reorder)</li>
                            <li>• Only active teachers will be visible on the homepage</li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                                <select
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    required
                                >
                                    <option value="">Select Designation</option>
                                    <option value="Senior Faculty">Senior Faculty</option>
                                    <option value="Head of Department">Head of Department</option>
                                    <option value="Subject Expert">Subject Expert</option>
                                    <option value="Assistant Professor">Assistant Professor</option>
                                    <option value="Associate Professor">Associate Professor</option>
                                    <option value="Professor">Professor</option>
                                    <option value="Director">Director</option>
                                    <option value="Principal">Principal</option>
                                    <option value="Guest Faculty">Guest Faculty</option>
                                    <option value="Visiting Faculty">Visiting Faculty</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Subject *</label>
                                <select
                                    value={formData.subjects.split(',')[0]?.trim() || ""}
                                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    required
                                >
                                    <option value="">Select Primary Subject</option>
                                    <option value="General Knowledge">General Knowledge</option>
                                    <option value="Current Affairs">Current Affairs</option>
                                    <option value="Reasoning & Logic">Reasoning & Logic</option>
                                    <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="English Language">English Language</option>
                                    <option value="Hindi Language">Hindi Language</option>
                                    <option value="General Science">General Science</option>
                                    <option value="Computer Knowledge">Computer Knowledge</option>
                                    <option value="Geography">Geography</option>
                                    <option value="History">History</option>
                                    <option value="Indian Polity">Indian Polity</option>
                                    <option value="Economics">Economics</option>
                                    <option value="All Subjects">All Subjects</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years) *</label>
                                <select
                                    value={formData.experience_years.toString()}
                                    onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    required
                                >
                                    <option value="0">Select Experience</option>
                                    <option value="1">1 Year</option>
                                    <option value="2">2 Years</option>
                                    <option value="3">3 Years</option>
                                    <option value="5">5 Years</option>
                                    <option value="7">7 Years</option>
                                    <option value="10">10+ Years</option>
                                    <option value="15">15+ Years</option>
                                    <option value="20">20+ Years</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification</label>
                            <select
                                value={formData.qualifications.split(',')[0]?.trim() || ""}
                                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="">Select Qualification</option>
                                <option value="Ph.D.">Ph.D.</option>
                                <option value="M.Phil">M.Phil</option>
                                <option value="Post Graduate">Post Graduate (M.A./M.Sc./M.Com)</option>
                                <option value="Graduate">Graduate (B.A./B.Sc./B.Com)</option>
                                <option value="B.Ed">B.Ed</option>
                                <option value="M.Ed">M.Ed</option>
                                <option value="NET/JRF Qualified">NET/JRF Qualified</option>
                                <option value="Government Job Experience">Government Job Experience</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Photo</label>
                            <ImageUploader
                                currentImageUrl={formData.photo_url || null}
                                onImageChange={(url) => setFormData({ ...formData, photo_url: url || "" })}
                                folder="teachers"
                                label="Upload Teacher Photo"
                                aspectRatio="square"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Description</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Brief description about the teacher..."
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <label htmlFor="is_featured" className="text-sm text-gray-700">
                                Featured Teacher (shown prominently at top)
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {editingId ? "Update Teacher" : "Add Teacher"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search teachers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
            </div>

            {/* Teachers List */}
            {filteredTeachers.length > 0 ? (
                <div className="space-y-4">
                    {filteredTeachers.map((teacher, index) => (
                        <div
                            key={teacher.id}
                            className={`bg-white rounded-xl shadow-sm p-6 ${!teacher.is_active ? 'opacity-60' : ''} ${teacher.is_featured ? 'ring-2 ring-yellow-400' : ''}`}
                        >
                            <div className="flex items-start gap-6">
                                {/* Photo */}
                                <div className="flex-shrink-0">
                                    {teacher.photo_url ? (
                                        <div className="w-24 h-24 rounded-xl overflow-hidden">
                                            <Image
                                                src={teacher.photo_url}
                                                alt={teacher.name}
                                                width={96}
                                                height={96}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-3xl font-bold text-primary-600">
                                                {teacher.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{teacher.name}</h3>
                                        {teacher.is_featured && (
                                            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <Crown size={12} /> Featured
                                            </span>
                                        )}
                                        {!teacher.is_active && (
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Hidden</span>
                                        )}
                                    </div>
                                    <p className="text-primary-600 font-medium">{teacher.designation}</p>

                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                        {teacher.experience_years > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Award size={14} /> {teacher.experience_years}+ Years
                                            </span>
                                        )}
                                        {teacher.subjects && teacher.subjects.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <GraduationCap size={14} /> {teacher.subjects.join(", ")}
                                            </span>
                                        )}
                                    </div>

                                    {teacher.qualifications && teacher.qualifications.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {teacher.qualifications.map((q, i) => (
                                                <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                    {q}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {teacher.bio && (
                                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{teacher.bio}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleReorder(teacher.id, "up")}
                                            disabled={index === 0}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                                            title="Move Up"
                                        >
                                            <ArrowUp size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleReorder(teacher.id, "down")}
                                            disabled={index === filteredTeachers.length - 1}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                                            title="Move Down"
                                        >
                                            <ArrowDown size={18} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleToggleFeatured(teacher.id, teacher.is_featured || false)}
                                        className={`p-2 rounded-lg ${teacher.is_featured ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
                                        title={teacher.is_featured ? "Remove Featured" : "Make Featured"}
                                    >
                                        <Crown size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(teacher.id, teacher.is_active)}
                                        className={`p-2 rounded-lg ${teacher.is_active ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                                        title={teacher.is_active ? "Hide from Homepage" : "Show on Homepage"}
                                    >
                                        {teacher.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(teacher)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(teacher.id, teacher.name)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers added yet</h3>
                    <p className="text-gray-500 mb-4">Add teachers to display on your homepage</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                        Add First Teacher
                    </button>
                </div>
            )}
        </div>
    );
}
