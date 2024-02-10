"use server";

import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";
import { searchQuery } from "../queryTypes";

export async function getSingleServiceByID(id: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}
