// Simple test version of blog page
export default function SimpleBlogPage({ params }: { params: { slug: string } }) {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Blog Page Test</h1>
                <p className="text-lg mb-4">Slug: <code className="bg-gray-200 px-2 py-1 rounded">{params.slug}</code></p>
                <p className="text-gray-600">
                    This is a simple test page to verify that the blog routing is working.
                    If you can see this page, the routing structure is correct.
                </p>

                <div className="mt-8 p-4 bg-blue-100 rounded-lg">
                    <h2 className="font-semibold mb-2">Debug Info:</h2>
                    <ul className="text-sm space-y-1">
                        <li>Route: /blog/[slug]</li>
                        <li>Slug parameter: {params.slug}</li>
                        <li>File: src/app/blog/[slug]/page.tsx</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}