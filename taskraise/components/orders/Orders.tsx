"use client";
import React from "react";
import { User } from "@supabase/supabase-js";
import NavigationBarSearch from "../navigation/NavigationBarSearch";
import { OrderTable } from "./OrderTable";
import { Tables } from "@/types/supabase";
import { orderQuery, orderQueryUser } from "@/lib/queryTypes";

function Orders({
  user,
  orders,
}: {
  user: User | null;
  orders: (orderQueryUser & { org_name: string })[];
}) {
  return (
    <div>
      <NavigationBarSearch />
      <div className="px-24 py-10">
        <h1 className="text-3xl font-bold">Orders</h1>
        <OrderTable orgOrders={orders} />
      </div>
    </div>
  );
}

export default Orders;
