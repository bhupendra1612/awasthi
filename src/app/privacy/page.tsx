import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Awasthi Classes ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this privacy policy carefully.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">2.1 Personal Information</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">We collect personal information that you voluntarily provide to us when you:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Register for an account</li>
                                <li>Enroll in courses</li>
                                <li>Make a purchase</li>
                                <li>Contact us for support</li>
                                <li>Subscribe to our newsletter</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-3">This information may include:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Full name</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Date of birth</li>
                                <li>Address</li>
                                <li>Educational qualifications</li>
                                <li>Payment information</li>
                                <li>Profile photo (optional)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Automatically Collected Information</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">When you access our website, we automatically collect:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>IP address</li>
                                <li>Browser type and version</li>
                                <li>Device information</li>
                                <li>Operating system</li>
                                <li>Pages visited and time spent</li>
                                <li>Referring website</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.3 Academic Information</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">We collect information related to your learning activities:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Course enrollment and progress</li>
                                <li>Test scores and performance</li>
                                <li>Assignment submissions</li>
                                <li>Attendance records</li>
                                <li>Study patterns and preferences</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">We use the collected information for:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Providing and managing your account</li>
                                <li>Processing course enrollments and payments</li>
                                <li>Delivering educational content and services</li>
                                <li>Tracking your progress and performance</li>
                                <li>Sending course updates and notifications</li>
                                <li>Responding to your inquiries and support requests</li>
                                <li>Improving our services and user experience</li>
                                <li>Sending promotional materials (with your consent)</li>
                                <li>Analyzing usage patterns and trends</li>
                                <li>Preventing fraud and ensuring security</li>
                                <li>Complying with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.1 We Do NOT Sell Your Information</h3>
                            <p className="text-gray-700 leading-relaxed">
                                We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 We May Share Information With:</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Service Providers:</strong> Payment processors, hosting services, email services, and analytics providers</li>
                                <li><strong>Teachers and Staff:</strong> For educational purposes and course management</li>
                                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                We implement appropriate technical and organizational measures to protect your personal information:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>SSL/TLS encryption for data transmission</li>
                                <li>Secure password storage with encryption</li>
                                <li>Regular security audits and updates</li>
                                <li>Access controls and authentication</li>
                                <li>Secure payment processing through trusted gateways</li>
                                <li>Regular backups and disaster recovery plans</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-3">
                                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">We use cookies and similar technologies to:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Remember your preferences and settings</li>
                                <li>Keep you logged in</li>
                                <li>Analyze website traffic and usage</li>
                                <li>Personalize content and recommendations</li>
                                <li>Improve website performance</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-3">
                                You can control cookies through your browser settings. However, disabling cookies may affect website functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">You have the right to:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Access:</strong> Request a copy of your personal information</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-3">
                                To exercise these rights, please contact us at AWASTHICLASSESHND@GMAIL.COM
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. After account deletion, we may retain certain information for:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                                <li>Legal and regulatory compliance</li>
                                <li>Fraud prevention</li>
                                <li>Resolving disputes</li>
                                <li>Enforcing our agreements</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Our services are intended for users aged 16 and above. We do not knowingly collect information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Third-Party Links</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read their privacy policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Your information may be transferred to and processed in countries other than India. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Privacy Policy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
                            <div className="text-gray-700 leading-relaxed space-y-2">
                                <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
                                <p><strong>Awasthi Classes</strong></p>
                                <p>VIP Colony, Amrit Puri, Hindaun, Rajasthan 322230</p>
                                <p>Phone: +91 78911 36255</p>
                                <p>Email: AWASTHICLASSESHND@GMAIL.COM</p>
                            </div>
                        </section>

                        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                                <strong>Your Privacy Matters:</strong> We are committed to protecting your personal information and being transparent about our data practices. If you have any concerns, please don't hesitate to reach out to us.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
