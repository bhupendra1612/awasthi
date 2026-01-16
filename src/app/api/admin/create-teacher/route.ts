import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Check if current user is admin
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
            return NextResponse.json({ error: "Only admins can create teachers" }, { status: 403 });
        }

        const {
            email,
            password,
            full_name,
            subject,
            phone,
            experience_years,
            qualification,
            specialization,
            bio
        } = await request.json();

        if (!email || !password || !full_name || !subject) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Try to use admin client with service role key
        let adminClient;
        try {
            adminClient = createAdminClient();
        } catch {
            // Service role key not available, will use fallback
            adminClient = null;
        }

        if (adminClient) {
            // Create user using Admin API (auto-confirms email)
            const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { full_name },
            });

            if (authError) {
                return NextResponse.json({ error: authError.message }, { status: 400 });
            }

            // Create/update profile with teacher role using admin client (bypasses RLS)
            if (authData.user) {
                const { error: profileError } = await adminClient
                    .from("profiles")
                    .upsert({
                        id: authData.user.id,
                        email,
                        full_name,
                        role: "teacher",
                        subject,
                        phone,
                        experience_years: experience_years ? parseInt(experience_years) : null,
                        qualification,
                        specialization,
                        bio,
                        is_active: true,
                    });

                if (profileError) {
                    console.error("Profile creation error:", profileError);
                }
            }

            return NextResponse.json({
                success: true,
                message: "Teacher created successfully! They can login immediately.",
                userId: authData.user?.id
            });
        }

        // Fallback: Use regular signup (requires email verification)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name },
            },
        });

        if (signUpError) {
            return NextResponse.json({ error: signUpError.message }, { status: 400 });
        }

        // Try to create profile (may fail due to RLS if user not confirmed)
        if (signUpData.user) {
            // Use admin client if available for profile creation
            const client = adminClient || supabase;
            await client
                .from("profiles")
                .upsert({
                    id: signUpData.user.id,
                    email,
                    full_name,
                    role: "teacher",
                    subject,
                    phone,
                    experience_years: experience_years ? parseInt(experience_years) : null,
                    qualification,
                    specialization,
                    bio,
                    is_active: true,
                });
        }

        return NextResponse.json({
            success: true,
            message: "Teacher created. They need to verify their email before logging in.",
            userId: signUpData.user?.id,
            requiresEmailVerification: true
        });

    } catch (error) {
        console.error("Create teacher error:", error);
        return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
    }
}
