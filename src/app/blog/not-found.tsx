import Link from "next/link";
import { BookOpen, ArrowLeft, Home } from "lucide-react";

export default function BlogNotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center px-4">
                <div className="mb-8">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={80} />
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Blog Not Found</h2>
                    <p className="text-gray-600 mb-8">
                        The blog post you're looking for doesn't exist or has been removed.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-medium w-full justify-center"
                    >
                        <ArrowLeft size={20} />
                        Back to Blogs
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium w-full justify-center"
                    >
                        <Home size={20} />
                        Go to Homepage
                    </Link>
                </div>

                <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <h3 className="font-semibold text-primary-900 mb-2">Looking for study materials?</h3>
                    <p className="text-primary-700 text-sm mb-3">
                        Check out our courses and educational resources.
                    </p>
                    <Link
                        href="/courses"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                        View Courses →
                    </Link>
                </div>
            </div>
        </div>
    );
}