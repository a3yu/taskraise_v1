import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Database } from "@/types/supabase";
import { supabaseRoute } from "@/app/config/supabaseRouteHander";

export async function GET(request: Request) {
  const supabase = await supabaseRoute();

  const { error } = await supabase.auth.signOut();

  const redirectURL = `http://localhost:3000/redirect-home`;

  return NextResponse.redirect(redirectURL);
}

export const dynamic = "force-dynamic";
