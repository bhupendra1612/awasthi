import Link from "next/link";
import { Phone, MapPin, MessageCircle, Sparkles, ArrowRight, Clock, Users, Award, Zap } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-blue-600 to-purple-700" />

            {/* Animated background patterns */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                {/* Floating shapes */}
                <div className="absolute top-10 left-[10%] w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
                <div className="absolute bottom-10 right-[10%] w-32 h-32 bg-white/10 rounded-full blur-xl animate-float [animation-delay:1s]" />
                <div className="absolute top-1/2 left-[5%] w-16 h-16 bg-white/10 rounded-full blur-xl animate-float [animation-delay:0.5s]" />
                <div className="absolute top-20 right-[20%] w-24 h-24 bg-white/10 rounded-full blur-xl animate-float [animation-delay:1.5s]" />

                {/* Icons */}
                <div className="absolute top-16 left-[15%] text-4xl text-white/10 animate-float select-none">📚</div>
                <div className="absolute bottom-20 right-[15%] text-5xl text-white/10 animate-float [animation-delay:0.8s] select-none">🎯</div>
                <div className="absolute top-1/3 right-[8%] text-3xl text-white/10 animate-float [animation-delay:1.2s] select-none">🏆</div>
                <div className="absolute bottom-1/3 left-[8%] text-4xl text-white/10 animate-float [animation-delay:0.3s] select-none">✨</div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main CTA Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce-slow">
                                <Sparkles size={16} />
                                Limited Seats Available!
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                Ready to{" "}
                                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                    Crack
                                </span>{" "}
                                Government Exams?
                            </h2>

                            <p className="mt-6 text-lg text-white/80 leading-relaxed">
                                Join Awasthi Classes today and take the first step towards your government job.
                                Get personalized attention, expert guidance, and proven results.
                            </p>

                            {/* Quick Stats */}
                            <div className="mt-8 grid grid-cols-3 gap-4">
                                <div className="bg-white/10 rounded-xl p-3 text-center animate-float">
                                    <Users className="mx-auto text-yellow-300 mb-1" size={24} />
                                    <p className="text-white font-bold">1000+</p>
                                    <p className="text-white/60 text-xs">Students</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 text-center animate-float [animation-delay:200ms]">
                                    <Award className="mx-auto text-green-300 mb-1" size={24} />
                                    <p className="text-white font-bold">90%+</p>
                                    <p className="text-white/60 text-xs">Success</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 text-center animate-float [animation-delay:400ms]">
                                    <Clock className="mx-auto text-blue-300 mb-1" size={24} />
                                    <p className="text-white font-bold">5+</p>
                                    <p className="text-white/60 text-xs">Years</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Action Buttons */}
                        <div className="space-y-4">
                            {/* Enroll Button */}
                            <Link
                                href="/signup"
                                className="group flex items-center justify-between w-full bg-white text-primary-600 px-8 py-5 rounded-2xl hover:bg-yellow-50 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transform"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center">
                                        <Zap className="text-white" size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-primary-600">Enroll Now</p>
                                        <p className="text-sm text-gray-500 font-normal">Start your journey today</p>
                                    </div>
                                </div>
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                            </Link>

                            {/* WhatsApp Button */}
                            <a
                                href="https://wa.me/917891136255?text=Hi%2C%20I%20want%20to%20know%20more%20about%20Awasthi%20Classes%20coaching"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-5 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transform"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <MessageCircle className="text-white" size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p>Chat on WhatsApp</p>
                                        <p className="text-sm text-green-100 font-normal">Quick response guaranteed</p>
                                    </div>
                                </div>
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                            </a>

                            {/* Call Button */}
                            <a
                                href="tel:+917891136255"
                                className="group flex items-center justify-between w-full bg-white/10 border-2 border-white/30 text-white px-8 py-5 rounded-2xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg hover:scale-[1.02] transform"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Phone className="text-white" size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p>Call Us Now</p>
                                        <p className="text-sm text-white/60 font-normal">+91 78911 36255</p>
                                    </div>
                                </div>
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Location Badge */}
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/20 animate-float">
                        <MapPin size={20} className="text-yellow-300" />
                        <span>VIP Colony, Amrit Puri, Hindaun, Rajasthan</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-300 text-sm">Open Now</span>
                    </div>
                </div>
            </div>
        </section>
    );
}