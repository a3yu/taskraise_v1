"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";

export async function insertMessage(
  sender: string,
  orderId: number,
  message: string,
  from: string
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase
    .from("messages")
    .insert({ sender, order_id: orderId, payload: message, from })
    .select();

  return data;
}
