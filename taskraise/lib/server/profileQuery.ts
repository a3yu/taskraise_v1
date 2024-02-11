"use server";

import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";

export async function getProfileByID(id: string | null) {
  if (id === null) {
    return null;
  }
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}
