"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Clock, FileText, Trophy, Star, ArrowRight } from "lucide-react";

interface Test {
    id: string;
    title: string;
    category: string;
    subject: string;
    duration_minutes: number;
    total_questions: number;
    total_marks: number;
    is_free: boolean;
    price: number;
    is_featured: boolean;
    thumbnail_url: string;
}

export default function TestSeries() {
    const supabase = createClient();
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, []);

    async function fetchTests() {
        try {
            const { data } = await supabase
                .from("tests")
                .select("*")
                .eq("is_published", true)
                .eq("show_on_homepage", true)
                .order("is_featured", { ascending: false })
                .limit(6);

            setTests(data || []);
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading || tests.length === 0) {
        return null;
    }

    return (
        <section id="tests" className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                        📝 Practice Tests
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Test Series for{" "}
                        <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                            Government Exams
                        </span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Practice with our mock tests designed by experts. Get detailed analysis and improve your performance.
                    </p>
                </div>

                {/* Tests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {tests.map((test) => (
                        <Link
                            key={test.id}
                            href={`/tests/${test.id}`}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                        >
                            {/* Thumbnail */}
                            <div className="relative h-36 bg-gradient-to-br from-primary-500 to-blue-600">
                                {test.thumbnail_url ? (
                                    <Image
                                        src={test.thumbnail_url}
                                        alt={test.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="text-white/30" size={48} />
                                    </div>
                                )}
                                {test.is_featured && (
                                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                        <Star size={12} />
                                        Featured
                                    </div>
                                )}
                                {test.is_free && (
                                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                        FREE
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                                        {test.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{test.subject}</span>
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition">
                                    {test.title}
                                </h3>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <FileText size={14} />
                                            {test.total_questions} Q
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {test.duration_minutes} min
                                        </span>
                                    </div>
                                    {!test.is_free && (
                                        <span className="font-bold text-gray-900">₹{test.price}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link
                        href="/tests"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition-all font-medium"
                    >
                        View All Tests
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}