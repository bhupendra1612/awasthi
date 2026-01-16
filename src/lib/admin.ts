// Add admin user IDs here
// After creating your admin account, get the user ID from Supabase Dashboard -> Authentication -> Users
// Then add it to this array
export const ADMIN_EMAILS = [
    // Add your admin email here, e.g.:
    // "admin@bardofmaths.com",
];

export function isAdminEmail(email: string | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
}
