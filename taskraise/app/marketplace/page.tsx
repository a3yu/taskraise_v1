import Marketplace from "@/components/marketplace/page/Marketplace";
import NoSearch from "@/components/marketplace/page/NoSearch";
import { Database, Tables } from "@/types/supabase";
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
    if ("radius" in searchParams) {
      if (searchParams.radius != "remote") {
        const { data: tickets } = await supabase
          .rpc("search_services_nearby", {
            product_title: searchParams.search as string,
            dist_meters: parseFloat(searchParams.radius as string) * 1600,
            lat: parseFloat(searchParams.lat as string),
            long: parseFloat(searchParams.long as string),
          })
          .select("*")
          .limit(40);

        return (
          <Marketplace
            searchParams={searchParams}
            filterParamsLocation={searchParams.localName as string}
            filterParamsRadius={searchParams.radius as string}
            initialTickets={tickets ? tickets : []}
          />
        );
      } else {
        const { data: tickets } = await supabase
          .rpc("search_services_remote", {
            product_title: searchParams.search as string,
          })
          .select("*")
          .limit(40);
        return (
          <Marketplace
            searchParams={searchParams}
            filterParamsLocation={searchParams.localName as string}
            filterParamsRadius={searchParams.radius as string}
            initialTickets={tickets ? tickets : []}
          />
        );
      }
    }

    const { data: tickets } = await supabase
      .rpc("search_services", {
        product_title: searchParams.search as string,
      })
      .select("*")
      .limit(40);

    return (
      <Marketplace
        searchParams={searchParams}
        filterParamsLocation={null}
        filterParamsRadius={null}
        initialTickets={tickets ? tickets : []}
      />
    );
  }
}

export default MarketplaceMain;
