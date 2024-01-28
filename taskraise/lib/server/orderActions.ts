"use server";

import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";

export async function acceptOrder(id: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "ONGOING" })
    .eq("id", id);
  console.log(id);
  redirect("/dashboard?update");
}