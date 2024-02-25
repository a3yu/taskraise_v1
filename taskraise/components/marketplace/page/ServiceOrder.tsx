"use client";
import NavigationBarSearch from "@/components/navigation/NavigationBarSearch";

import React, { Suspense, useEffect, useState } from "react";
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
import { Stripe, StripeError } from "@stripe/stripe-js";
import { PaymentElement, useElements } from "@stripe/react-stripe-js";
import { useStripe } from "@stripe/react-stripe-js";
import * as config from "@/config";

import { User } from "@supabase/supabase-js";
import { createPaymentIntent } from "@/utils/stripe";
import { Dialog } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
const formSchema = z.object({
  cardholder_name: z.string().min(1, {
    message: "Required.",
  }),
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
  const stripe = useStripe();
  const elements = useElements();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: 1,
      hours: 1,
    },
  });

  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(true);

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
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }
  function calculateServiceCharge() {
    const total = form.watch("hours") * service.price * form.watch("units");
    if (!total) {
      return -1;
    }
    return Math.round((total * 0.029 + 0.3 + Number.EPSILON) * 100) / 100;
  }
  function calculateTotalCharge() {
    const total = form.watch("hours") * service.price * form.watch("units");
    if (!total) {
      return -1;
    }
    return calculateTotalPayment() + calculateServiceCharge();
  }
  const [open, setOpen] = useState(false);
  const [input, setInput] = React.useState<{
    customDonation: number;
    cardholderName: string;
  }>({
    customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
    cardholderName: "",
  });
  const [paymentType, setPaymentType] = React.useState<string>("");
  const [payment, setPayment] = React.useState<{
    status: "initial" | "processing" | "error";
  }>({ status: "initial" });
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (elements && stripe) {
        setPayment({ status: "processing" });
        const { error: submitError } = await elements.submit();
        if (submitError) {
          window.alert("An unknown error occurred");
          return;
        }
        const { client_secret: clientSecret, id: paymentIntentID } =
          await createPaymentIntent(calculateTotalCharge());
        const { error, data } = await supabase.from("orders").insert({
          org_id: organization.id,
          customer_id: user.id,
          price: calculateTotalCharge(),
          order_details: values.order_details,
          status: "REQUESTED",
          hours: values.hours,
          units: values.units,
          payment_intent: paymentIntentID,
          service: service.id,
          platform_fee: calculateServiceCharge(),
        });
        if (error) {
          window.alert(
            "An error occurred while processing your order. Please try again later."
          );
          console.log(error);
          return;
        } else {
          const { error: confirmError } = await stripe!.confirmPayment({
            elements,
            clientSecret,
            redirect: "if_required",
            confirmParams: {
              receipt_email: user.email,
              return_url: "http://localhost:3000",
              payment_method_data: {
                billing_details: {
                  name: values.cardholder_name,
                },
              },
            },
          });
          if (confirmError) {
            window.alert("An unknown error occurred");
          } else {
            setOpen(true);
          }
        }
      }
    } catch (err) {
      const { message } = err as StripeError;
      console.log(message);

      setPayment({ status: "error" });
      setErrorMessage(message ?? "An unknown error occurred");
    }
  }

  return (
    <div>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <h1 className="text-2xl font-bold">Thank you for your order!</h1>
          </AlertDialogHeader>
          <p>Your order has been sent to the organization.</p>
          <Button
            onClick={() => {
              router.push("/orders");
            }}
          >
            Continue
          </Button>
        </AlertDialogContent>
      </AlertDialog>
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
                  <p className="text-sm">
                    <span className="font-semibold -pb-4">Details: </span>
                    {service.service_details}
                  </p>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="font-bold text-xl bg-gray-100">
                  {steps[1]}
                </CardHeader>
                <CardContent className="p-5">
                  <FormField
                    control={form.control}
                    name="cardholder_name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-2">
                        <FormLabel className="font-normal text-[#30313D]">
                          Card Name
                        </FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <PaymentElement />
                </CardContent>
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
                    <Button
                      className="text-center w-2/3 mx-auto mt-6 block bg-black  hover:bg-gray-800"
                      disabled={payment.status == "processing"}
                    >
                      Confirm and Pay
                    </Button>{" "}
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
