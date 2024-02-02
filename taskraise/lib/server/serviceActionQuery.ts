"use server";

import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";

export async function getServicesSearchNormal(
  from: number,
  to: number,
  search: string
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase
    .rpc("search_services", {
      product_title: search,
    })
    .select("*")
    .range(from, to);
  return data;
}
