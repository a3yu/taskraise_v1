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
    .select(
      `
    *,
    organizations (
      *
    )
  `
    )
    .eq("id", id)
    .single();
  return data;
}

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
    .select(
      `
    *,
    campaigns (
      amt_goal,
      amt_raised,
      campaign_name
    ),
    organizations (
      org_name
    )
  `
    )
    .range(from, to)
    .returns<searchQuery[]>();
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
    .select(
      `
    *,
    campaigns (
      amt_goal,
      amt_raised,
      campaign_name
    ),
    organizations (
      org_name
    )
  `
    )
    .range(from, to)
    .returns<searchQuery[]>();
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
    .select(
      `
    *,
    campaigns (
      amt_goal,
      amt_raised,
      campaign_name
    ),
    organizations (
      org_name
    )
  `
    )
    .range(from, to)
    .returns<searchQuery[]>();
  return data;
}
