"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Logo from "@/public/black.svg";
import { ArrowRight, CircleDollarSign, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/supabase";
import { supabase } from "@/app/config/supabaseClient";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

export default function ServicePage({
  service,
  organization,
  primaryCampaign,
}: {
  service: Tables<"services">;
  organization: Tables<"organizations">;
  primaryCampaign: Tables<"campaigns"> | null;
}) {
  console.log(primaryCampaign);
  const router = useRouter();
  const [search, setSearch] = useState<string | null>();
  const onSearch = () => {
    if (search) {
      router.push("/marketplace?search=" + search);
    }
  };
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

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(service.price);
  const date = new Date(organization.created_at);
  function formatDollarAmounts(amount: number, total: number) {
    const formattedAmount = Math.round(amount);
    const formattedTotal = Math.round(total);

    return `$${formattedAmount} out of $${formattedTotal}`;
  }
  const [campaignDescription, setCampaignDescription] = useState(false);

  return (
    <div>
      {primaryCampaign && (
        <Dialog
          open={campaignDescription}
          onOpenChange={(open) => {
            setCampaignDescription(open);
          }}
        >
          <DialogContent>
            <h1 className="font-bold text-2xl">
              {primaryCampaign.campaign_name}
            </h1>
            <p>{primaryCampaign.campaign_description}</p>
          </DialogContent>
        </Dialog>
      )}
      <div className="px-0 sm:px-10 border-b">
        <div className="w-full flex justify-between sm:hidden">
          <div className="flex">
            <Image
              src={Logo}
              alt="Logo"
              height={80}
              className="hover:cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            />
            <h1
              className="font-bold text-xl my-auto -ml-2 hover:cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              TaskRaise
            </h1>
          </div>
          <div className="flex space-x-7 mr-3">
            <h2 className="font-semibold my-auto text-gray-600">Orders</h2>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Example 1</DropdownMenuItem>
                <DropdownMenuItem>Example 2</DropdownMenuItem>
                <DropdownMenuItem>Example 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
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
          <Input
            className="my-auto ml-6 min-w-40 rounded-r-none rounded-b-none"
            placeholder="Search..."
            onSubmit={onSearch}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSearch();
              }
            }}
          />
          <Button
            className="my-auto bg-black hover:bg-gray-800 rounded-l-none rounded-bl-none"
            onClick={onSearch}
          >
            <Search height={18} />
          </Button>

          <div className="mx-10 space-x-7 hidden sm:flex">
            <h2 className="font-semibold my-auto text-gray-600">Orders</h2>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Example 1</DropdownMenuItem>
                <DropdownMenuItem>Example 2</DropdownMenuItem>
                <DropdownMenuItem>Example 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="pt-16 px-10 sm:px-32 flex flex-wrap justify-center sm:justify-evenly">
        <div className="">
          <h1 className="font-heading text-4xl font-semibold">
            {service.service_title}
          </h1>
          <div className="flex mb-6 mt-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <div>
                <h3 className="text-md font-medium">{organization.org_name}</h3>
              </div>
              <Separator orientation="horizontal" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {organization.location_text}
                </h3>
              </div>
            </div>
          </div>
          <div className="w-[300px] h-[166px] sm:w-[600px] sm:h-[332px] 2xl:w-[700px] 2xl:h-[388px] relative mx-auto  ">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={"thumbnail image"}
                layout="fill"
                objectFit="fill"
                onLoad={onImageLoad}
                className="rounded"
                style={{ display: loading ? "none" : "block" }}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="sm:p-10 py-10">
          <Card className=" w-80 sm:w-[28rem] mx-auto">
            <CardContent className="p-5">
              <h3 className="font-bold text-2xl">Service</h3>
              {/* <p className="mt-1 text-lg">{organization.description}</p> */}
              <p className="mt-2 text-base">{service.service_description}</p>
              <div className="flex items-center mt-5">
                <MapPin />
                <p className="text-base ml-2 my-auto">
                  {service.location_text ? service.location_text : "Remote"}
                </p>
              </div>
              <div className="flex items-center mt-2">
                <CircleDollarSign />
                <p className="text-base ml-2 my-auto">{formatted}</p>
              </div>
              <Button
                className="text-center w-2/3 mx-auto block mt-6 bg-black font-semibold text-xl hover:bg-gray-800"
                onClick={() => {
                  router.push("/marketplace/service/" + service.id + "/order");
                }}
              >
                Order
              </Button>
            </CardContent>
          </Card>
          {primaryCampaign && (
            <Card className="max-w-md mx-auto mt-7">
              <CardContent className="p-5">
                {" "}
                <p className="-mb-2 font-semibold text-xl">
                  {primaryCampaign.campaign_name}
                </p>
                <Progress
                  value={
                    (primaryCampaign.amt_raised / primaryCampaign.amt_goal) *
                    100
                  }
                  className="h-3 my-4"
                />
                <p className="-mt-2 text-sm">
                  {formatDollarAmounts(
                    primaryCampaign.amt_raised,
                    primaryCampaign.amt_goal
                  )}
                </p>
                <p
                  className="text-right -mb-1 hover:underline text-blue-600 hover:cursor-pointer"
                  onClick={() => {
                    setCampaignDescription(true);
                  }}
                >
                  Learn More
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-3xl mt-5">About this Organization</h3>
          <div className="pt-6 flex">
            <Avatar className="w-20 h-20">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="ml-6">
              <h1 className="text-xl font-semibold">{organization.org_name}</h1>
              <p className="my-1">
                {organization.total_orders} orders completed
              </p>
            </div>
          </div>
          <Card className="p-5 my-6 mb-10">
            <p className=" text-base">{organization.description}</p>
            <Separator orientation="horizontal" className="my-4" />
            <div className="flex space-x-20">
              <div>
                <h3 className="">From</h3>
                <p className="my-auto font-semibold">
                  {organization.location_text}
                </p>
              </div>
              <div>
                <h3 className="">Member Since</h3>
                <p className="my-auto font-semibold">{date.toDateString()}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
