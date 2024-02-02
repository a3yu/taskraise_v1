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

export async function getServicesSearchNearby(
  from: number,
  to: number,
  search: string,
  radius: string,
  lat: string,
  long: string
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase
    .rpc("search_services_nearby", {
      product_title: search,
      dist_meters: parseFloat(radius) * 1600,
      lat: parseFloat(lat),
      long: parseFloat(long),
    })
    .select("*")
    .range(from, to);
  return data;
}

export async function getServicesSearchRemote(
  from: number,
  to: number,
  search: string
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data } = await supabase
    .rpc("search_services_remote", {
      product_title: search,
    })
    .select("*")
    .range(from, to);
  return data;
}
