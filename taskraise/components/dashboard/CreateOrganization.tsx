"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/app/config/supabaseClient";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { X } from "lucide-react";
import { createStripeAccount } from "@/utils/stripe";
const formSchema = z.object({
  org_name: z
    .string()
    .min(1, {
      message: "Organization must have name.",
    })
    .max(50, {
      message: "Organization name must be at most 50 characters.",
    }),
  description: z
    .string()
    .min(1, {
      message: "Organization must have description.",
    })
    .max(300, {
      message: "Description must be at most 300 characters.",
    }),
  location: z
    .string()
    .min(1, { message: "Organization must have a location." }),
  location_text: z
    .string()
    .min(1, { message: "Organization must have a location." }),
});

export default function CreateOrganization({
  user,
  dialogState,
}: {
  user: string;
  dialogState: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [locationSelect, setLocationSelect] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      org_name: "",
      description: "",
      location: "",
    },
  });
  const { setValue } = form;

  const onSubmit = async function (values: z.infer<typeof formSchema>) {
    const stripeAcc = await createStripeAccount();
    const { data, error } = await supabase
      .from("organizations")
      .insert({
        org_name: values.org_name,
        description: values.description,
        org_owner: user,
        location: values.location,
        location_text: values.location_text,
        stripe_account: stripeAcc.id,
      })
      .select("*")
      .single();
    if (error) {
      setError(error.message);
      setShowError(true);
    } else {
      const userPush = await supabase
        .from("profiles")
        .update({
          organization: data.id,
        })
        .eq("id", user);
      router.refresh();
    }
  };
  return (
    <>
      <section className="">
        <h1 className="text-3xl font-heading py-2">Create Your Organization</h1>
        <p className="text-sm text-muted-foreground">
          Start your fundraising journey now.
        </p>
      </section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="org_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="Organization Name" {...field} />
                </FormControl>
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
          <section>
            {showError && (
              <p className="text-red-500 text-xs font-semibold">{error}</p>
            )}{" "}
            <div className="flex">
              <div className="mr-auto">
                <Button type="submit" className="mt-2">
                  <span className="font-semibold text-sm ">Create</span>
                </Button>
              </div>
              <div className="ml-auto">
                <Button
                  type="button"
                  onClick={() => {
                    dialogState(false);
                  }}
                  className="bg-red-500 hover:bg-red-400 mt-2"
                >
                  <span className="font-semibold text-sm ">Close</span>
                </Button>
              </div>
            </div>
          </section>

          <section className="w-full flex justify-center items-center">
            <div></div>
          </section>
        </form>{" "}
      </Form>
    </>
  );
}
