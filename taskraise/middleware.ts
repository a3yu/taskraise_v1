import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/types/supabase";
import { getProfileByID } from "./lib/server/profileQuery";

// this middleware refreshes the user's session and must be run
// for any Server Component route that uses `createServerComponentSupabaseClient`
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const session = await supabase.auth.getSession();
  const user = await supabase.auth.getUser();
  if (user.data.user) {
    const profile = await getProfileByID(user.data.user.id);
    console.log(profile);
    if (!(req.url === "http://localhost:3000/finish-signup")) {
      if (
        profile?.first_name === null ||
        profile?.last_name === null ||
        profile?.gen_role === null ||
        profile?.username === null ||
        profile?.first_name === "" ||
        profile?.last_name === "" ||
        profile?.username === ""
      ) {
        return NextResponse.redirect("http://localhost:3000/finish-signup");
      }
    }
  }
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
