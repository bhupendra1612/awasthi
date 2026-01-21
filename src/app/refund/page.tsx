import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RefundPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund & Cancellation Policy</h1>
                    <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
                            <p className="text-gray-700 leading-relaxed">
                                At Awasthi Classes, we strive to provide the best educational experience. This Refund & Cancellation Policy outlines the terms and conditions for refunds and cancellations of our courses and services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Refund Eligibility</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">2.1 Online Courses</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">Refunds for online courses are available under the following conditions:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Time Period:</strong> Request must be made within 7 days of purchase</li>
                                <li><strong>Content Access:</strong> Less than 20% of course content has been accessed</li>
                                <li><strong>Video Views:</strong> No more than 3 video lectures have been watched</li>
                                <li><strong>Tests:</strong> No test series have been attempted</li>
                                <li><strong>Downloads:</strong> No study materials have been downloaded</li>
                                <li><strong>Certificates:</strong> No certificates have been issued</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Classroom/Offline Courses</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">For classroom courses:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Before Course Starts:</strong> Full refund minus processing fee (₹500)</li>
                                <li><strong>Within First Week:</strong> 75% refund if less than 3 classes attended</li>
                                <li><strong>After First Week:</strong> No refund available</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.3 Test Series</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Before First Test:</strong> Full refund within 7 days of purchase</li>
                                <li><strong>After First Test:</strong> No refund available</li>
                                <li><strong>Partial Series:</strong> No refunds for partially completed test series</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Non-Refundable Items</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">The following are non-refundable:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Study materials and books (physical or digital)</li>
                                <li>Promotional or discounted courses</li>
                                <li>Courses purchased during special offers or sales</li>
                                <li>Combo packages or bundled courses</li>
                                <li>One-on-one tutoring sessions already conducted</li>
                                <li>Registration or admission fees</li>
                                <li>Processing fees and transaction charges</li>
                                <li>Courses accessed beyond the refund eligibility period</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Process</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">4.1 How to Request a Refund</h3>
                            <div className="text-gray-700 leading-relaxed space-y-3">
                                <p>To request a refund, follow these steps:</p>
                                <ol className="list-decimal list-inside space-y-2 ml-4">
                                    <li>Send an email to AWASTHICLASSESHND@GMAIL.COM</li>
                                    <li>Include your order ID and registered email</li>
                                    <li>Provide reason for refund request</li>
                                    <li>Attach payment proof (if applicable)</li>
                                </ol>
                                <p className="mt-3">Or call us at: +91 78911 36255</p>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Refund Timeline</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Review:</strong> We will review your request within 2-3 business days</li>
                                <li><strong>Approval:</strong> If approved, refund will be initiated within 5-7 business days</li>
                                <li><strong>Credit:</strong> Amount will be credited to your original payment method within 7-10 business days</li>
                                <li><strong>Bank Processing:</strong> Additional 3-5 days may be required by your bank</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Refund Method</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Refunds will be processed through the same payment method used for the original purchase. We do not provide refunds in cash or through alternative payment methods.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cancellation Policy</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">5.1 Student-Initiated Cancellation</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">Students can cancel their enrollment:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Online courses: Within 7 days of purchase (subject to usage conditions)</li>
                                <li>Classroom courses: Before course start date or within first week</li>
                                <li>Test series: Before attempting the first test</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.2 Institute-Initiated Cancellation</h3>
                            <p className="text-gray-700 leading-relaxed mb-3">Awasthi Classes reserves the right to cancel courses due to:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>Insufficient enrollments</li>
                                <li>Teacher unavailability</li>
                                <li>Technical issues</li>
                                <li>Force majeure events</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-3">
                                In such cases, students will receive a <strong>full refund</strong> or the option to transfer to another batch/course.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Course Transfer Policy</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                Instead of a refund, you may request a course transfer:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Same Course, Different Batch:</strong> Free transfer within 30 days</li>
                                <li><strong>Different Course, Same Value:</strong> One-time transfer allowed</li>
                                <li><strong>Higher Value Course:</strong> Pay the difference</li>
                                <li><strong>Lower Value Course:</strong> No refund for difference</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-3">
                                <strong>Note:</strong> Course transfers are subject to availability and must be requested within 30 days of original purchase.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Special Circumstances</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">7.1 Medical Emergency</h3>
                            <p className="text-gray-700 leading-relaxed">
                                In case of serious medical emergencies (with valid medical certificate), we may consider refund requests on a case-by-case basis, even beyond the standard refund period.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.2 Technical Issues</h3>
                            <p className="text-gray-700 leading-relaxed">
                                If you experience persistent technical issues preventing course access, and our support team cannot resolve them within 7 days, you may be eligible for a full refund.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.3 Duplicate Payment</h3>
                            <p className="text-gray-700 leading-relaxed">
                                In case of duplicate or erroneous payments, full refund will be processed immediately upon verification.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Refund Deductions</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">The following may be deducted from refunds:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li><strong>Processing Fee:</strong> ₹500 for offline courses</li>
                                <li><strong>Transaction Charges:</strong> Payment gateway fees (2-3%)</li>
                                <li><strong>Proportional Usage:</strong> Cost of content accessed</li>
                                <li><strong>Study Materials:</strong> If physical materials were provided</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Dispute Resolution</h2>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                If you disagree with our refund decision:
                            </p>
                            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                                <li>Contact our support team with additional information</li>
                                <li>Request escalation to management</li>
                                <li>We will review your case within 5 business days</li>
                                <li>Final decision will be communicated via email</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Important Notes</h2>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
                                <p className="text-gray-700"><strong>⚠️ Please Note:</strong></p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Refund policies are subject to change without prior notice</li>
                                    <li>All refund requests must be made in writing (email)</li>
                                    <li>Verbal requests will not be considered</li>
                                    <li>Screenshots or proof of usage may be required</li>
                                    <li>Refunds are processed only after thorough verification</li>
                                    <li>Abuse of refund policy may result in account suspension</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
                            <div className="text-gray-700 leading-relaxed space-y-2">
                                <p>For refund and cancellation queries, contact us:</p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                                    <p><strong>Awasthi Classes</strong></p>
                                    <p>VIP Colony, Amrit Puri, Hindaun, Rajasthan 322230</p>
                                    <p className="mt-2"><strong>Phone:</strong> +91 78911 36255</p>
                                    <p><strong>Email:</strong> AWASTHICLASSESHND@GMAIL.COM</p>
                                    <p className="mt-2 text-sm text-gray-600">
                                        <strong>Office Hours:</strong> Monday to Saturday, 9:00 AM - 6:00 PM
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Frequently Asked Questions</h2>

                            <div className="space-y-4">
                                <div className="border-l-4 border-primary-500 pl-4">
                                    <p className="font-semibold text-gray-900">Q: How long does the refund process take?</p>
                                    <p className="text-gray-700 mt-1">A: Typically 7-15 business days from approval date.</p>
                                </div>

                                <div className="border-l-4 border-primary-500 pl-4">
                                    <p className="font-semibold text-gray-900">Q: Can I get a refund after watching all videos?</p>
                                    <p className="text-gray-700 mt-1">A: No, refunds are only available if less than 20% content is accessed.</p>
                                </div>

                                <div className="border-l-4 border-primary-500 pl-4">
                                    <p className="font-semibold text-gray-900">Q: Are promotional courses refundable?</p>
                                    <p className="text-gray-700 mt-1">A: No, courses purchased during promotions are non-refundable.</p>
                                </div>

                                <div className="border-l-4 border-primary-500 pl-4">
                                    <p className="font-semibold text-gray-900">Q: Can I transfer my course to another student?</p>
                                    <p className="text-gray-700 mt-1">A: No, course enrollments are non-transferable to other individuals.</p>
                                </div>

                                <div className="border-l-4 border-primary-500 pl-4">
                                    <p className="font-semibold text-gray-900">Q: What if I'm not satisfied with the course quality?</p>
                                    <p className="text-gray-700 mt-1">A: Contact us within 7 days with specific concerns. We'll review your case individually.</p>
                                </div>
                            </div>
                        </section>

                        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                                <strong>Our Commitment:</strong> We are committed to student satisfaction. While we have clear refund policies, we handle each case with care and understanding. If you have genuine concerns, please reach out to us.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
