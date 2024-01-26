import React, { useEffect, useState } from "react";
import Image from "next/image";
import Example from "@/public/example.jpg";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tables } from "@/types/supabase";
import { supabase } from "@/app/config/supabaseClient";
import LoadingIcons from "react-loading-icons";
import { Star } from "lucide-react";

function ServiceCard({ service }: { service: Tables<"services"> }) {
  const [thumbnail, setThumbnail] = useState("");
  const exampleCampaign = "FRC Worlds Trip";
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
  return (
    <Card className=" m-2">
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
        <h3 className="my-auto ml-2">Talon Robotics</h3>
      </div>
      <div className="px-3 pt-2 pb-2">
        <p className="text-md">
          {service.service_title.substring(0, 50)}{" "}
          {service.service_title.length >= 50 && "..."}
        </p>
      </div>
      <div className="px-3 pb-2">
        <p className="text-md font-bold">$30</p>
        <p className="text-xs font-medium inline-block -mt-2">670+ orders</p>
      </div>
      <div className="px-3 pt-1 pb-2">
        <p className="text-xs pb-1 font-medium">
          {exampleCampaign.substring(0, 50)}{" "}
          {exampleCampaign.length >= 50 && "..."}
        </p>
        <Progress value={22} className="h-2" />
        <p className="text-xs pt-1">$120 out of $900</p>
      </div>
    </Card>
  );
}

export default ServiceCard;
