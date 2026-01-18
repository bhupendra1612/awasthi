"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, Loader2, Eye, EyeOff, CheckCircle, User, ArrowRight, Sparkles, BookOpen, Award, Users, GraduationCap, FileText, Shield, Train } from "lucide-react";

type AuthMethod = "password" | "otp";
type SignupStep = "form" | "verify";

export default function SignupPage() {
    const router = useRouter();
    const [method, setMethod] = useState<AuthMethod>("password");
    const [step, setStep] = useState<SignupStep>("form");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const supabase = createClient();

    // Function to create user profile
    const createUserProfile = async (userId: string, fullName: string, userEmail: string) => {
        try {
            // First check if profile already exists (database trigger might have created it)
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();

            if (existingProfile) {
                // Profile already exists, no need to create
                return;
            }

            // Create profile if it doesn't exist
            const { error } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    full_name: fullName,
                    email: userEmail,
                    role: 'student', // Default role
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (error && !error.message.includes('duplicate key')) {
                console.error('Error creating profile:', error);
            }
        } catch (error) {
            // Ignore duplicate key errors as they're expected
            if (error && typeof error === 'object' && 'message' in error) {
                const errorMessage = (error as any).message;
                if (!errorMessage.includes('duplicate key') && !errorMessage.includes('already exists')) {
                    console.error('Error creating profile:', error);
                }
            }
        }
    };

    const handlePasswordSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            // If user is created and confirmed immediately, create profile
            if (data.user && data.user.email_confirmed_at) {
                await createUserProfile(data.user.id, name, email);
            }

            const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false,
                },
            });

            if (otpError) {
                console.log("OTP send info:", otpError.message);
            }

            setStep("verify");
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
            // First create the user account
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password: Math.random().toString(36).slice(-12) + "A1!", // Temporary password
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (signUpError && !signUpError.message.includes("already registered")) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            // If user is created and confirmed immediately, create profile
            if (data?.user && data.user.email_confirmed_at) {
                await createUserProfile(data.user.id, name, email);
            }

            // Then send OTP for verification
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false,
                },
            });

            if (error) {
                setError(error.message);
            } else {
                setStep("verify");
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
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: "email",
            });

            if (error) {
                setError(error.message);
            } else {
                // Create profile after successful verification
                if (data.user) {
                    await createUserProfile(data.user.id, name, email);
                }
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
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
                setError("");
                alert("New code sent to your email!");
            }
        } catch {
            setError("Failed to resend code.");
        } finally {
            setLoading(false);
        }
    };

    // OTP Verification Screen
    if (step === "verify") {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary-50 via-white to-blue-50">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30" />
                </div>

                <div className="w-full max-w-md relative z-10">
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                                <Mail className="text-white" size={36} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
                            <p className="text-gray-500 mt-2">
                                We&apos;ve sent a verification code to
                            </p>
                            <p className="font-medium text-primary-600 mt-1">{email}</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleVerifyOtp}>
                            <div className="mb-6">
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter 8-digit Code
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
                                    autoFocus
                                />
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
                                        Verify & Continue
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center space-y-3">
                            <button
                                onClick={handleResendOtp}
                                disabled={loading}
                                className="text-primary-600 hover:underline text-sm disabled:opacity-50"
                            >
                                Didn&apos;t receive code? Resend
                            </button>
                            <br />
                            <button
                                onClick={() => {
                                    setStep("form");
                                    setOtp("");
                                    setError("");
                                }}
                                className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                                ← Back to signup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full" />

                    {/* Floating icons */}
                    <div className="absolute top-20 right-20 text-6xl text-white/10 animate-float">🎯</div>
                    <div className="absolute bottom-32 left-20 text-5xl text-white/10 animate-float [animation-delay:1s]">📚</div>
                    <div className="absolute top-1/3 left-10 text-4xl text-white/10 animate-float [animation-delay:0.5s]">🏆</div>
                </div>

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-white">
                            <Image
                                src="/images/logo.png"
                                alt="Awasthi Classes Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-white">Awasthi Classes</span>
                            <p className="text-sm text-white/70">Government Exam Preparation</p>
                        </div>
                    </Link>

                    {/* Welcome Text */}
                    <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                        Start your journey to
                        <span className="block text-yellow-300">government job success!</span>
                    </h1>
                    <p className="text-lg text-white/80 mb-10 max-w-md">
                        Join thousands of students preparing for SSC, Railway, Bank, RPSC, RSMSSB, Police & other government exams.
                    </p>

                    {/* Exam Categories */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {["SSC", "Railway", "Bank", "RPSC", "RSMSSB", "Police"].map((exam) => (
                            <span key={exam} className="bg-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                {exam}
                            </span>
                        ))}
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4">
                        {[
                            { icon: BookOpen, text: "HD Video Lectures by Expert Faculty" },
                            { icon: FileText, text: "Complete PDF Notes & Study Material" },
                            { icon: GraduationCap, text: "Daily Practice Tests & Mock Exams" },
                            { icon: Users, text: "Join 1000+ Successful Students" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/90">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <item.icon size={20} />
                                </div>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <p className="text-white/90 italic mb-4">
                            &ldquo;Awasthi Classes helped me crack SSC CGL in my first attempt. The faculty and study material are excellent!&rdquo;
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold">
                                R
                            </div>
                            <div>
                                <p className="text-white font-medium">Rajesh Kumar</p>
                                <p className="text-white/60 text-sm">SSC CGL Selected - AIR 245</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 relative rounded-xl overflow-hidden">
                                <Image
                                    src="/images/logo.png"
                                    alt="Awasthi Classes Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                                Awasthi Classes
                            </span>
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Sparkles size={16} />
                                Free to Join
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Create Your Account
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Start your exam preparation today
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
                            <form onSubmit={handlePasswordSignup}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>
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
                                <div className="mb-4">
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
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !email || !password || !name}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 px-4 rounded-xl hover:shadow-lg hover:shadow-green-600/30 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSendOtp}>
                                <div className="mb-4">
                                    <label htmlFor="otp-name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            id="otp-name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>
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
                                    disabled={loading || !email || !name}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 px-4 rounded-xl hover:shadow-lg hover:shadow-green-600/30 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Send Verification Code
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {/* Benefits */}
                                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                                    <p className="text-sm font-medium text-green-800 mb-3">What you&apos;ll get:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["Video Lectures", "Daily Tests", "PDF Notes", "Doubt Support"].map((item) => (
                                            <div key={item} className="flex items-center gap-2 text-sm text-green-700">
                                                <CheckCircle size={14} />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <Link
                            href="/login"
                            className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:border-primary-600 hover:text-primary-600 transition font-medium group"
                        >
                            Sign in instead
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-sm mt-6">
                        By signing up, you agree to our{" "}
                        <Link href="/terms" className="text-primary-600 hover:underline">Terms</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
