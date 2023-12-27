import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Database } from "@/typesDatabase";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const { error } = await supabase.auth.signOut();

  const redirectURL = `http://localhost:3000/redirect-home`;

  return NextResponse.redirect(redirectURL);
}
