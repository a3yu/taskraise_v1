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
import { IncomingOrders } from "./IncomingOrders";
import { OngoingOrders } from "./OngoingOrders";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { orderQuery } from "@/lib/queryTypes";
import { Progress } from "../ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { insertCampaign, updateCampaign } from "@/lib/server/campaignActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PastOrders } from "./PastOrders";

const formSchema = z.object({
  campaign_name: z
    .string()
    .min(1, { message: "Campaign must have name." })
    .max(50, { message: "Campaign name must be at most 50 characters." }),
  campaign_description: z
    .string()
    .min(1, { message: "Campaign must have description." })
    .max(300, { message: "Description must be at most 300 characters." }),
  amt_goal: z.coerce
    .number()
    .min(1, { message: "Goal must be at least $1" })
    .multipleOf(0.01, {
      message: "Please use a valid currency format: two decimal points.",
    }),
});

function AssignedUser({
  orgData,
  orgOrdersOngoing,
  orgOrdersIncoming,
  orgOrdersFinished,
  campaign,
}: {
  orgData: Tables<"organizations">;
  orgOrdersOngoing: (orderQuery & { username: string })[];
  orgOrdersIncoming: (orderQuery & { username: string })[];
  orgOrdersFinished: (orderQuery & { username: string })[];
  campaign: Tables<"campaigns"> | null;
}) {
  const [campaignState, setCampaign] = useState<Tables<"campaigns"> | null>(
    campaign
  );
  let totalPrice = 0;
  const ongoingTasks = orgOrdersOngoing.length;
  const completedTasks = orgOrdersFinished.length;
  orgOrdersFinished.forEach((order) => {
    totalPrice += order.price;
  });
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalPrice);
  function formatDollarAmounts(amount: number, total: number) {
    const formattedAmount = Math.round(amount);
    const formattedTotal = Math.round(total);

    return `$${formattedAmount} out of $${formattedTotal}`;
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (campaignState == null) {
      const newCampaign = await insertCampaign(
        values.campaign_name,
        values.amt_goal,
        values.campaign_description,
        orgData.id
      );

      if (newCampaign) {
        setCampaign(newCampaign);
        setShowConfirm(false);
        setShow(false);
      }
    } else {
      const newCampaign = await updateCampaign(
        campaignState.id,
        values.campaign_name,
        values.amt_goal,
        values.campaign_description
      );

      if (newCampaign) {
        setCampaign(newCampaign);
        setShowConfirm(false);
        setShow(false);
        form.reset();
      }
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div className="">
      <div className="flex">
        <h1 className="text-4xl font-bold font-heading">{orgData.org_name}</h1>
        <div className="ml-auto ">
          <div className="ml-auto">
            <Button
              onClick={() => {
                setShow(true);
              }}
            >
              New/Change Campaign
            </Button>
            <Dialog open={show} onOpenChange={setShow}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New/Change Campaign</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                  >
                    <FormField
                      control={form.control}
                      name="campaign_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Campaign Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amt_goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fundraising Goal</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              prefix="$"
                              step="0.01"
                              placeholder="$"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="campaign_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure you want to change your campaign?
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex mt-2 space-x-5">
                          <Button
                            className="bg-green-500 hover:bg-green-400"
                            onClick={() => {
                              onSubmit(form.getValues());
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                            className="bg-red-500 hover:bg-red-400"
                            onClick={() => {
                              setShowConfirm(false);
                              setShow(false);
                              form.reset();
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <DialogFooter>
                      <Button
                        type="button"
                        onClick={() => {
                          if (campaign == null) {
                            // create campaign
                          } else {
                            form.trigger().then((isValid) => {
                              if (isValid) {
                                setShowConfirm(true);
                              }
                            });
                          }
                        }}
                      >
                        Add/Change Campaign
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
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
            <Card>
              <CardContent className="p-5">
                {campaignState != null && (
                  <>
                    <p className="-mb-2 font-semibold text-md">
                      {campaignState.campaign_name}
                    </p>
                    <div className="flex">
                      <Progress
                        value={
                          (campaignState.amt_raised / campaignState.amt_goal) *
                          100
                        }
                        className="h-3 my-4"
                      />
                    </div>
                    <p className="-mt-2 -mb-2 text-sm">
                      {formatDollarAmounts(
                        campaignState.amt_raised,
                        campaignState.amt_goal
                      )}
                    </p>
                  </>
                )}
                {campaignState == null && (
                  <>
                    <p className="-mb-2 font-semibold text-xl">
                      Start a campaign!
                    </p>
                    <div className="flex">
                      <Progress value={0} className="h-3 my-4" />
                    </div>
                    <p className="-mt-2 -mb-2 text-sm">$0 out of $0 raised</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 p-2">
              <CardHeader>
                <CardTitle>Incoming Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <IncomingOrders orgOrders={orgOrdersIncoming} />
              </CardContent>
            </Card>
            <Card className="col-span-3 p-2">
              <Tabs defaultValue="ongoing">
                <TabsList className="grid w-72 grid-cols-2 mt-5 ml-5 -mb-3  ">
                  <TabsTrigger value="ongoing">Ongoing Orders</TabsTrigger>
                  <TabsTrigger value="past">Past Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="ongoing">
                  <CardHeader>
                    <CardTitle>Ongoing Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OngoingOrders orgOrders={orgOrdersOngoing} />
                  </CardContent>
                </TabsContent>
                <TabsContent value="past">
                  {" "}
                  <CardHeader>
                    <CardTitle>Past Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PastOrders orgOrders={orgOrdersFinished} />
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignedUser;
