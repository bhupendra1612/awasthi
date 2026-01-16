import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const supabase = await createClient();
        const courseId = params.id;

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== "admin") {
            return NextResponse.json({ error: "Only admins can update courses" }, { status: 403 });
        }

        const body = await request.json();

        // Prepare update data with only valid columns
        const updateData: any = {
            title: body.title,
            description: body.description,
            class: body.class,
            subject: body.subject,
            is_combo: body.is_combo,
            is_published: body.is_published,
            updated_at: new Date().toISOString(),
        };

        // Handle price fields
        if (body.price !== undefined) {
            const priceNum = parseFloat(body.price);
            updateData.price = isNaN(priceNum) ? 0 : priceNum;
        }

        if (body.original_price !== undefined) {
            const originalPriceNum = parseFloat(body.original_price);
            updateData.original_price = isNaN(originalPriceNum) ? null : originalPriceNum;
        }

        // Handle thumbnail URL
        if (body.thumbnail_url !== undefined) {
            updateData.thumbnail_url = body.thumbnail_url || null;
        }

        // Add optional columns if they exist
        if (body.board) updateData.board = body.board;
        if (body.duration) updateData.duration = body.duration;
        if (typeof body.is_featured === 'boolean') updateData.is_featured = body.is_featured;
        if (typeof body.is_trending === 'boolean') updateData.is_trending = body.is_trending;

        const { data, error } = await supabase
            .from("courses")
            .update(updateData)
            .eq("id", courseId)
            .select()
            .single();

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json({
                error: "Database error",
                details: error.message
            }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}