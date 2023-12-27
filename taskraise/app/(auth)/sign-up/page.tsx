"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database } from "@/types/supabase";
import { supabase } from "@/app/config/supabaseClient";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Username must be at least 5 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

export default function SignUpForm() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  const onSubmit = async function (values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
          },
        },
      });
      if (error) {
        setError(error.message);
        setShowError(true);
      } else {
        setShowSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertDialog open={showSuccess}>
        <section className="">
          <h1 className="text-3xl font-heading py-2">Create a new account</h1>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href={"sign-in"} className="underline text-blue-600">
              Sign In.
            </Link>
          </p>
        </section>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <section>
              {showError && (
                <p className="text-red-500 text-xs font-semibold">{error}</p>
              )}
              <Button type="submit" className="w-full mt-2">
                <span className="font-bold text-sm ">Sign Up</span>
              </Button>
              <p className="text-xs text-muted-foreground my-5 text-center">
                or
              </p>
            </section>

            <section className="w-full flex justify-center items-center">
              <Button variant={"outline"} type="button">
                <div className="mr-2 h-4 w-4">
                  <FaGoogle />
                </div>
                Google
              </Button>
            </section>
            <section>
              <p className="text-xs text-muted-foreground my-5">
                By creating an account, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </section>
          </form>{" "}
        </Form>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogHeader>Verify your identity</AlertDialogHeader>
            <AlertDialogDescription>
              An email has been sent to your email address. Please verify your
              account and
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                setShowSuccess(false);
                router.push("/sign-in");
              }}
            >
              Take me to login
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
