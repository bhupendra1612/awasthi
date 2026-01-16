import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

const BUNNY_API_URL = "https://video.bunnycdn.com/library";
const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!;
const API_KEY = process.env.BUNNY_API_KEY!;

export async function POST(request: Request) {
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

        const { title } = await request.json();

        // Create video in Bunny
        const response = await fetch(`${BUNNY_API_URL}/${LIBRARY_ID}/videos`, {
            method: "POST",
            headers: {
                "AccessKey": API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
        });

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json({ error: "Failed to create video: " + error }, { status: 500 });
        }

        const data = await response.json();

        // Generate TUS authentication signature
        // Signature = SHA256(library_id + api_key + expiration_time + video_id)
        const expirationTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
        const signatureString = `${LIBRARY_ID}${API_KEY}${expirationTime}${data.guid}`;
        const signature = crypto.createHash("sha256").update(signatureString).digest("hex");

        return NextResponse.json({
            videoId: data.guid,
            libraryId: LIBRARY_ID,
            expirationTime,
            signature,
        });
    } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
