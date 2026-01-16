import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
    // Razorpay integration - disabled until API keys are configured
    if (!process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
            { error: "Payment gateway not configured" },
            { status: 503 }
        );
    }

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courseId
        } = await request.json();

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        // Update enrollment to paid
        const { error: updateError } = await supabase
            .from("enrollments")
            .update({
                payment_status: "paid",
                enrolled_at: new Date().toISOString(),
            })
            .eq("user_id", user.id)
            .eq("course_id", courseId);

        if (updateError) {
            console.error("Enrollment update error:", updateError);
            return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
