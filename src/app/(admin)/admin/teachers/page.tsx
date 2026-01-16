"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, Trash2, Loader2, Search, Mail, Phone, BookOpen, ToggleLeft, ToggleRight, Award, GraduationCap, Briefcase, Star } from "lucide-react";

interface Teacher {
    id: string;
    email: string;
    full_name: string | null;
    subject: string | null;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    courses_count?: number;
    experience_years?: number;
    qualification?: string;
    specialization?: string;
}

// Government exam subjects for teachers
const EXAM_SUBJECTS = [
    "General Knowledge",
    "Current Affairs",
    "Reasoning & Logic",
    "Quantitative Aptitude",
    "Mathematics",
    "English Language",
    "Hindi Language",
    "General Science",
    "Computer Knowledge",
    "Geography",
    "History",
    "Indian Polity",
    "Economics",
    "SSC Complete",
    "Railway Complete",
    "Bank Complete",
    "RPSC Complete",
    "All Subjects",
];

// Exam categories for specialization
const EXAM_CATEGORIES = [
    "SSC (CGL, CHSL, MTS)",
    "Railway (RRB NTPC, Group D, ALP)",
    "Banking (IBPS, SBI, RBI)",
    "RPSC (RAS, 1st Grade, 2nd Grade)",
    "RSMSSB (Patwari, LDC, VDO)",
    "Police (Constable, SI)",
    "UPSC (Civil Services)",
    "Teaching (REET, CTET, NET)",
    "Defense (CDS, NDA, AFCAT)",
    "State PSC",
    "Multiple Exams",
];

// Qualifications
const QUALIFICATIONS = [
    "Ph.D.",
    "M.Phil",
    "Post Graduate (M.A./M.Sc./M.Com)",
    "Graduate (B.A./B.Sc./B.Com)",
    "B.Ed",
    "M.Ed",
    "NET/JRF Qualified",
    "Government Job Experience",
    "Other",
];

