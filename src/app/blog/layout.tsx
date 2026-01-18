import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | Awasthi Classes",
    description: "Educational blogs, study tips, and exam preparation guides from Awasthi Classes experts.",
    keywords: "education blog, study tips, exam preparation, SSC, Railway, Bank, RPSC, RSMSSB, government exams",
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}