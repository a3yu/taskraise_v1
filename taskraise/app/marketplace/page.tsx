import Marketplace from "@/components/marketplace/page/Marketplace";
import NoSearch from "@/components/marketplace/page/NoSearch";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import React from "react";

async function MarketplaceMain({
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
  if (!("search" in searchParams)) {
    return <NoSearch />;
  } else {
    const { data: tickets } = await supabase
      .from("services")
      .select("*")
      .textSearch("title_description", searchParams.search as string, {
        type: "websearch",
        config: "english",
      })
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
