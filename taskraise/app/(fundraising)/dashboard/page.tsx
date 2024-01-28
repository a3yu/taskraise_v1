"use server";
import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NonAssignedUser from "@/components/dashboard/NonAssignedUser";
import AssignedUser from "@/components/dashboard/AssignedUser";
async function DashboardHome({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const userResponse = await supabase.auth.getSession();
  const user = userResponse.data.session?.user;
  if ("update" in searchParams) {
    redirect("/dashboard");
  }
  if (!user) {
    redirect("/");
  }

  const userData = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!userData.data) {
    redirect("/");
  }
  if (userData.data.organization) {
    const orgData = await supabase
      .from("organizations")
      .select("*")
      .eq("id", userData.data.organization)
      .single();
    if (orgData.data) {
      const orgUsers = await supabase
        .from("profiles")
        .select()
        .eq("organization", orgData.data.id);
      const orgOrders = await supabase
        .from("orders")
        .select("*")
        .eq("org_id", orgData.data.id);
      if (orgUsers.data && orgOrders.data) {
        console.log(orgOrders.data);
        const orgOrdersIncoming = orgOrders.data.filter((order) => {
          return order.status === "REQUESTED";
        });
        const orgOrdersOngoing = orgOrders.data.filter((order) => {
          return order.status === "ONGOING";
        });
        const orgOrdersFinished = orgOrders.data.filter((order) => {
          return order.status === "COMPLETED";
        });
        return (
          <AssignedUser
            orgOrdersIncoming={orgOrdersIncoming ? orgOrdersIncoming : []}
            orgOrdersOngoing={orgOrdersOngoing ? orgOrdersOngoing : []}
            orgOrdersFinished={orgOrdersFinished ? orgOrdersFinished : []}
            orgData={orgData.data}
            orgUsers={orgUsers.data}
          />
        );
      }
    }
  } else {
    return <NonAssignedUser userData={userData.data} />;
  }
}

export default DashboardHome;
