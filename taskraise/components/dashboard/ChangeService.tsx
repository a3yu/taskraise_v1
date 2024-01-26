import { Tables } from "@/types/supabase";
import { CoreRow } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { X } from "lucide-react";
import { supabase } from "@/app/config/supabaseClient";
import { useRouter } from "next/navigation";

export function ChangeService({
  rowService,
  dialogState,
}: {
  rowService: CoreRow<Tables<"services">>;
  dialogState: Dispatch<SetStateAction<boolean>>;
}) {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [editDescription, setEditDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [editPrice, setEditPrice] = useState(false);
  const [price, setPrice] = useState("");
  const [editLocation, setEditLocation] = useState(false);
  const [locationSelect, setLocationSelect] = useState(false);
  const [locationValue, setLocationValue] = useState<string | null>(null);
  const [locationText, setLocationText] = useState<string | null>("");
  const router = useRouter();
  console.log(title);
  const getDollar = (amountDollar: number) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amountDollar);
    return formatted;
  };
  return (
    <div>
      <h2 className="font-bold text-md">Title</h2>
      <div className="space-x-2">
        {editTitle ? (
          <div className="mt-2 flex">
            <Input
              placeholder="Title"
              className="mr-3 mb-2"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <Button
              className="mr-1"
              onClick={async () => {
                const updateTitle = await supabase
                  .from("services")
                  .update({ service_title: title })
                  .eq("id", rowService.original.id);
                dialogState(false);
              }}
            >
              Change
            </Button>
            <Button
              variant={"link"}
              onClick={() => {
                setEditTitle(false);
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="mb-2">
            <p>{rowService.original.service_title} </p>
            <p
              className="text-primary hover:underline hover:cursor-pointer text-sm"
              onClick={() => {
                setEditTitle(true);
              }}
            >
              Edit
            </p>
          </div>
        )}
      </div>
      <h2 className="font-bold text-md">Description</h2>
      <div className="space-x-2">
        {editDescription ? (
          <div className="mt-2 ">
            <Textarea
              placeholder="Description"
              className="mr-3 mb-2 w-full"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <Button
              className="mr-1 mb-2"
              onClick={async () => {
                const updateDescription = await supabase
                  .from("services")
                  .update({ service_description: description })
                  .eq("id", rowService.original.id);

                dialogState(false);
              }}
            >
              Change
            </Button>
            <Button
              variant={"link"}
              onClick={() => {
                setEditDescription(false);
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="mb-2">
            <p>{rowService.original.service_description}</p>
            <p
              className="text-primary hover:underline hover:cursor-pointer text-sm"
              onClick={() => {
                setEditDescription(true);
              }}
            >
              Edit
            </p>
          </div>
        )}
      </div>
      <h2 className="font-bold text-md">Price</h2>
      <div className="space-x-2">
        {editPrice ? (
          <div className="mt-2 flex">
            <Input
              placeholder="$"
              className="mr-3 mb-2"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
            <Button
              className="mr-1"
              onClick={async () => {
                const updateDescription = await supabase
                  .from("services")
                  .update({ price: price })
                  .eq("id", rowService.original.id);

                dialogState(false);
              }}
            >
              Change
            </Button>
            <Button
              variant={"link"}
              onClick={() => {
                setEditPrice(false);
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="mb-2">
            <p>
              {rowService.original.location_text == ""
                ? "REMOTE"
                : getDollar(rowService.original.price)}
            </p>
            <p
              className="text-primary hover:underline hover:cursor-pointer text-sm"
              onClick={() => {
                setEditPrice(true);
              }}
            >
              Edit
            </p>
          </div>
        )}
      </div>
      <h2 className="font-bold text-md">Delivery Style/Location</h2>
      <div className="space-x-2">
        {editLocation ? (
          <div className="mt-2 flex ">
            <div className="w-full mr-2">
              <PlacesAutocomplete
                setSelectState={setLocationSelect}
                selectState={locationSelect}
                onAddressSelect={(address) => {
                  getGeocode({ address: address }).then((results) => {
                    const { lat, lng } = getLatLng(results[0]);
                    setLocationValue("POINT(" + lat + " " + lng + ")");
                    setLocationText(address);
                    setLocationSelect(true);
                  });
                }}
              />
            </div>
            {locationSelect && (
              <div className="m-2 ml-auto">
                <X
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setLocationValue(null);
                    setLocationText(null);
                    setLocationSelect(false);
                  }}
                />
              </div>
            )}
            <Button
              className="mr-1"
              onClick={async () => {
                const updateLocation = await supabase
                  .from("services")
                  .update({
                    location: locationValue,
                    location_text: locationText,
                  })
                  .eq("id", rowService.original.id);

                dialogState(false);
              }}
            >
              Change
            </Button>
            <Button
              variant={"link"}
              onClick={() => {
                setEditLocation(false);
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="mb-2">
            <p>
              {rowService.original.location_text === null
                ? "REMOTE"
                : rowService.original.location_text}
            </p>
            <p
              className="text-primary hover:underline hover:cursor-pointer text-sm"
              onClick={() => {
                setEditLocation(true);
              }}
            >
              Edit
            </p>
          </div>
        )}
      </div>
      <Button
        className="float-right mt-4"
        onClick={() => {
          dialogState(false);
        }}
      >
        Close
      </Button>
    </div>
  );
}
