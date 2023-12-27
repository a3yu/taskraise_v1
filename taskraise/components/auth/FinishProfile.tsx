"use client";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/auth-helpers-nextjs";

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

const formSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
});

function FinishProfile({
  stateChanger,
}: {
  stateChanger: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [dataFetch, setData] = useState<Tables<"profiles"> | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await supabase.auth.getUser();
        const user = userResponse.data.user;
        setUser(user);

        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          setData(data as Tables<"profiles">);
        }
      } catch (error) {
        console.error("Error fetching data");
      }
    };
    fetchData();
  }, []);
  console.log(dataFetch);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: dataFetch?.first_name ?? "",
      last_name: dataFetch?.last_name ?? "",
      username: dataFetch?.username ?? "",
    },
  });
  const onSubmit = async function (values: z.infer<typeof formSchema>) {
    try {
      if (user && dataFetch) {
        const push = await supabase
          .from("profiles")
          .update({
            first_name: dataFetch.first_name ?? values.first_name,
            last_name: dataFetch.last_name ?? values.last_name,
            username: dataFetch.username ?? values.username,
          })
          .eq("id", user.id)
          .select("*")
          .then(() => {
            stateChanger(false);
            router.refresh();
          });

        console.log(push);
      }
    } catch (error) {}
  };

  return (
    <>
      {!dataFetch ? (
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

              <section>
                <Button type="submit" className="w-full mt-2">
                  <span className="font-bold text-sm ">Finish</span>
                </Button>
              </section>

              <section className="w-full flex justify-center items-center">
                <div></div>
              </section>
            </form>{" "}
          </Form>
        </>
      )}
    </>
  );
}

export default FinishProfile;
