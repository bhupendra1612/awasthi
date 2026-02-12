import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin/",
                    "/dashboard/",
                    "/student/",
                    "/teacher/",
                    "/login",
                    "/signup",
                    "/api/",
                    "/auth/",
                    "/debug-admin/",
                    "/debug-blog/",
                    "/test-profile/",
                    "/test-blog-links/",
                    "/create-test-data/",
                    "/force-refresh/",
                ],
            },
        ],
        sitemap: "https://awasthiclasses.in/sitemap.xml",
    };
}
