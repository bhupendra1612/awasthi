import { createClient } from "@/lib/supabase/server";
import EnrollmentsList from "./EnrollmentsList";

export default async function EnrollmentsPage() {
    const supabase = await createClient();

    // Fetch enrollments
    const { data: enrollments } = await supabase
        .from("enrollments")
        .select("*")
        .order("enrolled_at", { ascending: false });

    // Fetch profiles and courses separately
    const { data: profiles } = await supabase.from("profiles").select("id, email, full_name");
    const { data: courses } = await supabase.from("courses").select("id, title, class");

    // Combine data
    const enrichedEnrollments = (enrollments || []).map(enrollment => ({
        ...enrollment,
        profiles: profiles?.find(p => p.id === enrollment.user_id) || null,
        courses: courses?.find(c => c.id === enrollment.course_id) || null,
    }));

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
                <p className="text-gray-500">Manage student enrollments and approve payments</p>
            </div>

            <EnrollmentsList initialEnrollments={enrichedEnrollments} />
        </div>
    );
}
