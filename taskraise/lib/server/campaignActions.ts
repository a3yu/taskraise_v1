"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";

export async function insertCampaign(
  campaignName: string,
  fundraisingGoal: number,
  campaignDescription: string,
  orgId: number
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const { data } = await supabase
    .from("campaigns")
    .insert({
      campaign_name: campaignName,
      amt_goal: fundraisingGoal,
      campaign_description: campaignDescription,
      amt_raised: 0,
      organization: orgId,
    })
    .select("*")
    .single();

  return data;
}

export async function updateCampaign(
  id: number,
  campaignName: string,
  fundraisingGoal: number,
  campaignDescription: string
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase
    .from("campaigns")
    .update({
      campaign_name: campaignName,
      amt_goal: fundraisingGoal,
      campaign_description: campaignDescription,
      amt_raised: 0,
    })
    .eq("id", id)
    .select()
    .single();
  console.log(id);
  console.log(error);
  return data;
}
