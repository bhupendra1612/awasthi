"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const supabase = createClient();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setEmailSent(true);
        }
        setLoading(false);
    };

    if (emailSent) {
        return (
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="text-green-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                    <p className="text-gray-500 mb-6">
                        We&apos;ve sent a password reset link to<br />
                        <span className="font-medium text-gray-900">{email}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Click the link in the email to reset your password.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-primary-600 hover:underline"
                    >
                        <ArrowLeft size={16} />
                        Back to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Forgot Password?
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    Enter your email and we&apos;ll send you a reset link
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleResetPassword}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-8">
                    <Link href="/login" className="inline-flex items-center gap-2 text-primary-600 hover:underline">
                        <ArrowLeft size={16} />
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
}
