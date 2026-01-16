import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Crown, Award, GraduationCap, Star, Sparkles } from "lucide-react";

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
}

const gradients = [
    { gradient: "from-blue-500 to-cyan-500", bgGradient: "from-blue-50 to-cyan-50" },
    { gradient: "from-purple-500 to-pink-500", bgGradient: "from-purple-50 to-pink-50" },
    { gradient: "from-green-500 to-emerald-500", bgGradient: "from-green-50 to-emerald-50" },
    { gradient: "from-orange-500 to-red-500", bgGradient: "from-orange-50 to-red-50" },
    { gradient: "from-indigo-500 to-violet-500", bgGradient: "from-indigo-50 to-violet-50" },
    { gradient: "from-yellow-500 to-orange-500", bgGradient: "from-yellow-50 to-orange-50" },
];

export default async function Teachers() {
    const supabase = await createClient();

    const { data: teachers } = await supabase
        .from("teachers")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (!teachers || teachers.length === 0) {
        return null;
    }

    const featuredTeachers = teachers.filter((t: Teacher) => t.is_featured);
    const otherTeachers = teachers.filter((t: Teacher) => !t.is_featured);

    return (
        <section id="teachers" className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-[5%] w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-20 right-[5%] w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full blur-3xl opacity-10" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-4">
                        <GraduationCap size={18} />
                        Expert Faculty
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        Meet Our{" "}
                        <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Expert Teachers
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Learn from experienced educators who have helped 1000+ students crack government exams
                    </p>
                </div>

                {/* Featured Teachers */}
                {featuredTeachers.length > 0 && (
                    <div className="mb-12 space-y-8">
                        {featuredTeachers.map((teacher: Teacher, index: number) => {
                            const colors = gradients[index % gradients.length];
                            return (
                                <div
                                    key={teacher.id}
                                    className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-3xl p-8 md:p-10 shadow-xl border border-yellow-200/50 overflow-hidden"
                                >
                                    {/* Crown badge */}
                                    <div className="absolute top-4 right-4 md:top-6 md:right-6">
                                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                                            <Crown size={16} />
                                            {teacher.designation || "Head Faculty"}
                                        </div>
                                    </div>

                                    {/* Decorative elements */}
                                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-20" />
                                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl opacity-20" />

                                    <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
                                        {/* Photo */}
                                        <div className="flex justify-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl blur-2xl opacity-30 scale-90" />
                                                <div className="relative w-48 h-56 md:w-56 md:h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white animate-float">
                                                    {teacher.photo_url ? (
                                                        <Image
                                                            src={teacher.photo_url}
                                                            alt={teacher.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                                            <span className="text-6xl font-bold text-white">
                                                                {teacher.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Experience badge */}
                                                {teacher.experience_years > 0 && (
                                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                                        {teacher.experience_years}+ Years
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="md:col-span-2 text-center md:text-left">
                                            {teacher.qualifications && teacher.qualifications.length > 0 && (
                                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                                    <Sparkles className="text-yellow-500" size={20} />
                                                    <span className="text-yellow-600 font-medium">
                                                        {teacher.qualifications[0]}
                                                    </span>
                                                </div>
                                            )}
                                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{teacher.name}</h3>

                                            {teacher.subjects && teacher.subjects.length > 0 && (
                                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                                        <GraduationCap className="text-white" size={20} />
                                                    </div>
                                                    <span className="text-xl font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                                        {teacher.subjects.join(", ")} Expert
                                                    </span>
                                                </div>
                                            )}

                                            {teacher.bio && (
                                                <p className="text-gray-600 text-lg mb-6 leading-relaxed">{teacher.bio}</p>
                                            )}

                                            {/* Qualifications */}
                                            {teacher.qualifications && teacher.qualifications.length > 0 && (
                                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                                    {teacher.qualifications.map((qual, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-yellow-200"
                                                        >
                                                            <Award className="text-yellow-500" size={16} />
                                                            <span className="text-gray-700 font-medium text-sm">{qual}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Other Teachers Grid */}
                {otherTeachers.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherTeachers.map((teacher: Teacher, index: number) => {
                            const colors = gradients[index % gradients.length];
                            return (
                                <div
                                    key={teacher.id}
                                    className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1"
                                >
                                    {/* Gradient border on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                                    <div className="absolute inset-[2px] bg-white rounded-2xl" />

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Avatar */}
                                        <div className="flex flex-col items-center mb-5">
                                            <div className="relative mb-3">
                                                {teacher.photo_url ? (
                                                    <div className="w-28 h-28 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform shadow-md">
                                                        <Image
                                                            src={teacher.photo_url}
                                                            alt={teacher.name}
                                                            width={112}
                                                            height={112}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className={`w-28 h-28 bg-gradient-to-br ${colors.bgGradient} rounded-2xl flex items-center justify-center text-4xl font-bold text-gray-700 group-hover:scale-105 transition-transform shadow-md`}>
                                                        {teacher.name.charAt(0)}
                                                    </div>
                                                )}
                                                {teacher.subjects && teacher.subjects.length > 0 && (
                                                    <div className={`absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                                        <GraduationCap className="text-white" size={18} />
                                                    </div>
                                                )}
                                            </div>
                                            {teacher.experience_years > 0 && (
                                                <div className={`bg-gradient-to-r ${colors.gradient} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm`}>
                                                    {teacher.experience_years}+ Years Exp
                                                </div>
                                            )}
                                        </div>

                                        {/* Name & Role */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{teacher.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2 text-center">{teacher.designation}</p>

                                        {/* Subjects */}
                                        {teacher.subjects && teacher.subjects.length > 0 && (
                                            <div className="flex justify-center mb-3">
                                                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${colors.bgGradient} px-3 py-1 rounded-full`}>
                                                    <span className={`font-semibold text-sm bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                                                        {teacher.subjects.join(", ")}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Qualifications */}
                                        {teacher.qualifications && teacher.qualifications.length > 0 && (
                                            <p className="text-xs text-gray-500 mb-3 flex items-center justify-center gap-1">
                                                <Award size={14} className="text-yellow-500" />
                                                {teacher.qualifications[0]}
                                            </p>
                                        )}

                                        {/* Bio */}
                                        {teacher.bio && (
                                            <p className="text-gray-600 text-sm leading-relaxed text-center line-clamp-3">{teacher.bio}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Want to join our team of educators?</p>
                    <a
                        href="mailto:AWASTHICLASSESHND@GMAIL.COM?subject=Teaching%20Position%20Inquiry"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        <GraduationCap size={20} />
                        Apply as Teacher
                    </a>
                </div>
            </div>
        </section>
    );
}
