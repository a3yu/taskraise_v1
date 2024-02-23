"use server";

import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";
import { orderQuery, orderQueryUser } from "../queryTypes";

export async function getUserOrders(userId: string) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase
    .from("orders")
    .select(
      `
    *,
    organizations (
      org_name
    )
  `
    )
    .eq("customer_id", userId)
    .returns<orderQueryUser[]>();

  return data;
}

export async function getOrderById(id: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase
    .from("orders")
    .select(
      `
    *,
    organizations (
      org_name
    )
  `
    )
    .eq("id", id)
    .returns<orderQueryUser[]>()
    .single();

  return data;
}
