"use client";

import { useState } from "react";
import { Send, Phone, Mail, MapPin, Clock, CheckCircle, Loader2, Target, Sparkles, GraduationCap, MessageSquare } from "lucide-react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        exam: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const whatsappMessage = `Hi, I'm ${formData.name}.\n\nExam: ${formData.exam}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nQuery: ${formData.message}`;
        window.open(`https://wa.me/917891136255?text=${encodeURIComponent(whatsappMessage)}`, "_blank");

        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
            setSuccess(false);
            setFormData({ name: "", phone: "", email: "", exam: "", message: "" });
        }, 3000);
    };

    return (
        <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-10" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-4">
                        <Target size={18} />
                        Free Counseling
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        Ready to Crack Your{" "}
                        <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Dream Exam?
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Get free counseling from our experts. We&apos;ll help you choose the right course and create a personalized study plan.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Side - Contact Form */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center">
                                <MessageSquare className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Get Free Counseling</h3>
                                <p className="text-sm text-gray-500">Fill the form & our expert will call you</p>
                            </div>
                        </div>

                        {success ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-green-600" size={40} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h4>
                                <p className="text-gray-600">Our counselor will contact you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter your name"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Enter phone number"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Enter email (optional)"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam *</label>
                                        <select
                                            value={formData.exam}
                                            onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                            required
                                        >
                                            <option value="">Choose your exam</option>
                                            <option value="SSC CGL">SSC CGL</option>
                                            <option value="SSC CHSL">SSC CHSL</option>
                                            <option value="SSC MTS">SSC MTS</option>
                                            <option value="Railway NTPC">Railway NTPC</option>
                                            <option value="Railway Group D">Railway Group D</option>
                                            <option value="Bank PO">Bank PO</option>
                                            <option value="Bank Clerk">Bank Clerk</option>
                                            <option value="RPSC RAS">RPSC RAS</option>
                                            <option value="RSMSSB Patwari">RSMSSB Patwari</option>
                                            <option value="Rajasthan Police">Rajasthan Police</option>
                                            <option value="Rajasthan LDC">Rajasthan LDC</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Query</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us about your preparation level, goals, or any questions..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none bg-gray-50 focus:bg-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-0.5"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Get Free Counseling
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-sm text-gray-500">
                                    Or call us directly at{" "}
                                    <a href="tel:+917891136255" className="text-primary-600 font-semibold hover:underline">
                                        +91 78911 36255
                                    </a>
                                </p>
                            </form>
                        )}
                    </div>

                    {/* Right Side - Map & Contact Info */}
                    <div className="space-y-6">
                        {/* Map Section */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                            <div className="relative h-[300px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3574.123456789!2d77.0333!3d26.7333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQ0JzAwLjAiTiA3N8KwMDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-500"
                                />
                                {/* Map overlay with address */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Awasthi Classes</h4>
                                            <p className="text-xs text-gray-600">VIP Colony, Amrit Puri, Hindaun, Rajasthan 322230</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <a href="tel:+917891136255" className="group bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all hover:-translate-y-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Phone className="text-white" size={22} />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
                                <p className="text-primary-600 font-medium text-sm">+91 78911 36255</p>
                                <p className="text-xs text-gray-500 mt-1">Mon-Sat, 9 AM - 8 PM</p>
                            </a>

                            <a href="mailto:AWASTHICLASSESHND@GMAIL.COM" className="group bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all hover:-translate-y-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Mail className="text-white" size={22} />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                                <p className="text-primary-600 font-medium text-xs break-all">AWASTHICLASSESHND@GMAIL.COM</p>
                                <p className="text-xs text-gray-500 mt-1">Reply within 24 hrs</p>
                            </a>

                            <div className="group bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-3">
                                    <Clock className="text-white" size={22} />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">Coaching Hours</h4>
                                <p className="text-gray-600 text-sm">Mon - Sat: 9 AM - 8 PM</p>
                                <p className="text-xs text-gray-500 mt-1">Sunday: Closed</p>
                            </div>

                            <a href="https://wa.me/917891136255" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-white mb-1">WhatsApp</h4>
                                <p className="text-white/90 text-sm">Chat with us now</p>
                                <p className="text-xs text-white/70 mt-1">Quick response</p>
                            </a>
                        </div>

                        {/* Why Choose Us Mini Section */}
                        <div className="bg-gradient-to-br from-primary-600 to-blue-600 rounded-3xl p-6 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="text-yellow-400" size={24} />
                                <h4 className="font-bold text-lg">Why Get Counseling?</h4>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                                    <span className="text-sm">Personalized study plan based on your level</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                                    <span className="text-sm">Expert guidance on exam selection</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                                    <span className="text-sm">Free demo class before enrollment</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <GraduationCap size={18} className="text-yellow-400 flex-shrink-0" />
                                    <span className="text-sm font-medium">1000+ successful selections!</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
