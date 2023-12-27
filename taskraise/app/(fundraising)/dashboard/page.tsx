import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InviteList } from "@/components/dashboard/InviteList";

async function DashboardHome() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const userResponse = await supabase.auth.getSession();
  const user = userResponse.data.session?.user;

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
    console.log(orgData);
    if (!orgData.data) {
      return (
        <>
          <h1>Error</h1>
        </>
      );
    }
    return (
      <div className="p-16">
        <h1 className="text-4xl font-bold font-heading">
          {orgData.data.org_name}
        </h1>
        <h1 className="text-md mt-2">Hello, {userData.data.first_name}!</h1>
      </div>
    );
  }
  return (
    <div className="p-16">
      <h1 className="text-4xl font-bold font-heading">
        Hello, {userData.data.first_name}!
      </h1>
      <>
        <h3 className="my-4 text-md">
          You are not apart of any organizations. Accept an invite or create
          one:
        </h3>
        <div className="pr-20">
          <InviteList />
        </div>
      </>
    </div>
  );
}

export default DashboardHome;
