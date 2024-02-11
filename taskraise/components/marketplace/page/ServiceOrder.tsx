"use client";
import NavigationBarSearch from "@/components/navigation/NavigationBarSearch";

import React, { useEffect, useState } from "react";
import Logo from "@/public/black.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, MapPin, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

function ServiceOrder({
  service,
  primaryCampaign,
  organization,
}: {
  service: Tables<"services">;
  primaryCampaign: Tables<"campaigns"> | null;
  organization: Tables<"organizations">;
}) {
  const exampleFields = [
    "Where is your venue?",
    "When is your event?",
    "Any extra details?",
  ];
  const schemaShape: ZodRawShape = exampleFields.reduce<
    Record<string, ZodTypeAny>
  >((acc, fieldName) => {
    acc[fieldName] = z
      .string()
      .min(1, { message: "This field is required." })
      .max(500);
    return acc;
  }, {});
  const formSchema = z.object(schemaShape);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
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
                  {exampleFields.map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldName}</FormLabel>
                          <FormControl>
                            <Textarea />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
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
                      {formatted}
                    </p>
                  </div>
                  <div className="w-full">
                    <Button className="text-center w-2/3 mx-auto block mt-6 bg-black  hover:bg-gray-800">
                      Confirm and Pay
                    </Button>
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
