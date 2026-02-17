import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// This is a one-time use API to create admin users
// DELETE THIS FILE after creating the admin user for security

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check if requester is already an admin
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.json({ error: "Only admins can create admin users" }, { status: 403 });
        }

        const { email, password, fullName } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        // Note: This requires Supabase service role key
        // For security, you should create users through Supabase Dashboard instead

        return NextResponse.json({
            success: false,
            message: "Please create the user through Supabase Dashboard",
            instructions: [
                "1. Go to Supabase Dashboard > Authentication > Users",
                "2. Click 'Add User'",
                "3. Email: awasthiclasses1@gmail.com",
                "4. Password: 123@admin#",
                "5. Click 'Create User'",
                "6. Then run the SQL script: add-second-admin.sql"
            ]
        });

    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
