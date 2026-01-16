import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const BUNNY_API_URL = "https://video.bunnycdn.com/library";
const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!;
const API_KEY = process.env.BUNNY_API_KEY!;

export async function PUT(request: Request) {
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

        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get("videoId");

        if (!videoId) {
            return NextResponse.json({ error: "Video ID required" }, { status: 400 });
        }

        // Get the file from request
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Upload to Bunny
        const arrayBuffer = await file.arrayBuffer();
        const response = await fetch(`${BUNNY_API_URL}/${LIBRARY_ID}/videos/${videoId}`, {
            method: "PUT",
            headers: {
                "AccessKey": API_KEY,
                "Content-Type": "application/octet-stream",
            },
            body: arrayBuffer,
        });

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json({ error: "Failed to upload video: " + error }, { status: 500 });
        }

        return NextResponse.json({ success: true, videoId });
    } catch (error) {
        console.error("Error uploading video:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
