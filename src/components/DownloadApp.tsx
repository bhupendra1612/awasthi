"use client";

import {
    Smartphone, Play, CheckCircle, Bell, BookOpen, Video, FileText, Star,
    ClipboardList, Download, Wifi, WifiOff, Clock, Target, TrendingUp,
    Zap, Shield, Award
} from "lucide-react";

const appFeatures = [
    {
        icon: Video,
        title: "HD Video Lectures",
        description: "Watch expert faculty lectures anytime",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: WifiOff,
        title: "Offline Access",
        description: "Download & study without internet",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        icon: ClipboardList,
        title: "Daily Practice Tests",
        description: "MCQs for SSC, Railway, Bank exams",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        icon: FileText,
        title: "PDF Study Notes",
        description: "Complete notes with shortcuts",
        gradient: "from-orange-500 to-red-500"
    },
    {
        icon: Bell,
        title: "Exam Alerts",
        description: "Never miss important notifications",
        gradient: "from-yellow-500 to-orange-500"
    },
    {
        icon: TrendingUp,
        title: "Progress Tracking",
        description: "Analyze your preparation level",
        gradient: "from-cyan-500 to-blue-500"
    },
];

const examCategories = [
    { name: "SSC", color: "bg-blue-500" },
    { name: "Railway", color: "bg-green-500" },
    { name: "Bank", color: "bg-purple-500" },
    { name: "RPSC", color: "bg-orange-500" },
    { name: "RSMSSB", color: "bg-pink-500" },
];

