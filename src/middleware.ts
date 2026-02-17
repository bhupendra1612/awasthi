import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// ===== MAINTENANCE MODE =====
// Remove this block to disable maintenance mode
const MAINTENANCE_MODE = true;
// =============================

export async function middleware(request: NextRequest) {
    // --- Maintenance Mode: redirect ALL traffic to /maintenance ---
    if (MAINTENANCE_MODE) {
        const url = request.nextUrl.clone();
        // Allow the maintenance page itself (avoid infinite redirect)
        if (url.pathname === "/maintenance") {
            return NextResponse.next();
        }
        // Redirect everything else to /maintenance
        url.pathname = "/maintenance";
        return NextResponse.redirect(url);
    }
    // --- End Maintenance Mode ---

    return await updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
