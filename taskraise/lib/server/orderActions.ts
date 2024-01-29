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
  await supabase.from("orders").update({ status: "ONGOING" }).eq("id", id);
  console.log(id);
  redirect("/dashboard?update");
}

export async function rejectOrder(id: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  await supabase.from("orders").update({ status: "ONGOING" }).eq("id", id);

  redirect("/dashboard?update");
}

export async function changeServiceLocation(
  id: number,
  locationValue: string,
  locationText: string
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  await supabase
    .from("services")
    .update({
      location: locationValue,
      location_text: locationText,
    })
    .eq("id", id);
  redirect("/dashboard?update");
}

export async function changeServiceTitle(id: number, title: string) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  await supabase
    .from("services")
    .update({
      service_title: title,
    })
    .eq("id", id);
  redirect("/dashboard?update");
}

export async function changeServiceDescription(
  id: number,
  description: string
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  await supabase
    .from("services")
    .update({
      service_description: description,
    })
    .eq("id", id);
  redirect("/dashboard?update");
}

export async function changeServiceCost(id: number, cost: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  await supabase
    .from("services")
    .update({
      price: cost,
    })
    .eq("id", id);
  redirect("/dashboard?update");
}