export default function DownloadApp() {
    const playStoreLink = "#";
    const appStoreLink = "#";

    return (
        <section id="download" className="py-24 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500 rounded-full blur-3xl opacity-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-3xl opacity-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-5" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                {/* Floating shapes */}
                <div className="absolute top-20 left-[10%] w-20 h-20 border-2 border-white/10 rounded-2xl rotate-12 animate-float" />
                <div className="absolute bottom-20 right-[15%] w-16 h-16 border-2 border-white/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/3 right-[8%] w-12 h-12 bg-white/5 rounded-xl rotate-45 animate-float" style={{ animationDelay: "2s" }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/20 to-blue-500/20 backdrop-blur-sm text-primary-300 px-5 py-2.5 rounded-full text-sm font-semibold mb-4 border border-primary-500/30">
                        <Smartphone size={18} />
                        Mobile App
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        Prepare Anywhere with{" "}
                        <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                            Awasthi Classes App
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Your complete government exam preparation companion. Study on the go with video lectures, tests, and notes.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content - Phone Mockup */}
                    <div className="flex justify-center order-2 lg:order-1">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-blue-500 rounded-[3rem] blur-3xl opacity-30 scale-90" />

                            {/* Phone frame */}
                            <div className="relative w-72 sm:w-80 h-[550px] sm:h-[600px] bg-gray-800 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-700">
                                {/* Screen */}
                                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] overflow-hidden relative">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-800 rounded-b-2xl z-10" />

                                    {/* App content mockup */}
                                    <div className="pt-12 px-4 h-full overflow-hidden">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <p className="text-gray-400 text-xs">Welcome to</p>
                                                <p className="text-white font-bold text-lg">Awasthi Classes</p>
                                            </div>
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">A</span>
                                            </div>
                                        </div>

                                        {/* Exam Categories */}
                                        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
                                            {examCategories.map((exam, i) => (
                                                <div key={i} className={`${exam.color} px-3 py-1.5 rounded-full text-white text-xs font-medium whitespace-nowrap`}>
                                                    {exam.name}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Progress Card */}
                                        <div className="bg-gradient-to-br from-primary-600 to-blue-600 rounded-2xl p-4 mb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-white/80 text-xs">Today&apos;s Progress</p>
                                                <Target size={16} className="text-yellow-400" />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-white text-xs">Daily Goal</span>
                                                        <span className="text-yellow-400 text-xs font-bold">75%</span>
                                                    </div>
                                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                                        <div className="h-full w-3/4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-white">45</p>
                                                    <p className="text-white/60 text-xs">MCQs Done</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <p className="text-white font-semibold text-sm mb-3">Quick Actions</p>
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                                                <div className="w-10 h-10 mx-auto bg-blue-500/20 rounded-xl flex items-center justify-center mb-2">
                                                    <Video className="text-blue-400" size={18} />
                                                </div>
                                                <p className="text-white text-xs">Videos</p>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                                                <div className="w-10 h-10 mx-auto bg-green-500/20 rounded-xl flex items-center justify-center mb-2">
                                                    <ClipboardList className="text-green-400" size={18} />
                                                </div>
                                                <p className="text-white text-xs">Tests</p>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                                                <div className="w-10 h-10 mx-auto bg-purple-500/20 rounded-xl flex items-center justify-center mb-2">
                                                    <FileText className="text-purple-400" size={18} />
                                                </div>
                                                <p className="text-white text-xs">Notes</p>
                                            </div>
                                        </div>

                                        {/* Continue Learning */}
                                        <p className="text-white font-semibold text-sm mb-3">Continue Learning</p>
                                        <div className="space-y-2">
                                            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                                    <Play className="text-white" size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white text-sm font-medium">SSC CGL Maths</p>
                                                    <p className="text-gray-400 text-xs">Profit & Loss Tricks</p>
                                                </div>
                                                <div className="text-xs text-primary-400">45%</div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                                    <BookOpen className="text-white" size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white text-sm font-medium">Rajasthan GK</p>
                                                    <p className="text-gray-400 text-xs">History & Culture</p>
                                                </div>
                                                <div className="text-xs text-primary-400">30%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badges */}
                            <div className="absolute -top-4 -left-8 bg-white rounded-2xl shadow-2xl p-3 animate-float">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                        <WifiOff className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-gray-800 block">Offline Mode</span>
                                        <span className="text-xs text-gray-500">Study anywhere</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -right-8 bg-white rounded-2xl shadow-2xl p-3 animate-float" style={{ animationDelay: "1s" }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                        <Zap className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-gray-800 block">10K+ MCQs</span>
                                        <span className="text-xs text-gray-500">Practice daily</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-1/3 -right-12 bg-white rounded-2xl shadow-2xl p-3 animate-float" style={{ animationDelay: "0.5s" }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                        <Bell className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-gray-800 block">Exam Alerts</span>
                                        <span className="text-xs text-gray-500">Stay updated</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="text-center lg:text-left order-1 lg:order-2">
                        {/* App Features Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {appFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="text-white" size={22} />
                                    </div>
                                    <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                                    <p className="text-gray-400 text-xs">{feature.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Download Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                            {/* Google Play Store */}
                            <a
                                href={playStoreLink}
                                className="group flex items-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-xl shadow-lg"
                            >
                                <svg viewBox="0 0 24 24" className="w-9 h-9" fill="currentColor">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                                </svg>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 font-medium">GET IT ON</p>
                                    <p className="text-xl font-bold -mt-1">Google Play</p>
                                </div>
                            </a>

                            {/* Apple App Store */}
                            <a
                                href={appStoreLink}
                                className="group flex items-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-xl shadow-lg"
                            >
                                <svg viewBox="0 0 24 24" className="w-9 h-9" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 font-medium">Download on the</p>
                                    <p className="text-xl font-bold -mt-1">App Store</p>
                                </div>
                            </a>
                        </div>

                        {/* Stats & Rating */}
                        <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                                    ))}
                                </div>
                                <span className="text-white font-bold">4.8</span>
                            </div>
                            <div className="h-6 w-px bg-white/20" />
                            <div className="flex items-center gap-2">
                                <Download className="text-primary-400" size={18} />
                                <span className="text-gray-300">10K+ Downloads</span>
                            </div>
                            <div className="h-6 w-px bg-white/20 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <Shield className="text-green-400" size={18} />
                                <span className="text-gray-300">Safe & Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
