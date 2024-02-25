"use client";
import { formatDollar } from "@/components/helper/functions";
import NavigationBarSearch from "@/components/navigation/NavigationBarSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { orderQueryUser } from "@/lib/queryTypes";
import { Tables } from "@/types/supabase";
import Link from "next/link";
import React, { useState } from "react";
import { Pagination } from "../MessagePagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { insertMessage } from "@/lib/server/messageActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/app/config/supabaseClient";
import { useRouter } from "next/navigation";
import { completeOrder } from "@/lib/server/orderActions";
const formSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Message must have content." })
    .max(600, { message: "Message must be at most 600 characters." }),
});
function OrderDetails({
  order,
  service,
  messages,
  profile,
}: {
  order: orderQueryUser;
  service: Tables<"services"> & {
    organizations: Tables<"organizations"> | null;
  };
  messages: Tables<"messages">[] | null;
  profile: Tables<"profiles">;
}) {
  const [messagesState, setMessages] = useState<Tables<"messages">[]>(
    messages == null ? [] : messages
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(5); // Adjust the number of messages per page as needed
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const totalMessages = messagesState?.length ? messagesState.length : 0;
  const indexOfLastMessage =
    totalMessages - (currentPage - 1) * messagesPerPage;
  const indexOfFirstMessage = Math.max(indexOfLastMessage - messagesPerPage, 0);
  const currentMessages = messagesState?.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );
  const [show, setShow] = useState(false);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newMessage = await insertMessage(
      order.customer_id,
      order.id,
      values.message,
      profile.username as string
    );
    if (newMessage != null) {
      setMessages(messagesState.concat(newMessage));
      form.reset();
      setShow(false);
    }
  }
  async function completeOrderClient() {
    const amount = order.price - order.platform_fee;
    await completeOrder(order.id);
    await supabase.from("messages").insert({
      sender: "System",
      order_id: order.id,
      payload: "Order has been completed.",
      from: "System",
    });
    router.push("/orders");
  }
  const router = useRouter();

  return (
    <div>
      <NavigationBarSearch />
      <div className="p-10 px-24">
        <Card>
          <CardHeader>
            <div className="flex">
              <div className="flex-row space-y-1">
                <CardTitle className="font-bold">Order #{order.id}</CardTitle>
                <div>
                  <p className="text-sm mt-2">
                    Organization:{" "}
                    <span className="font-bold">
                      {service.organizations?.org_name}
                    </span>{" "}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    Gig:{" "}
                    <Link
                      className="text-blue-500 font-semibold hover:underline"
                      href={"/marketplace/" + service.id}
                    >
                      {service.service_title}
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm">Amount: {order.units}</p>
                </div>
                {service.service_type === "hourly" && (
                  <>
                    <p className="text-sm">Hours: {order.hours}</p>
                  </>
                )}
              </div>
              <div className="ml-auto">
                <h2 className="font-semibold text-3xl">
                  {formatDollar(order.price)}
                </h2>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="mt-5">
          <CardHeader>
            <div className="flex">
              <Dialog open={show} onOpenChange={setShow}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Message</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-3"
                    >
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button>Send</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <CardTitle>Messages</CardTitle>
              <div className="flex ml-auto space-x-4">
                <Button
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  Send a Message
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-500"
                  onClick={async () => {
                    await completeOrderClient().then(() => {
                      router.push("/orders");
                    });
                  }}
                >
                  Mark as complete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentMessages?.length === 0 && (
                <p className="text-center">No messages.</p>
              )}
              {currentMessages?.toReversed().map((message) => (
                <Card key={message.id}>
                  <CardHeader>
                    <CardTitle>{message.from}</CardTitle>
                  </CardHeader>
                  <CardContent>{message.payload}</CardContent>
                </Card>
              ))}
              <div className="mt-4">
                <Pagination
                  messagesPerPage={messagesPerPage}
                  totalMessages={
                    messagesState?.length ? messagesState.length : 0
                  }
                  paginate={paginate}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OrderDetails;
