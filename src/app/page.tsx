import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Achievements from "@/components/Achievements";
import Courses from "@/components/Courses";
import TestSeries from "@/components/TestSeries";
import Teachers from "@/components/Teachers";
import Testimonials from "@/components/Testimonials";
import Blogs from "@/components/Blogs";
import DownloadApp from "@/components/DownloadApp";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Features />
                <Achievements />
                <Courses />
                <TestSeries />
                <Teachers />
                <Testimonials />
                <Blogs />
                <DownloadApp />
                <Contact />
                <CTA />
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
