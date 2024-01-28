"use server";
import Services from "@/components/dashboard/page/Services";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function DashboardService({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if ("update" in searchParams) {
    redirect("/dashboard/services");
  }
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const userResponse = await supabase.auth.getSession();
  const user = userResponse.data.session?.user;
  if (user) {
    const userProfile = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (userProfile.data?.organization) {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("organization", userProfile.data?.organization);
      return <Services services={data ? data : []} />;
    }
  }
  redirect("/");
}

export default DashboardService;
