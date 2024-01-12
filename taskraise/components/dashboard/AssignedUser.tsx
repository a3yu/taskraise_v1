"use client";
import { Tables } from "@/types/supabase";
import React, { useEffect, useState } from "react";
import OrganizationUsers from "./OrganizationUsers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomingOrders } from "./IncomingOrders";
import { OngoingOrders } from "./OngoingOrders";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

function AssignedUser({
  orgData,
  orgOrders,
  orgUsers,
}: {
  orgData: Tables<"organizations">;
  orgOrders: Tables<"orders">[];
  orgUsers: Tables<"profiles">[];
}) {
  const [update, setUpdate] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get("update");
  const router = useRouter();
  useEffect(() => {
    if (search) {
      setUpdate(true);
      router.push("/dashboard");
    } else {
      setUpdate(false);
    }
  }, []);

  let totalPrice = 0;
  let ongoingTasks = 0;
  let completedTasks = 0;
  orgOrders.forEach((order) => {
    if (order.status === "COMPLETED") {
      totalPrice += order.price;
      completedTasks++;
    } else if (order.status === "ONGOING") {
      ongoingTasks++;
    }
  });
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalPrice);
  return (
    <div className="px-16 py-7 ">
      <div className="flex">
        <h1 className="text-4xl font-bold font-heading">{orgData.org_name}</h1>
        <Button className="ml-auto">Create Service</Button>
      </div>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Funds Raised
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Organization Member(s)
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orgUsers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ongoing Tasks
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ongoingTasks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 p-2">
              <CardHeader>
                <CardTitle>Incoming Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <IncomingOrders orgOrders={orgOrders} />
              </CardContent>
            </Card>
            <Card className="col-span-3 p-2">
              <CardHeader>
                <CardTitle>Ongoing Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <OngoingOrders orgOrders={orgOrders} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignedUser;
