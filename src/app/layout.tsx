import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Awasthi Classes - Best Coaching for Government Exams in Hindaun",
    description: "Top coaching center in Hindaun for REET, Patwari, SSC, LDC, Rajasthan Police, Railway, CET exams. Expert teachers and proven results. Join Awasthi Classes at VIP Colony, Hindaun.",
    keywords: "coaching in hindaun, reet coaching, patwari coaching, ssc coaching, ldc coaching, rajasthan police, railway exam, cet coaching, awasthi classes, government exam preparation",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
