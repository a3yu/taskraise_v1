"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { HashLoader } from "react-spinners";
import { Suspense } from "react";
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
import { Tables } from "@/types/supabase";
import Loader from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";

const formSchema = z.object({
  first_name: z.string().trim().min(1, { message: "This field is required." }),
  last_name: z.string().trim().min(1, { message: "This field is required." }),
  username: z.string().trim().min(1, { message: "This field is required." }),
  gen_role: z.string().trim().min(1, { message: "This field is required." }),
});

export default function FinishSignUpForm({
  profile,
  user,
}: {
  profile: Tables<"profiles">;
  user: User | null;
}) {
  const [dataFetch, setData] = useState<Tables<"profiles">>(profile);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: dataFetch?.first_name ?? "",
      last_name: dataFetch?.last_name ?? "",
      username: dataFetch?.username ?? "",
      gen_role: dataFetch?.gen_role ?? "",
    },
  });
  const onSubmit = async function (values: z.infer<typeof formSchema>) {
    try {
      if (user && dataFetch) {
        console.log(values);
        const push = await supabase
          .from("profiles")
          .update({
            first_name: values.first_name,
            last_name: values.last_name,
            username: values.username,
            gen_role: values.gen_role,
          })
          .eq("id", user.id)
          .select("*")
          .then(() => {
            router.refresh();
            router.push("/");
          });

        console.log(push);
      }
    } catch (error) {}
  };

  return !dataFetch ? (
    <div className="w-full">
      <h3 className="text-center font-bold text-xs">Loading..</h3>
    </div>
  ) : (
    <>
      <section className="">
        <h1 className="text-3xl font-heading py-2">
          Finish setting up your profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in all fields to continue.
        </p>
      </section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {!dataFetch?.first_name && (
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!dataFetch?.last_name && (
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!dataFetch?.username && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!dataFetch?.gen_role && (
            <FormField
              control={form.control}
              name="gen_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <div className="flex space-x-4 justify-center items-stretch">
                      <div className="flex-1">
                        <Card
                          onClick={() => form.setValue("gen_role", "BUYER")}
                          className={`hover:cursor-pointer ${
                            form.getValues().gen_role === "BUYER"
                              ? "border-2 border-blue-500"
                              : ""
                          } h-full`} // Added h-full to make Card stretch to the full height of its parent
                        >
                          <CardContent className="p-5 flex flex-col justify-between">
                            {" "}
                            {/* Adjusted for internal spacing and distribution */}
                            <h3 className="font-semibold">Customer</h3>
                            <p className="text-gray-600 text-sm">
                              I am looking to support organizations.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="flex-1">
                        <Card
                          onClick={() =>
                            form.setValue("gen_role", "FUNDRAISER")
                          }
                          className={`hover:cursor-pointer ${
                            form.getValues().gen_role === "FUNDRAISER"
                              ? "border-2 border-blue-500"
                              : ""
                          } h-full`} // Added h-full to make Card stretch to the full height of its parent
                        >
                          <CardContent className="p-5 flex flex-col justify-between">
                            {" "}
                            {/* Adjusted for internal spacing and distribution */}
                            <h3 className="font-semibold">Fundraiser</h3>
                            <p className="text-gray-600 text-sm">
                              I am looking to raise funds.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <section>
            <Button type="submit" className="w-full mt-2">
              <span className="font-bold text-sm ">Finish</span>
            </Button>
          </section>

          <section className="w-full flex justify-center items-center">
            <div className="flex-row">
              <a
                className="text-sm hover:cursor-pointer "
                onClick={() => {
                  supabase.auth.signOut().then(() => {
                    router.replace("/");
                  });
                }}
              >
                Sign Out
              </a>
            </div>
          </section>
        </form>{" "}
      </Form>
    </>
  );
}
