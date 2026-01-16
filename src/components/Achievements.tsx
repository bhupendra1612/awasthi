"use client";

import { useEffect, useState, useRef } from "react";
import { Trophy, Users, Award, Star, TrendingUp, GraduationCap, Target, Medal, BookOpen, Briefcase } from "lucide-react";

const achievements = [
    {
        icon: Award,
        value: 10,
        suffix: "+",
        label: "Years Experience",
        description: "Dedicated to government exam preparation",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: Trophy,
        value: 1000,
        suffix: "+",
        label: "Selections",
        description: "In various government exams",
        gradient: "from-yellow-500 to-orange-500",
    },
    {
        icon: Users,
        value: 10000,
        suffix: "+",
        label: "Students Trained",
        description: "Successfully guided towards success",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: TrendingUp,
        value: 95,
        suffix: "%",
        label: "Success Rate",
        description: "Students clear prelims",
        gradient: "from-green-500 to-emerald-500",
    },
];

const highlights = [
    { icon: Briefcase, text: "SSC, Railway, Bank Exams" },
    { icon: GraduationCap, text: "RPSC, RSMSSB Specialist" },
    { icon: Target, text: "Complete Syllabus Coverage" },
    { icon: BookOpen, text: "Updated Study Material" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
        <div ref={ref} className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {count.toLocaleString()}{suffix}
        </div>
    );
}

export default function Achievements() {
    return (
        <section id="achievements" className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600 rounded-full blur-3xl opacity-10 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600 rounded-full blur-3xl opacity-5" />
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm text-yellow-400 px-5 py-2.5 rounded-full text-sm font-semibold mb-4 border border-yellow-500/30">
                        <Trophy size={18} className="animate-bounce" />
                        Our Track Record
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        Proven{" "}
                        <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                            Excellence
                        </span>{" "}
                        in Results
                    </h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        A decade of transforming aspirants into government officers. Our numbers reflect our commitment to your success.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
                    {achievements.map((item, index) => (
                        <div
                            key={index}
                            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/10"
                        >
                            {/* Glow effect on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-15 rounded-3xl transition-opacity duration-500`} />

                            <div className="relative z-10 text-center">
                                {/* Floating Icon */}
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500 animate-float`}>
                                    <item.icon className="text-white" size={32} />
                                    {/* Icon glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl blur-xl opacity-50 -z-10`} />
                                </div>

                                {/* Animated Counter */}
                                <div className="mb-3">
                                    <AnimatedCounter value={item.value} suffix={item.suffix} />
                                </div>

                                {/* Label */}
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{item.label}</h3>
                                <p className="text-sm text-gray-400">{item.description}</p>
                            </div>

                            {/* Corner accent */}
                            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.gradient} opacity-10 rounded-bl-full`} />
                        </div>
                    ))}
                </div>

                {/* Highlights Bar */}
                <div className="relative bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 rounded-3xl p-1 shadow-2xl shadow-primary-500/20">
                    <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 rounded-3xl p-6 sm:p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {highlights.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row items-center justify-center gap-3 text-white py-2 group"
                                >
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                        <item.icon size={24} />
                                    </div>
                                    <span className="font-semibold text-sm sm:text-base text-center sm:text-left">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-sm mb-3">
                        Trusted by aspirants across Rajasthan for government exam preparation
                    </p>
                    <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="text-yellow-400 fill-yellow-400 animate-pulse" size={22} style={{ animationDelay: `${i * 100}ms` }} />
                        ))}
                        <span className="text-white font-bold text-lg ml-2">4.9/5</span>
                        <span className="text-gray-400 ml-1">(500+ reviews)</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
