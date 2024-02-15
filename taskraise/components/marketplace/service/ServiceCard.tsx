import React, { useEffect, useState } from "react";
import Image from "next/image";
import Example from "@/public/example.jpg";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tables } from "@/types/supabase";
import { supabase } from "@/app/config/supabaseClient";
import LoadingIcons from "react-loading-icons";
import { useRouter } from "next/navigation";
import { searchQuery } from "@/lib/queryTypes";

function ServiceCard({ service }: { service: searchQuery }) {
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(true);
  function formatDollarAmounts(amount: number, total: number) {
    const formattedAmount = Math.round(amount);
    const formattedTotal = Math.round(total);

    return `$${formattedAmount} out of $${formattedTotal}`;
  }
  const a = service.campaigns;

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
  const formatNumber = (num: number) => {
    if (num < 1000) {
      return num.toString(); // For numbers less than 1000, return as is.
    } else if (num < 1000000) {
      // For thousands, return with 'k'.
      return (num / 1000).toFixed(num % 1000 !== 0 ? 1 : 0) + "k";
    } else {
      // For millions, return with 'm'.
      return (num / 1000000).toFixed(num % 1000000 !== 0 ? 1 : 0) + "m";
    }
  };
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(service.price);
  return (
    <Card
      className=" m-2 hover:cursor-pointer hover:scale-105 hover:animate-in scale-100 animate-out"
      onClick={() => {
        window.open("/marketplace/service/" + service.id, "_blank");
      }}
    >
      <div className="w-72 h-40 relative ">
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
      <div className="px-3 pt-2 font-semibold text-sm flex">
        <Avatar className="h-6 w-6">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h3 className="my-auto ml-2"></h3>
      </div>
      <div className="px-3 pt-2 pb-2">
        <p className="text-md">
          {service.service_title.substring(0, 50)}{" "}
          {service.service_title.length >= 50 && "..."}
        </p>
      </div>
      <div className="px-3 pb-2">
        <p className="text-md font-bold">
          {formatted}
          <span className="text-xs font-normal">
            {service.service_type == "hourly" && " per hour"}
          </span>
        </p>
        <p className="text-xs font-medium inline-block -mt-2">
          {formatNumber(service.orders_count)} orders
        </p>
      </div>

      <div className="px-3 pt-1 pb-2">
        <p className="text-xs pb-1 font-medium">
          {service.campaigns.campaign_name.substring(0, 50)}{" "}
          {service.campaigns.campaign_name.length >= 50 && "..."}
        </p>
        <Progress value={22} className="h-2" />
        <p className="text-xs pt-1">
          {formatDollarAmounts(
            service.campaigns.amt_raised,
            service.campaigns.amt_goal
          )}{" "}
        </p>
      </div>
    </Card>
  );
}

export default ServiceCard;
