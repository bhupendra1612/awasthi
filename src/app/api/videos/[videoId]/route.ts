import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const BUNNY_API_URL = "https://video.bunnycdn.com/library";
const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!;
const API_KEY = process.env.BUNNY_API_KEY!;

// Get video details
export async function GET(
    request: Request,
    { params }: { params: Promise<{ videoId: string }> }
) {
    try {
        const { videoId } = await params;

        const response = await fetch(`${BUNNY_API_URL}/${LIBRARY_ID}/videos/${videoId}`, {
            headers: {
                "AccessKey": API_KEY,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error getting video:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Delete video
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ videoId: string }> }
) {
    try {
        // Check if user is admin
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { videoId } = await params;

        const response = await fetch(`${BUNNY_API_URL}/${LIBRARY_ID}/videos/${videoId}`, {
            method: "DELETE",
            headers: {
                "AccessKey": API_KEY,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting video:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
