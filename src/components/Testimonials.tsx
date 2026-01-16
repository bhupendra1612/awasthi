"use client";

import { Star, Quote, Sparkles, GraduationCap, Trophy, Briefcase } from "lucide-react";
import { useState, useRef } from "react";

const testimonials = [
    {
        id: 1,
        name: "Rajesh Kumar",
        role: "SSC CGL Selected",
        achievement: "AIR 245",
        content:
            "Awasthi Classes transformed my preparation journey. The faculty's guidance and study material helped me crack SSC CGL in my first attempt with AIR 245!",
        rating: 5,
        gradient: "from-blue-500 to-cyan-500",
        exam: "SSC CGL 2024",
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "Railway NTPC Selected",
        achievement: "Zone Topper",
        content:
            "Best coaching for Railway exams in Hindaun! The daily tests and doubt sessions were game-changers. I became zone topper thanks to Awasthi Classes.",
        rating: 5,
        gradient: "from-purple-500 to-pink-500",
        exam: "RRB NTPC",
    },
    {
        id: 3,
        name: "Amit Verma",
        role: "RSMSSB Patwari",
        achievement: "District Rank 3",
        content:
            "The RSMSSB preparation here is unmatched. Comprehensive coverage of Rajasthan GK and current affairs helped me secure District Rank 3 in Patwari exam.",
        rating: 5,
        gradient: "from-orange-500 to-red-500",
        exam: "Patwari 2024",
    },
    {
        id: 4,
        name: "Sunita Meena",
        role: "Bank PO Selected",
        achievement: "SBI PO",
        content:
            "From zero banking knowledge to SBI PO selection - Awasthi Classes made it possible. The mock tests exactly matched the actual exam pattern.",
        rating: 5,
        gradient: "from-green-500 to-emerald-500",
        exam: "SBI PO 2024",
    },
    {
        id: 5,
        name: "Vikram Singh",
        role: "RPSC RAS Prelims",
        achievement: "Cleared Prelims",
        content:
            "The RAS preparation strategy taught here is excellent. Cleared prelims in first attempt. The current affairs coverage is the best in the region.",
        rating: 5,
        gradient: "from-indigo-500 to-violet-500",
        exam: "RAS 2024",
    },
    {
        id: 6,
        name: "Kavita Joshi",
        role: "SSC CHSL Selected",
        achievement: "First Attempt",
        content:
            "Joined Awasthi Classes after 2 failed attempts elsewhere. Their systematic approach helped me clear SSC CHSL in just 6 months of preparation!",
        rating: 5,
        gradient: "from-yellow-500 to-orange-500",
        exam: "SSC CHSL",
    },
    {
        id: 7,
        name: "Deepak Yadav",
        role: "Rajasthan Police",
        achievement: "Constable Selected",
        content:
            "Physical training tips along with written exam preparation - complete package! Got selected as Rajasthan Police Constable. Thank you Awasthi Sir!",
        rating: 5,
        gradient: "from-cyan-500 to-blue-500",
        exam: "Raj Police 2024",
    },
    {
        id: 8,
        name: "Neha Gupta",
        role: "IBPS Clerk",
        achievement: "Bank Clerk",
        content:
            "The banking batch here is amazing. Speed techniques for Quant and Reasoning helped me crack IBPS Clerk. Highly recommend for bank aspirants!",
        rating: 5,
        gradient: "from-pink-500 to-rose-500",
        exam: "IBPS Clerk",
    },
];

// Duplicate for seamless infinite scroll
const duplicatedTestimonials = [...testimonials, ...testimonials];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
    return (
        <div
            className="flex-shrink-0 w-[350px] md:w-[400px] group"
        >
            <div className="relative bg-white rounded-3xl p-6 shadow-lg border border-gray-100 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-transparent overflow-hidden">
                {/* Hover gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Quote icon */}
                <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-xl flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity`}>
                    <Quote className="text-white" size={24} />
                </div>

                {/* Exam badge */}
                <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${testimonial.gradient} text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4`}>
                    <Briefcase size={12} />
                    {testimonial.exam}
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                    ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
                    &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {testimonial.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <Trophy size={12} className="text-yellow-500" />
                            <span className="text-xs font-medium text-yellow-600">{testimonial.achievement}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
        </div>
    );
}

export default function Testimonials() {
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-[5%] w-72 h-72 bg-gradient-to-br from-primary-200 to-blue-200 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-20 right-[5%] w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full blur-3xl opacity-20" />

                {/* Floating quotes */}
                <Quote className="absolute top-32 left-[8%] text-primary-200 opacity-40 animate-float" size={60} />
                <Quote className="absolute bottom-32 right-[8%] text-purple-200 opacity-40 animate-float rotate-180" style={{ animationDelay: "1s" }} size={48} />
            </div>

            <div className="relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-4">
                        <Sparkles size={16} className="animate-pulse" />
                        Success Stories
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        Our{" "}
                        <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Selected Students
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Join 1000+ successful candidates who cracked government exams with Awasthi Classes
                    </p>
                </div>

                {/* Auto-scrolling testimonials - Row 1 (Left to Right) */}
                <div
                    className="relative mb-6"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        ref={scrollRef}
                        className={`flex gap-6 ${isPaused ? 'animate-none' : 'animate-scroll-left'}`}
                        style={{ width: 'max-content' }}
                    >
                        {duplicatedTestimonials.map((testimonial, index) => (
                            <TestimonialCard key={`row1-${index}`} testimonial={testimonial} index={index} />
                        ))}
                    </div>
                </div>

                {/* Auto-scrolling testimonials - Row 2 (Right to Left) */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        className={`flex gap-6 ${isPaused ? 'animate-none' : 'animate-scroll-right'}`}
                        style={{ width: 'max-content' }}
                    >
                        {[...duplicatedTestimonials].reverse().map((testimonial, index) => (
                            <TestimonialCard key={`row2-${index}`} testimonial={testimonial} index={index} />
                        ))}
                    </div>
                </div>

                {/* Gradient overlays for smooth edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-20" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-20" />

                {/* Trust Badge */}
                <div className="mt-16 text-center px-4">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 text-white px-8 py-6 rounded-3xl shadow-2xl shadow-primary-500/30">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-float">
                            <GraduationCap size={36} />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-3xl font-bold">1000+ Selections</p>
                            <p className="text-primary-100">in SSC, Railway, Bank & State Exams</p>
                        </div>
                        <div className="flex -space-x-3">
                            {["R", "P", "A", "S", "V"].map((letter, i) => (
                                <div
                                    key={i}
                                    className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/30 hover:scale-110 transition-transform"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    {letter}
                                </div>
                            ))}
                            <div className="w-11 h-11 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white/30">
                                +1K
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
