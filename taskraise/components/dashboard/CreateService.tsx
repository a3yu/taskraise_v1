"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CurrencyInput from "react-currency-input-field";
import { Input } from "@/components/ui/input";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { Dispatch, SetStateAction, useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { supabase } from "@/app/config/supabaseClient";

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(300, { message: "Title must be less than 300 characters." }),
  location: z.string().min(1, {
    message: "Service must have a location.",
  }),
  location_text: z.string().min(1, {
    message: "Service must have a location.",
  }),
  description: z
    .string()
    .min(1, {
      message: "Service must have a description.",
    })
    .max(300, {
      message: "Service must be less than 300 characters.",
    }),
  price: z.coerce
    .number()
    .multipleOf(0.01, {
      message: "Please use a valid currency format: two decimal points.",
    })
    .min(1, {
      message: "Service must have a price",
    }),
  file_path: z.string().min(1, {
    message: "Service must have a thumbnail.",
  }),
});

export function CreateService({
  dialogState,
}: {
  dialogState: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      location_text: "",
      description: "",
      file_path: "",
    },
  });
  const { setValue } = form;
  const [locationSelect, setLocationSelect] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (file) {
      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(values.file_path, file);

      if (uploadError) {
        throw uploadError;
      }
    } else {
      form.setError("file_path", { message: "Issue with file upload." });
    }
  }

  const uploadThumbnail: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);
      const user = await (await supabase.auth.getUser()).data.user;
      if (user) {
        if (!event.target.files || event.target.files.length === 0) {
          throw new Error("You must select an image to upload.");
        }

        setFile(event.target.files[0]);
        const fileExt = file?.name.split(".").pop();
        setValue("file_path", `${user.id}-${Math.random()}.${fileExt}`);
      }
    } catch (error) {
      alert("Error uploading thumbnail!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Title</FormLabel>
              <FormControl>
                <Input placeholder="We will..." {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (City)</FormLabel>
              <FormControl>
                <div className="flex">
                  <div className="w-full">
                    <PlacesAutocomplete
                      setSelectState={setLocationSelect}
                      selectState={locationSelect}
                      onAddressSelect={(address) => {
                        getGeocode({ address: address }).then((results) => {
                          const { lat, lng } = getLatLng(results[0]);
                          setValue(
                            "location",
                            "POINT(" + lat + " " + lng + ")"
                          );
                          setValue("location_text", address);
                          setLocationSelect(true);
                        });
                      }}
                    />
                  </div>
                  {locationSelect && (
                    <div className="m-2 ml-auto">
                      <X
                        onClick={() => {
                          setValue("location", "");
                          setValue("location_text", "");
                          setLocationSelect(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-6">
          {" "}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="$" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={uploadThumbnail}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full pt-2">
          <Button type="submit">Submit</Button>
          <Button
            type="button"
            className="float-right bg-red-500 hover:bg-red-400"
            onClick={() => {
              dialogState(false);
            }}
          >
            Close
          </Button>
        </div>
      </form>
    </Form>
  );
}
