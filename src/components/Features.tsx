import { Video, FileText, ClipboardList, Users, Clock, Award, Smartphone, HeadphonesIcon, Sparkles } from "lucide-react";

const features = [
    {
        icon: Video,
        title: "HD Video Lectures",
        description: "High-quality video lessons by expert faculty, accessible anytime",
        gradient: "from-blue-500 to-cyan-500",
        shadow: "shadow-blue-500/30",
        delay: "0ms",
    },
    {
        icon: FileText,
        title: "PDF Notes",
        description: "Comprehensive study materials and notes for each topic",
        gradient: "from-green-500 to-emerald-500",
        shadow: "shadow-green-500/30",
        delay: "100ms",
    },
    {
        icon: ClipboardList,
        title: "Daily Tests",
        description: "Practice with daily MCQ tests and track your progress",
        gradient: "from-purple-500 to-pink-500",
        shadow: "shadow-purple-500/30",
        delay: "200ms",
    },
    {
        icon: Users,
        title: "Expert Faculty",
        description: "Learn from experienced teachers with proven track record",
        gradient: "from-orange-500 to-red-500",
        shadow: "shadow-orange-500/30",
        delay: "300ms",
    },
    {
        icon: Clock,
        title: "Flexible Learning",
        description: "Study at your own pace, anytime and anywhere",
        gradient: "from-pink-500 to-rose-500",
        shadow: "shadow-pink-500/30",
        delay: "400ms",
    },
    {
        icon: Award,
        title: "Proven Results",
        description: "1000+ selections in various government exams",
        gradient: "from-yellow-500 to-orange-500",
        shadow: "shadow-yellow-500/30",
        delay: "500ms",
    },
    {
        icon: Smartphone,
        title: "Mobile App",
        description: "Learn on the go with our Android & iOS apps",
        gradient: "from-cyan-500 to-blue-500",
        shadow: "shadow-cyan-500/30",
        delay: "600ms",
    },
    {
        icon: HeadphonesIcon,
        title: "Doubt Support",
        description: "Get your doubts cleared by our expert team",
        gradient: "from-red-500 to-pink-500",
        shadow: "shadow-red-500/30",
        delay: "700ms",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100 rounded-full blur-3xl opacity-10" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Sparkles size={16} className="text-yellow-500" />
                        Why Choose Us
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        Everything You Need to{" "}
                        <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Succeed
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        We provide comprehensive preparation with the best resources and support for your government exam journey
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-3xl p-6 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                            style={{ animationDelay: feature.delay }}
                        >
                            {/* Hover gradient background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                            {/* Floating Icon */}
                            <div
                                className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-500 animate-float`}
                                style={{ animationDelay: feature.delay }}
                            >
                                <feature.icon className="text-white" size={30} />

                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10`} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Bottom accent line */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}