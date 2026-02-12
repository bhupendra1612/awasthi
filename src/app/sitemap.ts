import type { MetadataRoute } from "next";

const BASE_URL = "https://awasthiclasses.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/browse-courses`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/browse-tests`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/gallery`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/blogs`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/refund`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    // Try to fetch blog slugs dynamically
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { data: blogs } = await supabase
            .from("blogs")
            .select("slug, updated_at")
            .eq("published", true);

        if (blogs) {
            blogRoutes = blogs.map((blog) => ({
                url: `${BASE_URL}/blog/${blog.slug}`,
                lastModified: new Date(blog.updated_at || new Date()),
                changeFrequency: "weekly" as const,
                priority: 0.6,
            }));
        }
    } catch {
        // Supabase not available at build time — skip dynamic routes
    }

    return [...staticRoutes, ...blogRoutes];
}
