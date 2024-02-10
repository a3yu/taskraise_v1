"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";

export async function getOrganizationInfoByID(id: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}
