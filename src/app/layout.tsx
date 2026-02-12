import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://awasthiclasses.in";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    // ───── Core ─────
    title: {
        default: "Awasthi Classes - Best Coaching for Government Exams in Hindaun",
        template: "%s | Awasthi Classes",
    },
    description:
        "Top coaching center in Hindaun for REET, Patwari, SSC, LDC, Rajasthan Police, Railway, CET exams. Expert teachers and proven results. Join Awasthi Classes at VIP Colony, Hindaun.",
    keywords: [
        "coaching in hindaun",
        "reet coaching",
        "patwari coaching",
        "ssc coaching",
        "ldc coaching",
        "rajasthan police coaching",
        "railway exam coaching",
        "cet coaching",
        "awasthi classes",
        "government exam preparation",
        "best coaching hindaun",
        "hindaun coaching center",
        "reet coaching hindaun",
        "ssc coaching hindaun",
    ],

    // ───── Icons (auto-detected from app directory too) ─────
    icons: {
        icon: "/images/logo.png",
        apple: "/images/logo.png",
    },

    // ───── Open Graph ─────
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: SITE_URL,
        siteName: "Awasthi Classes",
        title: "Awasthi Classes - Best Coaching for Government Exams in Hindaun",
        description:
            "Top coaching center in Hindaun for REET, Patwari, SSC, LDC, Rajasthan Police, Railway, CET exams. Expert teachers and proven results.",
        images: [
            {
                url: "/images/logo.png",
                width: 512,
                height: 512,
                alt: "Awasthi Classes Logo",
            },
        ],
    },

    // ───── Twitter ─────
    twitter: {
        card: "summary",
        title: "Awasthi Classes - Best Coaching for Government Exams in Hindaun",
        description:
            "Top coaching center in Hindaun for REET, Patwari, SSC, LDC, Rajasthan Police, Railway, CET exams.",
        images: ["/images/logo.png"],
    },

    // ───── Robots ─────
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // ───── Alternates ─────
    alternates: {
        canonical: SITE_URL,
    },

    // ───── Verification ─────
    verification: {
        google: "wN5pICKlC24xvUNqgal8FSKjgnIpzU9ybs5rLu8zBJk",
    },
};

// ───── JSON-LD Structured Data ─────
const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Awasthi Classes",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
        "Top coaching center in Hindaun for REET, Patwari, SSC, LDC, Rajasthan Police, Railway, CET government exam preparation.",
    telephone: "+917891136255",
    email: "AWASTHICLASSESHND@GMAIL.COM",
    address: {
        "@type": "PostalAddress",
        streetAddress: "VIP Colony, Amrit Puri",
        addressLocality: "Hindaun",
        addressRegion: "Rajasthan",
        postalCode: "322230",
        addressCountry: "IN",
    },
    sameAs: [
        "https://facebook.com/awasthiclasses",
        "https://instagram.com/awasthiclasses",
        "https://youtube.com/@awasthiclasses",
    ],
};

const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Awasthi Classes",
    image: `${SITE_URL}/images/logo.png`,
    url: SITE_URL,
    telephone: "+917891136255",
    email: "AWASTHICLASSESHND@GMAIL.COM",
    address: {
        "@type": "PostalAddress",
        streetAddress: "VIP Colony, Amrit Puri",
        addressLocality: "Hindaun",
        addressRegion: "Rajasthan",
        postalCode: "322230",
        addressCountry: "IN",
    },
    priceRange: "₹",
};

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Awasthi Classes",
    url: SITE_URL,
    potentialAction: {
        "@type": "SearchAction",
        target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/browse-courses?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationJsonLd),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(localBusinessJsonLd),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteJsonLd),
                    }}
                />
            </head>
            <body className="antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
