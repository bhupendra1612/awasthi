"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, ChevronDown, BookOpen, Users, Star, GraduationCap, Award, FileText, Shield, Train, ClipboardList } from "lucide-react";

const navLinks = [
    {
        name: "Courses",
        href: "#courses",
        icon: BookOpen,
        hasDropdown: true,
        dropdownItems: [
            { name: "REET", href: "#courses", icon: GraduationCap },
            { name: "Patwari", href: "#courses", icon: FileText },
            { name: "SSC / LDC", href: "#courses", icon: Award },
            { name: "Rajasthan Police", href: "#courses", icon: Shield },
            { name: "Railway", href: "#courses", icon: Train },
        ]
    },
    { name: "Test Series", href: "/tests", icon: ClipboardList },
    { name: "Why Us", href: "#features", icon: Star },
    { name: "Teachers", href: "#teachers", icon: GraduationCap },
    { name: "Reviews", href: "#testimonials", icon: Users },
    { name: "Contact", href: "#contact", icon: Phone },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            {/* Mobile Menu Backdrop */}
            {isMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Main Header */}
            <header className={`relative z-50 transition-all duration-300 ${isScrolled
                ? "bg-white shadow-lg"
                : "bg-white/95 backdrop-blur-md"
                }`}>
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-11 h-11 rounded-xl overflow-hidden group-hover:scale-110 transition-transform shadow-lg">
                                <Image
                                    src="/images/logo.png"
                                    alt="Awasthi Classes Logo"
                                    width={44}
                                    height={44}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Show name on mobile, full branding on desktop */}
                            <span className="sm:hidden text-lg font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                                Awasthi Classes
                            </span>
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                                    Awasthi Classes
                                </span>
                                <p className="text-xs text-gray-500 -mt-0.5">Government Exam Preparation</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <div
                                    key={link.name}
                                    className="relative"
                                    onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all font-medium"
                                    >
                                        {link.name}
                                        {link.hasDropdown && <ChevronDown size={16} className={`transition-transform ${activeDropdown === link.name ? "rotate-180" : ""}`} />}
                                    </Link>

                                    {/* Dropdown */}
                                    {link.hasDropdown && activeDropdown === link.name && (
                                        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px] animate-fadeIn">
                                            {link.dropdownItems?.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition"
                                                >
                                                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                                        <item.icon size={16} className="text-primary-600" />
                                                    </div>
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-5 py-2 text-gray-600 hover:text-primary-600 font-medium transition"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary-600/30 hover:scale-105 transition-all font-medium"
                            >
                                Sign Up Free
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Navigation */}
                <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                    <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition"
                            >
                                <link.icon size={20} className="text-primary-500" />
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-center px-4 py-3 text-gray-600 hover:text-primary-600 font-medium rounded-xl border border-gray-200 hover:border-primary-600 transition"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-center bg-gradient-to-r from-primary-600 to-blue-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition font-medium"
                            >
                                Sign Up Free
                            </Link>
                        </div>

                        {/* Mobile Contact */}
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <a
                                href="tel:+917891136255"
                                className="flex items-center justify-center gap-2 text-primary-600 font-medium"
                            >
                                <Phone size={18} />
                                +91 78911 36255
                            </a>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}