"use server";

import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";
import {
  capturePaymentIntent,
  denyPaymentIntent,
  transferToConnectedAccount,
} from "@/utils/stripe";

export async function acceptOrder(id: number, paymentIntent: string) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const { data } = await supabase
    .from("orders")
    .update({ status: "ONGOING" })
    .eq("id", id);
  await capturePaymentIntent(paymentIntent);
  redirect("/dashboard?update");
}

export async function rejectOrder(id: number, paymentIntent: string) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase
    .from("orders")
    .update({ status: "REJECTED" })
    .eq("id", id);
  await denyPaymentIntent(paymentIntent);
  redirect("/dashboard?update");
}

export async function completeOrder(
  id: number,
  amt: number,
  connectedAccount: string
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase
    .from("orders")
    .update({ status: "COMPLETED" })
    .eq("id", id);
  await transferToConnectedAccount(connectedAccount, amt);
}
