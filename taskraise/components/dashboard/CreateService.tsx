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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { supabase } from "@/app/config/supabaseClient";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(60, { message: "Title must be less than 60 characters." }),
  location: z.string(),
  location_text: z.string(),
  description: z
    .string()
    .min(50, {
      message: "Description must be atleast 50 characters.",
    })
    .max(800, {
      message: "Description must be less than 800 characters.",
    }),
  price: z.coerce
    .number()
    .multipleOf(0.01, {
      message: "Please use a valid currency format: two decimal points.",
    })
    .min(2, {
      message: "Service must have a price over $2",
    }),
  order_details: z.string().min(1, {
    message: "Required.",
  }),
  service_details: z.string().min(1, {
    message: "Required.",
  }),
  file_path: z.string().min(1, {
    message: "Service must have a thumbnail.",
  }),
  service_type: z.string().min(1, {
    message: "Please select a type.",
  }),
});

export function CreateService({
  dialogState,
  orgId,
  submitted,
}: {
  dialogState: Dispatch<SetStateAction<boolean>>;
  orgId: string;
  submitted: Dispatch<SetStateAction<boolean>>;
}) {
  console.log(orgId);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      location_text: "",
      description: "",
      file_path: "",
      service_type: "",
    },
  });
  const { setValue } = form;
  const [locationSelect, setLocationSelect] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [stepTwo, setStepTwo] = useState(false);
  const [uid, setUid] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (file) {
      let { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(values.file_path, file);
      console.log(uploadError);
      if (uploadError) {
        throw uploadError;
      }
    } else {
      form.setError("file_path", { message: "Issue with file upload." });
    }
    if (values.location_text == "") {
      const { error, data } = await supabase.from("services").insert({
        organization: orgId,
        service_title: values.title,
        service_description: values.description,
        thumbnail_path: values.file_path,
        price: values.price,
        delivery_type: "REMOTE",
      });
      router.push("/dashboard/services?update");
      dialogState(false);
      submitted(true);
      if (error) {
        alert(error);
      }
    } else {
      const { error } = await supabase.from("services").insert({
        organization: orgId,
        service_title: values.title,
        service_description: values.description,
        thumbnail_path: values.file_path,
        price: values.price,
        delivery_type: "LOCAL",
        location: values.location,
        location_text: values.location_text,
        service_details: values.service_details,
        customer_info: values.order_details,
      });
      router.push("/dashboard/services?update");
      dialogState(false);
      submitted(true);
      if (error) {
        alert(error);
      }
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
        setUid(user.id);
      }
    } catch (error) {
      alert("Error uploading thumbnail!");
    }
  };
  useEffect(() => {
    try {
      if (file) {
        const fileExt = file?.name.split(".").pop();
        setValue("file_path", `${uid}-${Math.random()}.${fileExt}`);
        setPreview(URL.createObjectURL(file));
        setShowPreview(true);
      }
    } catch (error) {
      alert("Error uploading thumbnail!");
    } finally {
      setUploading(false);
    }
  }, [file]);
  function calculateTakeHomePay(grossPay: number | null): string {
    if (grossPay == null) return "";
    if (grossPay < 2) {
      return "";
    }
    const deduction = grossPay * 0.05 + 0.3;

    const netPay = grossPay - deduction;

    return netPay.toFixed(2);
  }

  return (
    <div className="">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {!stepTwo && (
              <>
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
                                getGeocode({ address: address }).then(
                                  (results) => {
                                    const { lat, lng } = getLatLng(results[0]);
                                    setValue(
                                      "location",
                                      "POINT(" + lat + " " + lng + ")"
                                    );
                                    setValue("location_text", address);
                                    setLocationSelect(true);
                                  }
                                );
                              }}
                            />
                          </div>
                          {locationSelect && (
                            <div className="m-2 ml-auto">
                              <X
                                className="hover:cursor-pointer"
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
                      <FormDescription>
                        Leave empty if remote service.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file_path"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="service_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Service Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Service Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Types</SelectLabel>
                              <SelectItem value="event">
                                Event (eg. summer camp, workshop, etc.)
                              </SelectItem>
                              <SelectItem value="local">
                                Local Service (eg. lawn mowing, leave raking,
                                etc.)
                              </SelectItem>
                              <SelectItem value="freelance">
                                Freelance Service (eg. graphic design, web
                                design, etc.)
                              </SelectItem>
                              <SelectItem value="hourly">
                                Hourly Rate Service (eg. tutoring, dog walking,
                                etc.)
                              </SelectItem>
                              <SelectItem value="merchandise">
                                Merchandise (eg. donuts, cookies, etc.)
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {stepTwo && (
              <>
                <FormField
                  control={form.control}
                  name="order_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Information</FormLabel>
                      <FormControl>
                        <Textarea />
                      </FormControl>
                      <FormDescription>
                        Tell the customer what information you need from them.{" "}
                        <br /> (eg. address, email, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(form.getValues("service_type") == "freelance" ||
                  form.getValues("service_type") == "local" ||
                  form.getValues("service_type") == "hourly") && (
                  <FormField
                    control={form.control}
                    name="service_details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availablity/Delivery Time</FormLabel>
                        <FormControl>
                          <Textarea />
                        </FormControl>
                        <FormDescription>
                          Tell the customer when you are available/expected
                          delivery times. <br /> (eg. 9am-5pm, Monday-Friday)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.getValues("service_type") == "event" && (
                  <FormField
                    control={form.control}
                    name="service_details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Details</FormLabel>
                        <FormControl>
                          <Textarea />
                        </FormControl>
                        <FormDescription>
                          Tell the customer the details about the event. <br />{" "}
                          (eg. where it is, what it is, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.getValues("service_type") == "merchandise" && (
                  <FormField
                    control={form.control}
                    name="service_details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchandise Details</FormLabel>
                        <FormControl>
                          <Textarea />
                        </FormControl>
                        <FormDescription>
                          Tell the customer the details about the merchandise.{" "}
                          <br /> (eg. what it is, how many, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.getValues("service_type") == "other" && (
                  <FormField
                    control={form.control}
                    name="service_details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details</FormLabel>
                        <FormControl>
                          <Textarea />
                        </FormControl>
                        <FormDescription>
                          Tell the customer anything they should know about this
                          service.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex space-x-6">
                  {" "}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Price
                          {form.getValues("service_type") == "hourly" &&
                            " (per hour)"}
                        </FormLabel>
                        <FormControl>
                          <>
                            <Input
                              type="number"
                              prefix="$"
                              step="0.01"
                              placeholder="$"
                              {...field}
                            />
                            <p className="text-xs mt-1">
                              To keep our platform operating safely and securely
                              we charge 5% + 30&#162;
                            </p>
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            <div className="w-full pt-2">
              {!stepTwo && (
                <Button
                  type="button"
                  onClick={async () => {
                    console.log(form.getValues("file_path"));
                    const isValid = await form.trigger([
                      "file_path",
                      "title",
                      "description",
                      "location",
                      "service_type",
                      "file_path",
                    ]);
                    if (isValid) {
                      setStepTwo(true);
                    }
                  }}
                >
                  Continue
                </Button>
              )}
              {stepTwo && (
                <>
                  <Button type="submit">Submit</Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setStepTwo(false);
                    }}
                  >
                    Back
                  </Button>
                </>
              )}
              <Button
                type="button"
                className="float-right bg-red-500 hover:bg-red-400"
                onClick={() => {
                  dialogState(false);
                  setStepTwo(false);
                }}
              >
                Close
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <AlertDialog open={showPreview}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <h1 className="font-heading text-2xl">Preview</h1>
          </AlertDialogHeader>
          {preview && (
            <div className="w-72 h-40 relative mx-auto ">
              <Image
                src={preview}
                alt={""}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </div>
          )}
          <AlertDialogFooter>
            <Button
              onClick={() => {
                setShowPreview(false);
              }}
            >
              Looks Good!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
