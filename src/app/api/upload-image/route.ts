import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        // Upload to Supabase storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('test-thumbnails')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error("Upload error:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
            .from('test-thumbnails')
            .getPublicUrl(fileName);

        return NextResponse.json({
            success: true,
            url: publicUrl
        });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Upload failed"
        }, { status: 500 });
    }
}
