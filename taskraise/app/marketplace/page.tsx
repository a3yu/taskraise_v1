import Marketplace from "@/components/marketplace/page/Marketplace";
import NoSearch from "@/components/marketplace/page/NoSearch";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseServer } from "@/app/config/supabaseServerClient";

import React from "react";

async function MarketplaceMain({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (!("search" in searchParams)) {
    return <NoSearch />;
  } else {
    const { data: tickets } = await supabaseServer
      .from("services")
      .select("*")
      .textSearch("title_description", searchParams.search as string)
      .limit(10);
    return (
      <Marketplace
        searchParams={searchParams.search as string}
        initialTickets={tickets ? tickets : []}
      />
    );
  }
}

export default MarketplaceMain;
