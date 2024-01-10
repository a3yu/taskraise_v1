// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { Database } from "@/typesDatabase";
// import { redirect } from "next/navigation";
// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const supabase = createServerComponentClient<Database>({ cookies });
//   const user = (await supabase.auth.getUser()).data.user;
//   if (user) {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("id", user.id)
//       .single();
//     if (
//       data?.first_name === null ||
//       data?.last_name === null ||
//       data?.username === null
//     ) {
//       redirect("http://localhost:3000/finish-profile");
//     } else {
//       return <div>{children}</div>;
//     }
//   }
//   return <div>{children}</div>;
// }

"use client";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { supabase } from "../config/supabaseClient";

import { Database, Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import FinishProfile from "@/components/auth/FinishProfile";
import { Sidebar } from "@/components/dashboard/SideBar";
import { useRouter } from "next/navigation";
import DashboardNavigationBar from "@/components/dashboard/DashboardNavigationBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [dataFetch, setData] = useState<Tables<"profiles"> | null>(null);
  const [alert, setAlert] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const userResponse = await supabase.auth.getSession();
      const user = userResponse.data.session?.user;
      if (user) setUser(user);
      else {
        router.push("/");
      }

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setData(data as Tables<"profiles">);
      }
    } catch (error) {
      console.error("Error fetching data");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (dataFetch) {
      if (
        dataFetch?.first_name === null ||
        dataFetch?.last_name === null ||
        dataFetch?.username === null
      ) {
        setAlert(true);
      }
    }
  }, [dataFetch]);

  return (
    <>
      <AlertDialog open={alert}>
        <AlertDialogContent>
          <FinishProfile stateChanger={setAlert} />
        </AlertDialogContent>
      </AlertDialog>

      {dataFetch && (
        <div className="">
          <div className="bg-background">
            <DashboardNavigationBar />
            <div className="">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
