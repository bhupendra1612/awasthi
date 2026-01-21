import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                By accessing and using Awasthi Classes website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Services Provided</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Awasthi Classes provides coaching and educational services for government competitive examinations including:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>REET (Rajasthan Eligibility Examination for Teachers) Level 1 & 2</li>
                                <li>Patwari Examination</li>
                                <li>SSC (Staff Selection Commission) CGL/CHSL</li>
                                <li>Rajasthan LDC (Lower Division Clerk)</li>
                                <li>Rajasthan Police Constable</li>
                                <li>Railway Group D and other railway examinations</li>
                                <li>Online courses, test series, and study materials</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Registration and Account</h2>
                            <div className="text-gray-700 leading-relaxed space-y-3">
                                <p>To access certain features, you must register for an account. You agree to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide accurate, current, and complete information</li>
                                    <li>Maintain and update your information to keep it accurate</li>
                                    <li>Maintain the security of your password and account</li>
                                    <li>Accept responsibility for all activities under your account</li>
                                    <li>Notify us immediately of any unauthorized use of your account</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Course Enrollment and Fees</h2>
                            <div className="text-gray-700 leading-relaxed space-y-3">
                                <p><strong>4.1 Payment:</strong> All course fees must be paid in full before accessing course materials unless otherwise specified.</p>
                                <p><strong>4.2 Pricing:</strong> We reserve the right to change course prices at any time. Price changes will not affect already enrolled students.</p>
                                <p><strong>4.3 Validity:</strong> Course access is valid for the duration specified at the time of purchase.</p>
                                <p><strong>4.4 Non-Transferable:</strong> Course enrollments are non-transferable to other individuals.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Policy</h2>
                            <div className="text-gray-700 leading-relaxed space-y-3">
                                <p><strong>5.1 Refund Eligibility:</strong> Refund requests must be made within 7 days of purchase.</p>
                                <p><strong>5.2 Conditions:</strong> Refunds are only available if:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Less than 20% of the course content has been accessed</li>
                                    <li>No certificates have been issued</li>
                                    <li>No test series have been attempted</li>
                                </ul>
                                <p><strong>5.3 Processing:</strong> Approved refunds will be processed within 7-10 business days.</p>
                                <p><strong>5.4 Non-Refundable:</strong> Test series, study materials, and promotional offers are non-refundable.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
                            <div className="text-gray-700 leading-relaxed space-y-3">
                                <p>All content, including but not limited to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Video lectures and recorded sessions</li>
                                    <li>Study materials and notes</li>
                                    <li>Test papers and questions</li>
                                    <li>Graphics, logos, and designs</li>
                                    <li>Software and applications</li>
                                </ul>
                                <p className="mt-3">
                                    are the exclusive property of Awasthi Classes and are protected by copyright laws. Unauthorized reproduction, distribution, or sharing of content is strictly prohibited and may result in legal action.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User Conduct</h2>
                            <div className="text-gray-700 leading-relaxed space-y-3">
                                <p>You agree NOT to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Share your account credentials with others</li>
                                    <li>Download, copy, or distribute course materials</li>
                                    <li>Record or screenshot video lectures</li>
                                    <li>Use the platform for any illegal purposes</li>
                                    <li>Harass, abuse, or harm other users or staff</li>
                                    <li>Attempt to hack or compromise platform security</li>
                                    <li>Post spam or inappropriate content</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Class Schedule and Changes</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Awasthi Classes reserves the right to modify class schedules, change instructors, or cancel classes due to unforeseen circumstances. We will make reasonable efforts to notify students of any changes in advance.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
                            <div className="text-gray-700 leading-relaxed space-y-3">
                                <p>While we strive to provide quality education, we make no guarantees regarding:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Exam results or selection in competitive examinations</li>
                                    <li>Uninterrupted or error-free service</li>
                                    <li>Accuracy of all information provided</li>
                                </ul>
                                <p className="mt-3">
                                    Our services are provided "as is" without warranties of any kind, either express or implied.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Awasthi Classes shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services. Our total liability shall not exceed the amount paid by you for the specific service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
                            <div className="text-gray-700 leading-relaxed space-y-3">
                                <p>We reserve the right to terminate or suspend your account immediately, without prior notice, for:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Violation of these Terms of Service</li>
                                    <li>Fraudulent or illegal activities</li>
                                    <li>Sharing of copyrighted materials</li>
                                    <li>Abusive behavior towards staff or students</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Privacy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hindaun, Rajasthan.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services after changes constitutes acceptance of the modified terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
                            <div className="text-gray-700 leading-relaxed space-y-2">
                                <p>For questions about these Terms of Service, please contact us:</p>
                                <p><strong>Awasthi Classes</strong></p>
                                <p>VIP Colony, Amrit Puri, Hindaun, Rajasthan 322230</p>
                                <p>Phone: +91 78911 36255</p>
                                <p>Email: AWASTHICLASSESHND@GMAIL.COM</p>
                            </div>
                        </section>

                        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> By enrolling in any course or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