export default function TeachersPage() {
    const supabase = createClient();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [newTeacher, setNewTeacher] = useState({
        email: "",
        password: "",
        full_name: "",
        subject: "",
        phone: "",
        experience_years: "",
        qualification: "",
        specialization: "",
        bio: "",
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    async function fetchTeachers() {
        try {
            console.log("Fetching teachers via API...");

            const response = await fetch("/api/admin/teachers");
            const result = await response.json();

            if (!response.ok) {
                console.error("API error:", result.error);
                setError("Failed to fetch teachers: " + result.error);
                setLoading(false);
                return;
            }

            console.log("Teachers fetched:", result.teachers?.length || 0);
            setTeachers(result.teachers || []);
            setLoading(false);
        } catch (err) {
            console.error("Fetch teachers error:", err);
            setError("Failed to fetch teachers");
            setLoading(false);
        }
    }

    const handleCreateTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            // Create user account using Supabase Auth Admin API
            const response = await fetch("/api/admin/create-teacher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTeacher),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to create teacher");
            }

            setSuccess("Teacher account created successfully!");
            setNewTeacher({
                email: "",
                password: "",
                full_name: "",
                subject: "",
                phone: "",
                experience_years: "",
                qualification: "",
                specialization: "",
                bio: "",
            });
            setShowAddForm(false);

            // Wait a moment then refresh the list
            setTimeout(() => {
                fetchTeachers();
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create teacher");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (teacherId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ is_active: !currentStatus })
                .eq("id", teacherId);

            if (error) throw error;
            fetchTeachers();
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    const handleDeleteTeacher = async (teacherId: string, teacherName: string) => {
        if (!confirm(`Are you sure you want to remove ${teacherName || "this teacher"}? Their courses will remain but won't be assigned to any teacher.`)) {
            return;
        }

        try {
            // Update profile role to student (soft delete)
            const { error } = await supabase
                .from("profiles")
                .update({ role: "student", is_active: false })
                .eq("id", teacherId);

            if (error) throw error;

            // Remove teacher_id from their courses
            await supabase
                .from("courses")
                .update({ teacher_id: null })
                .eq("teacher_id", teacherId);

            fetchTeachers();
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to remove teacher");
        }
    };

    const filteredTeachers = teachers.filter(teacher =>
        (teacher.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (teacher.subject?.toLowerCase() || "").includes(searchQuery.toLowerCase())
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
                    <h2 className="text-2xl font-bold text-gray-900">Faculty Management</h2>
                    <p className="text-gray-500 mt-1">Manage teacher accounts for government exam coaching</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => fetchTeachers()}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                    >
                        <Loader2 size={20} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                    >
                        <UserPlus size={20} />
                        Add Faculty
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <UserPlus className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
                            <p className="text-sm text-gray-500">Total Faculty</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <ToggleRight className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{teachers.filter(t => t.is_active).length}</p>
                            <p className="text-sm text-gray-500">Active</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{teachers.reduce((sum, t) => sum + (t.courses_count || 0), 0)}</p>
                            <p className="text-sm text-gray-500">Total Courses</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Award className="text-orange-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{teachers.filter(t => (t.courses_count || 0) > 0).length}</p>
                            <p className="text-sm text-gray-500">With Courses</p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>
            )}
            {success && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-6">{success}</div>
            )}

            {/* Add Teacher Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Teacher</h3>
                    <p className="text-sm text-gray-500 mb-4">Create a teacher account for government exam coaching faculty</p>

                    {/* Guidelines */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">👨‍🏫 Teacher Account Guidelines</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Teachers can create and manage their own courses</li>
                            <li>• Courses created by teachers require admin approval</li>
                            <li>• Teachers can upload videos and documents to their courses</li>
                            <li>• Select appropriate subject expertise for government exams</li>
                        </ul>
                    </div>

                    <form onSubmit={handleCreateTeacher} className="space-y-6">
                        {/* Basic Information */}
                        <div className="border-b border-gray-200 pb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <UserPlus size={16} className="text-primary-600" />
                                Basic Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={newTeacher.full_name}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, full_name: e.target.value })}
                                        placeholder="e.g., Dr. Rajesh Sharma"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={newTeacher.phone}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                                        placeholder="+91 9876543210"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Login Credentials */}
                        <div className="border-b border-gray-200 pb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <Mail size={16} className="text-primary-600" />
                                Login Credentials
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        value={newTeacher.email}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                        placeholder="teacher@example.com"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Teacher will use this email to login</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                                    <input
                                        type="password"
                                        value={newTeacher.password}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                        placeholder="Min 6 characters"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        required
                                        minLength={6}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Share this password with the teacher</p>
                                </div>
                            </div>
                        </div>

                        {/* Teaching Expertise */}
                        <div className="border-b border-gray-200 pb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <BookOpen size={16} className="text-primary-600" />
                                Teaching Expertise
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Subject *</label>
                                    <select
                                        value={newTeacher.subject}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        required
                                    >
                                        <option value="">Select Subject</option>
                                        {EXAM_SUBJECTS.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Exam Specialization *</label>
                                    <select
                                        value={newTeacher.specialization}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, specialization: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        required
                                    >
                                        <option value="">Select Exam Category</option>
                                        {EXAM_CATEGORIES.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Qualifications & Experience */}
                        <div className="border-b border-gray-200 pb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <GraduationCap size={16} className="text-primary-600" />
                                Qualifications & Experience
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification</label>
                                    <select
                                        value={newTeacher.qualification}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="">Select Qualification</option>
                                        {QUALIFICATIONS.map(qual => (
                                            <option key={qual} value={qual}>{qual}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Experience (Years)</label>
                                    <select
                                        value={newTeacher.experience_years}
                                        onChange={(e) => setNewTeacher({ ...newTeacher, experience_years: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="">Select Experience</option>
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
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio (Optional)</label>
                            <textarea
                                value={newTeacher.bio}
                                onChange={(e) => setNewTeacher({ ...newTeacher, bio: e.target.value })}
                                placeholder="Brief introduction about the teacher's expertise, achievements, and teaching style..."
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">This will be shown on the teacher's profile</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                                Create Teacher Account
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition"
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
                        placeholder="Search by name, email, or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
            </div>

            {/* Teachers List */}
            {filteredTeachers.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Faculty Member</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Subject & Expertise</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Contact</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Courses</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTeachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {(teacher.full_name || teacher.email).charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{teacher.full_name || "No name"}</p>
                                                <p className="text-sm text-gray-500">{teacher.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                                                {teacher.subject || "Not specified"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Mail size={14} className="text-gray-400" /> {teacher.email}
                                            </p>
                                            {teacher.phone && (
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <Phone size={14} className="text-gray-400" /> {teacher.phone}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <BookOpen size={16} className="text-purple-600" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900">{teacher.courses_count || 0}</span>
                                                <p className="text-xs text-gray-500">courses</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleActive(teacher.id, teacher.is_active)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${teacher.is_active
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {teacher.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                            {teacher.is_active ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDeleteTeacher(teacher.id, teacher.full_name || "")}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Remove Faculty"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="text-purple-600" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty members yet</h3>
                    <p className="text-gray-500 mb-4">Add your first teacher to start creating courses for government exam preparation</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                        Add First Faculty
                    </button>
                </div>
            )}
        </div>
    );
}
