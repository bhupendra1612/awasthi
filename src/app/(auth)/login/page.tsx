"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, Loader2, Eye, EyeOff, ArrowRight, Sparkles, Users, Award, BookOpen, CheckCircle } from "lucide-react";

type AuthMethod = "password" | "otp";

export default function LoginPage() {
    const router = useRouter();
    const [method, setMethod] = useState<AuthMethod>("password");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const supabase = createClient();

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false,
                },
            });

            if (error) {
                setError(error.message);
            } else {
                setOtpSent(true);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: "email",
            });

            if (error) {
                setError(error.message);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-blue-600 to-purple-700 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full" />

                    {/* Math symbols */}
                    <div className="absolute top-20 right-20 text-6xl text-white/10 animate-float">π</div>
                    <div className="absolute bottom-32 left-20 text-5xl text-white/10 animate-float [animation-delay:1s]">∑</div>
                    <div className="absolute top-1/3 left-10 text-4xl text-white/10 animate-float [animation-delay:0.5s]">∫</div>
                </div>

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-14 h-14 relative">
                            <Image
                                src="/images/logo.png"
                                alt="Bard of Maths Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-white">Bard of Maths</span>
                            <p className="text-sm text-white/70">Excellence in Education</p>
                        </div>
                    </Link>

                    {/* Welcome Text */}
                    <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                        Welcome back to your
                        <span className="block text-yellow-300">learning journey!</span>
                    </h1>
                    <p className="text-lg text-white/80 mb-10 max-w-md">
                        Continue where you left off. Access your courses, track progress, and achieve your academic goals.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">
                        {[
                            { icon: BookOpen, text: "Access all your enrolled courses" },
                            { icon: CheckCircle, text: "Track your learning progress" },
                            { icon: Award, text: "Earn certificates on completion" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/90">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <item.icon size={20} />
                                </div>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
                        <div>
                            <p className="text-3xl font-bold text-white">5000+</p>
                            <p className="text-white/70 text-sm">Active Students</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">95%</p>
                            <p className="text-white/70 text-sm">Success Rate</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">50+</p>
                            <p className="text-white/70 text-sm">Courses</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 relative">
                                <Image
                                    src="/images/logo.png"
                                    alt="Bard of Maths Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                                Bard of Maths
                            </span>
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Sparkles size={16} />
                                Welcome Back
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Sign in to your account
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Continue your learning journey
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                {error}
                            </div>
                        )}

                        {/* Auth Method Tabs */}
                        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => {
                                    setMethod("password");
                                    setOtpSent(false);
                                    setError("");
                                }}
                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${method === "password"
                                    ? "bg-white text-primary-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <Lock size={18} />
                                Password
                            </button>
                            <button
                                onClick={() => {
                                    setMethod("otp");
                                    setError("");
                                }}
                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${method === "otp"
                                    ? "bg-white text-primary-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <Mail size={18} />
                                Email OTP
                            </button>
                        </div>

                        {method === "password" ? (
                            <form onSubmit={handlePasswordLogin}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !email || !password}
                                    className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3.5 px-4 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : !otpSent ? (
                            <form onSubmit={handleSendOtp}>
                                <div className="mb-6">
                                    <label htmlFor="otp-email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            id="otp-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                        <Mail size={12} />
                                        We&apos;ll send a verification code to your email
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3.5 px-4 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Send Code
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp}>
                                <div className="mb-6">
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter Verification Code
                                    </label>
                                    <input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        placeholder="12345678"
                                        maxLength={8}
                                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-center text-2xl tracking-[0.5em] font-mono bg-gray-50 focus:bg-white"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        Code sent to <span className="font-medium text-gray-700">{email}</span>
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3.5 px-4 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Verify & Sign In
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpSent(false);
                                        setOtp("");
                                    }}
                                    className="w-full mt-3 text-gray-600 hover:text-primary-600 transition text-sm py-2"
                                >
                                    ← Use different email
                                </button>
                            </form>
                        )}

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">New to Bard of Maths?</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <Link
                            href="/signup"
                            className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:border-primary-600 hover:text-primary-600 transition font-medium group"
                        >
                            Create an account
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-sm mt-6">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="text-primary-600 hover:underline">Terms</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
