import Link from "next/link";
import Image from "next/image";
import { Play, Users, Award, CheckCircle, ArrowRight, Sparkles, TrendingUp, GraduationCap, FileText, Shield } from "lucide-react";

export default function Hero() {
    return (
        <section className="pt-20 pb-16 bg-gradient-to-br from-primary-50 via-white to-blue-50 overflow-hidden relative min-h-screen flex items-center">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

                {/* Floating icons */}
                <div className="absolute top-20 left-[10%] text-6xl font-light text-primary-200 animate-float select-none">📚</div>
                <div className="absolute top-40 right-[15%] text-5xl font-light text-blue-200 animate-float [animation-delay:1s] select-none">🎯</div>
                <div className="absolute bottom-32 left-[20%] text-4xl font-light text-primary-200 animate-float [animation-delay:2s] select-none">🏆</div>
                <div className="absolute top-1/3 left-[5%] text-3xl font-light text-blue-200 animate-float [animation-delay:0.5s] select-none">✨</div>
                <div className="absolute bottom-20 right-[25%] text-4xl font-light text-primary-200 animate-float [animation-delay:1.5s] select-none">📝</div>
                <div className="absolute top-1/2 right-[5%] text-3xl font-light text-blue-200 animate-float [animation-delay:0.8s] select-none">🎓</div>

                {/* Geometric shapes */}
                <div className="absolute top-32 right-[30%] w-20 h-20 border-2 border-primary-200 rounded-full animate-spin-slow opacity-40" />
                <div className="absolute bottom-24 left-[15%] w-16 h-16 border-2 border-blue-200 rotate-45 animate-pulse opacity-40" />

                {/* Gradient orbs */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary-300 to-blue-300 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-300 to-primary-300 rounded-full blur-3xl opacity-20 animate-pulse [animation-delay:1s]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce-slow">
                            <Sparkles size={16} className="text-yellow-500" />
                            <span>#1 Coaching in Hindaun</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Crack{" "}
                            <span className="relative">
                                <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Government
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 10C50 2 150 2 198 10" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                                            <stop stopColor="#2563eb" />
                                            <stop offset="1" stopColor="#7c3aed" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                            <br />
                            <span className="text-gray-800">Exams with Confidence</span>
                        </h1>

                        {/* Description */}
                        <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                            Hindaun&apos;s most trusted coaching center for Government Exam Preparation. Specializing in
                            <span className="font-semibold text-gray-800"> REET, Patwari, SSC, LDC, Police & Railway </span>
                            exams with expert guidance.
                        </p>

                        {/* Feature Pills */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            {["REET Level 1 & 2", "Patwari", "SSC/LDC", "Police & Railway"].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                                    <CheckCircle size={16} className="text-green-500" />
                                    <span className="text-sm font-medium text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/signup"
                                className="group bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-1 transition-all duration-300 text-center font-semibold flex items-center justify-center gap-2"
                            >
                                Start Learning Today
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#courses"
                                className="group bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl hover:border-primary-600 hover:text-primary-600 transition-all duration-300 text-center font-semibold flex items-center justify-center gap-2 hover:shadow-lg"
                            >
                                <Play size={20} className="group-hover:scale-110 transition-transform" />
                                View Courses
                            </Link>
                        </div>

                        {/* Stats Row */}
                        <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-4">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                        <Users className="text-white" size={18} />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-lg sm:text-2xl font-bold text-gray-900">1000+</p>
                                        <p className="text-xs sm:text-sm text-gray-500">Students</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                                        <TrendingUp className="text-white" size={18} />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-lg sm:text-2xl font-bold text-gray-900">90%+</p>
                                        <p className="text-xs sm:text-sm text-gray-500">Success</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                        <Award className="text-white" size={18} />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-lg sm:text-2xl font-bold text-gray-900">10+</p>
                                        <p className="text-xs sm:text-sm text-gray-500">Years</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Exam Cards */}
                    <div className="relative flex justify-center lg:justify-end">
                        {/* Decorative background elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[450px] lg:h-[450px]">
                            <div className="absolute inset-0 border-2 border-dashed border-primary-200 rounded-full animate-spin-slow opacity-50" />
                            <div className="absolute inset-8 border border-blue-200 rounded-full animate-pulse opacity-40" />
                        </div>

                        {/* Main content - Exam Cards Grid */}
                        <div className="relative z-10 grid grid-cols-2 gap-4 max-w-md">
                            {/* REET Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 animate-float">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                                    <GraduationCap className="text-white" size={28} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">REET</h3>
                                <p className="text-sm text-gray-500 mt-1">Level 1 & 2</p>
                                <div className="mt-3 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="text-xs text-green-600">New Batch</span>
                                </div>
                            </div>

                            {/* Patwari Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 animate-float [animation-delay:200ms]">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
                                    <FileText className="text-white" size={28} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">Patwari</h3>
                                <p className="text-sm text-gray-500 mt-1">Complete Course</p>
                                <div className="mt-3 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="text-xs text-green-600">Ongoing</span>
                                </div>
                            </div>

                            {/* SSC/LDC Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 animate-float [animation-delay:400ms]">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 mb-4">
                                    <Award className="text-white" size={28} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">SSC / LDC</h3>
                                <p className="text-sm text-gray-500 mt-1">CGL, CHSL, LDC</p>
                                <div className="mt-3 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                                    <span className="text-xs text-yellow-600">Popular</span>
                                </div>
                            </div>

                            {/* Police Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 animate-float [animation-delay:600ms]">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
                                    <Shield className="text-white" size={28} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">Police</h3>
                                <p className="text-sm text-gray-500 mt-1">Constable & SI</p>
                                <div className="mt-3 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span className="text-xs text-blue-600">Upcoming</span>
                                </div>
                            </div>

                            {/* Center Badge - Logo */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-xl animate-pulse overflow-hidden border-4 border-primary-100">
                                <Image
                                    src="/images/logo.png"
                                    alt="Awasthi Classes"
                                    width={72}
                                    height={72}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}