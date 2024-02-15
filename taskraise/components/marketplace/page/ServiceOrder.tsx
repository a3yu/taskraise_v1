"use client";
import NavigationBarSearch from "@/components/navigation/NavigationBarSearch";

import React, { useEffect, useState } from "react";
import Logo from "@/public/black.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  CircleDollarSign,
  Lock,
  MapPin,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { supabase } from "@/app/config/supabaseClient";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodRawShape, ZodTypeAny, z } from "zod";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";

import { User } from "@supabase/supabase-js";
const formSchema = z.object({
  hours: z.coerce
    .number()
    .multipleOf(0.01, {
      message: "Please use a valid currency format: two decimal points.",
    })
    .min(1, {
      message: "Must be atleast an hour.",
    })
    .max(24, {
      message: "Must be less than a day.",
    }),
  units: z.coerce
    .number()
    .multipleOf(0.01, {
      message: "Please use a valid currency format: two decimal points.",
    })
    .min(1, {
      message: "Must be atleast an hour.",
    }),
  order_details: z.string().min(1, {
    message: "Required.",
  }),
});
function ServiceOrder({
  service,
  primaryCampaign,
  organization,
  user,
}: {
  service: Tables<"services">;
  primaryCampaign: Tables<"campaigns"> | null;
  organization: Tables<"organizations">;
  user: User;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: 1,
      hours: 1,
    },
  });

  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("thumbnails")
          .download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setThumbnail(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }
    downloadImage(service.thumbnail_path);
  }, [supabase]);
  const onImageLoad = () => {
    setLoading(false);
  };
  const steps = ["Order Details", "Payment"];
  const [search, setSearch] = useState<string | null>(steps[0]);
  const router = useRouter();
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(service.price);
  function calculateTotalPayment() {
    const total = form.watch("hours") * service.price * form.watch("units");
    if (!total) {
      return -1;
    }
    return total;
  }
  function calculateServiceCharge() {
    const total = form.watch("hours") * service.price * form.watch("units");
    if (!total) {
      return -1;
    }
    return total * 0.029 + 0.3;
  }
  function calculateTotalCharge() {
    const total = form.watch("hours") * service.price * form.watch("units");
    if (!total) {
      return -1;
    }
    return total + total * 0.029 + 0.3;
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error, data } = await supabase.from("services").insert({
      org_id: organization.id,
      price: calculateTotalCharge(),
      order_details: values.order_details,
      units: values.units,
    });
  }
  return (
    <div>
      <div className="px-0 sm:px-10 border-b">
        <div className="flex my-auto pb-5 pt-0 sm:py-0">
          <Image
            src={Logo}
            alt="Logo"
            height={80}
            className="hover:cursor-pointer hidden sm:inline "
            onClick={() => {
              router.push("/");
            }}
          />
          <h1
            className="font-bold text-xl my-auto -ml-2 hover:cursor-pointer hidden sm:inline"
            onClick={() => {
              router.push("/");
            }}
          >
            TaskRaise
          </h1>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y">
          <div className="p-10 px-32 flex w-full justify-evenly space-x-20">
            <div className="flex-grow space-y-5">
              <Card>
                <CardHeader className="font-bold text-xl bg-gray-100">
                  {steps[0]}
                </CardHeader>

                <CardContent className="p-8 space-y-5">
                  <FormField
                    control={form.control}
                    name="order_details"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Order Details</FormLabel>
                        <Textarea {...field} />
                        <FormDescription>
                          {service.customer_info}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {service.service_type == "hourly" && (
                    <div className="flex space-x-6">
                      <FormField
                        control={form.control}
                        name="hours"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Hours</FormLabel>
                            <Input type="number" min="0" step="1" {...field} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <p>
                    <span className="font-semibold -pb-4">Details: </span>
                    {service.service_details}
                  </p>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="font-bold text-xl bg-gray-100">
                  {steps[1]}
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
            <div className="w-1/3">
              <Card className="">
                <CardContent className="p-5">
                  {" "}
                  <div className="flex space-x-3 ">
                    <div className="w-[125px] h-[67px] relative ">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={"thumbnail image"}
                          layout="fill"
                          objectFit="cover"
                          onLoad={onImageLoad}
                          className="rounded"
                          style={{ display: loading ? "none" : "block" }}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">
                        {service.service_title}
                      </h3>
                    </div>
                  </div>
                  <Separator
                    orientation="horizontal"
                    className="bg-gray-300 my-5"
                  />
                  <div className="flex items-center">
                    <MapPin />
                    <p className="text-base font-normal ml-2 my-auto">
                      {service.location_text ? service.location_text : "Remote"}
                    </p>
                  </div>
                  <div className="flex items-center mt-2">
                    <CircleDollarSign />
                    <p className="text-base font-normal ml-2 my-auto">
                      {formatted}{" "}
                      {service.service_type == "hourly" && " (per hour)"}
                    </p>
                  </div>
                  <Separator
                    orientation="horizontal"
                    className="bg-gray-300 my-5"
                  />
                  <FormField
                    control={form.control}
                    name="units"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex space-x-2">
                          <p className="my-auto">Qty. </p>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            {...field}
                            className="w-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {calculateServiceCharge() != -1 && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="mt-6 flex justify-between">
                          <h2 className="text-sm font-normal">Service Cost</h2>
                          {calculateTotalPayment() != -1 && (
                            <h2 className="font-semibold text-base">
                              ${calculateTotalPayment().toFixed(2)}
                            </h2>
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1, delay: 0.2 }}
                      >
                        <div className="mt-4 flex justify-between">
                          <h2 className="text-sm font-normal">
                            Service Charge
                          </h2>
                          {calculateServiceCharge() != -1 && (
                            <h2 className="font-semibold text-base">
                              ${calculateServiceCharge().toFixed(2)}
                            </h2>
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1, delay: 0.4 }}
                      >
                        <div className="mt-4 flex justify-between">
                          <h2 className="text-2xl font-semibold">Total</h2>
                          {calculateTotalCharge() != -1 && (
                            <h2 className="font-semibold text-2xl">
                              ${calculateTotalCharge().toFixed(2)}
                            </h2>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                  <div className="w-full">
                    <Button className="text-center w-2/3 mx-auto mt-6 block bg-black  hover:bg-gray-700">
                      Confirm and Pay
                    </Button>
                    <p className="mt-2 text-gray-500 text-center text-sm">
                      Your payment will be refunded if the organization does not
                      accept the order in 4 days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ServiceOrder;
