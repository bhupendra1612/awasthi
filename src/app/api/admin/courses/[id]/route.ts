import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const courseId = params.id;

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            );
        }

        // Get update data from request
        const rawData = await request.json();
        console.log("=== RAW UPDATE DATA ===");
        console.log(JSON.stringify(rawData, null, 2));

        // Clean the data - remove undefined, null, empty string values, or string "undefined"
        const updateData: any = {};

        for (const [key, value] of Object.entries(rawData)) {
            // Skip if value is problematic
            if (
                value === undefined ||
                value === null ||
                value === "" ||
                value === "undefined" ||
                value === "null"
            ) {
                console.log(`⚠️ Skipping field "${key}" with problematic value:`, value);
                continue;
            }

            // Add the clean value
            updateData[key] = value;
        }

        // Convert price fields to numbers if they exist
        if (updateData.price !== undefined) {
            updateData.price = typeof updateData.price === 'string' ? parseFloat(updateData.price) : updateData.price;
        }
        if (updateData.original_price !== undefined) {
            updateData.original_price = typeof updateData.original_price === 'string' ? parseFloat(updateData.original_price) : updateData.original_price;
        }

        console.log("=== CLEANED UPDATE DATA ===");
        console.log(JSON.stringify(updateData, null, 2));

        // Update the course
        const { data, error } = await supabase
            .from("courses")
            .update(updateData)
            .eq("id", courseId)
            .select()
            .single();

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                {
                    error: "Failed to update course",
                    details: error.message,
                    code: error.code,
                    hint: error.hint
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            message: "Course updated successfully"
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const courseId = params.id;

        const { data, error } = await supabase
            .from("courses")
            .select("*")
            .eq("id", courseId)
            .single();

        if (error) {
            return NextResponse.json(
                { error: "Course not found", details: error.message },
                { status: 404 }
            );
        }

        return NextResponse.json({ data });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
