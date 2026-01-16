import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { courseId } = await request.json();

        if (!courseId) {
            return NextResponse.json({ error: "Course ID required" }, { status: 400 });
        }

        // Check if course exists and is published
        const { data: course, error: courseError } = await supabase
            .from("courses")
            .select("id, price, title")
            .eq("id", courseId)
            .eq("is_published", true)
            .single();

        if (courseError || !course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Check if already enrolled
        const { data: existingEnrollment } = await supabase
            .from("enrollments")
            .select("id, payment_status")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .single();

        if (existingEnrollment) {
            if (existingEnrollment.payment_status === "paid") {
                return NextResponse.json({ error: "Already enrolled" }, { status: 400 });
            }
            // Update existing pending enrollment
            return NextResponse.json({
                message: "Enrollment pending payment",
                enrollmentId: existingEnrollment.id
            });
        }

        // Create new enrollment with pending status
        const { data: enrollment, error: enrollError } = await supabase
            .from("enrollments")
            .insert({
                user_id: user.id,
                course_id: courseId,
                payment_status: "pending",
                amount_paid: course.price,
                status: "active",
            })
            .select()
            .single();

        if (enrollError) {
            console.error("Enrollment error:", enrollError);
            return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
        }

        return NextResponse.json({
            message: "Enrollment created",
            enrollmentId: enrollment.id,
            courseTitle: course.title,
            amount: course.price,
        });
    } catch (error) {
        console.error("Enrollment error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
