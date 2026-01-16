import Link from "next/link";
import {
    Facebook,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    FileText,
    Shield,
    Train,
    Award,
    MessageCircle,
    Heart,
    ArrowUpRight
} from "lucide-react";

const exams = [
    { name: "REET", icon: GraduationCap, gradient: "from-blue-500 to-cyan-500" },
    { name: "Patwari", icon: FileText, gradient: "from-purple-500 to-pink-500" },
    { name: "SSC / LDC", icon: Award, gradient: "from-green-500 to-emerald-500" },
    { name: "Rajasthan Police", icon: Shield, gradient: "from-orange-500 to-red-500" },
    { name: "Railway", icon: Train, gradient: "from-indigo-500 to-violet-500" },
];

const socialLinks = [
    {
        name: "Facebook",
        icon: Facebook,
        href: "https://facebook.com/awasthiclasses",
        color: "hover:bg-blue-600",
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-400"
    },
    {
        name: "Instagram",
        icon: Instagram,
        href: "https://instagram.com/awasthiclasses",
        color: "hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500",
        bgColor: "bg-pink-500/10",
        textColor: "text-pink-400"
    },
    {
        name: "YouTube",
        icon: Youtube,
        href: "https://youtube.com/@awasthiclasses",
        color: "hover:bg-red-600",
        bgColor: "bg-red-500/10",
        textColor: "text-red-400"
    },
    {
        name: "WhatsApp",
        icon: MessageCircle,
        href: "https://wa.me/917891136255",
        color: "hover:bg-green-600",
        bgColor: "bg-green-500/10",
        textColor: "text-green-400"
    },
];

export default function Footer() {
    return (
        <footer id="contact" className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Top Section - Logo & Social */}
                <div className="flex flex-col md:flex-row justify-between items-center pb-12 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-6 md:mb-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-white">A</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-white">Awasthi Classes</span>
                            <p className="text-sm text-gray-500">Government Exam Preparation</p>
                        </div>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 mr-2 hidden sm:block">Follow us:</span>
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group w-12 h-12 ${social.bgColor} rounded-xl flex items-center justify-center transition-all duration-300 ${social.color} hover:text-white hover:scale-110 hover:shadow-lg`}
                                aria-label={social.name}
                            >
                                <social.icon size={22} className={`${social.textColor} group-hover:text-white transition-colors`} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
                    {/* About */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full" />
                            About Us
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Hindaun&apos;s most trusted coaching center for Government Exam Preparation.
                            Specializing in REET, Patwari, SSC, LDC, Police & Railway exams with expert guidance.
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-400">New Batch Starting Soon</span>
                        </div>
                    </div>

                    {/* Courses */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                            Courses
                        </h3>
                        <ul className="space-y-3">
                            {["REET Level 1 & 2", "Patwari Complete", "SSC CGL/CHSL", "Rajasthan LDC", "Police Constable", "Railway Group D"].map((course, i) => (
                                <li key={i}>
                                    <Link
                                        href="#courses"
                                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <ArrowUpRight size={14} className="text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        {course}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Exams with Icons */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                            Exams We Cover
                        </h3>
                        <ul className="space-y-3">
                            {exams.map((exam, i) => (
                                <li key={i}>
                                    <Link
                                        href="#courses"
                                        className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <div className={`w-8 h-8 bg-gradient-to-br ${exam.gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                            <exam.icon size={16} className="text-white" />
                                        </div>
                                        {exam.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                            Contact Us
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="https://maps.google.com/?q=VIP+Colony+Amrit+Puri+Hindaun+Rajasthan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                                        <MapPin size={18} className="text-primary-400" />
                                    </div>
                                    <span className="pt-2">VIP Colony, Amrit Puri,<br />Hindaun, Rajasthan 322230</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+917891136255"
                                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                                        <Phone size={18} className="text-green-400" />
                                    </div>
                                    <span>+91 78911 36255</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:AWASTHICLASSESHND@GMAIL.COM"
                                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                        <Mail size={18} className="text-blue-400" />
                                    </div>
                                    <span className="text-sm">AWASTHICLASSESHND@GMAIL.COM</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 pt-8 mt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                            &copy; {new Date().getFullYear()} Awasthi Classes. Made with
                            <Heart size={14} className="text-red-500 fill-red-500 mx-1" />
                            in Hindaun
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/refund" className="text-gray-500 hover:text-white transition-colors">
                                Refund Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}