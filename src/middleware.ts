import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// ===== MAINTENANCE MODE =====
// Set to true to enable maintenance mode (redirects to /maintenance)
const MAINTENANCE_MODE = false;
// =============================

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    
    // --- Maintenance Mode: redirect ALL traffic to /maintenance ---
    if (MAINTENANCE_MODE) {
        // Allow the maintenance page itself (avoid infinite redirect)
        if (url.pathname === "/maintenance") {
            return NextResponse.next();
        }
        // Redirect everything else to /maintenance
        url.pathname = "/maintenance";
        return NextResponse.redirect(url);
    } else {
        // Redirect /maintenance to / if maintenance mode is off
        if (url.pathname === "/maintenance") {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }
    // --- End Maintenance Mode ---

    return await updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
