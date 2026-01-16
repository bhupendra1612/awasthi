import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // Razorpay integration - disabled until API keys are configured
    // To enable: Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
            { error: "Payment gateway not configured. Please use manual UPI payment." },
            { status: 503 }
        );
    }

    try {
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { courseId } = await request.json();

        // Get course details
        const { data: course, error: courseError } = await supabase
            .from("courses")
            .select("id, title, price")
            .eq("id", courseId)
            .eq("is_published", true)
            .single();

        if (courseError || !course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Check if already enrolled
        const { data: existingEnrollment } = await supabase
            .from("enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .eq("payment_status", "paid")
            .single();

        if (existingEnrollment) {
            return NextResponse.json({ error: "Already enrolled" }, { status: 400 });
        }

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: course.price * 100,
            currency: "INR",
            receipt: `course_${courseId}_${user.id.slice(0, 8)}`,
            notes: {
                courseId,
                userId: user.id,
                courseTitle: course.title,
            },
        });

        // Create pending enrollment
        await supabase.from("enrollments").upsert({
            user_id: user.id,
            course_id: courseId,
            payment_status: "pending",
            amount_paid: course.price,
            status: "active",
        }, {
            onConflict: "user_id,course_id",
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            courseTitle: course.title,
        });
    } catch (error) {
        console.error("Payment order error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
