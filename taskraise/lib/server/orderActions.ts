"use server";

import { supabase } from "@/app/config/supabaseClient";
import { redirect } from "next/navigation";

export async function acceptOrder(id: number) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "ONGOING" })
    .eq("id", id);
  redirect("/dashboard?update");
}
