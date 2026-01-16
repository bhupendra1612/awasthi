import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
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
            return NextResponse.json({ error: "Only admins can view teachers" }, { status: 403 });
        }

        // Use admin client to bypass RLS
        let adminClient;
        try {
            adminClient = createAdminClient();
        } catch {
            // Fallback to regular client
            adminClient = supabase;
        }

        // Fetch all teachers
        const { data: teachers, error: teacherError } = await adminClient
            .from("profiles")
            .select("*")
            .eq("role", "teacher")
            .order("created_at", { ascending: false });

        if (teacherError) {
            console.error("Error fetching teachers:", teacherError);
            return NextResponse.json({ error: teacherError.message }, { status: 500 });
        }

        // Get course counts for each teacher
        const teachersWithCounts = await Promise.all(
            (teachers || []).map(async (teacher) => {
                const { count } = await adminClient
                    .from("courses")
                    .select("*", { count: "exact", head: true })
                    .eq("teacher_id", teacher.id);

                return {
                    ...teacher,
                    courses_count: count || 0,
                };
            })
        );

        return NextResponse.json({ teachers: teachersWithCounts });
    } catch (error) {
        console.error("Fetch teachers error:", error);
        return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
    }
}
