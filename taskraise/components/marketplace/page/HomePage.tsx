"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import React, { useState } from "react";
import SearchBar from "../SearchBar";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Logo from "@/public/black.svg";
import Image from "next/image";
import { supabase } from "@/app/config/supabaseClient";
import Image123 from "@/public/imagetop.svg";

function HomePage({ user }: { user: User | null }) {
  const router = useRouter();
  const [search, setSearch] = useState<string | null>();
  const [userState, setUserState] = useState(user);

  const onSearch = () => {
    if (search) {
      router.push("/marketplace?search=" + search);
    }
  };
  return (
    <div>
      <section className="space-y-6 pb-8 md:pb-12 bg-primary ">
        <div className="p-5 px-10 -mt-2 ">
          <section className="flex">
            <div className="flex items-center">
              <Image
                src={Logo}
                alt="Logo"
                height={80}
                className="hover:cursor-pointer filter brightness-0 invert"
              />
              <h1 className="font-bold text-xl my-auto -ml-2 hover:cursor-pointer text-white">
                TaskRaise
              </h1>
            </div>
            <div className="flex space-x-8 ml-10">
              {/* <Link
            href=""
            className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm underline-offset-2 hover:underline"
          >
            For Businesses
          </Link> */}
            </div>
            <div className="my-auto ml-auto">
              {!userState ? (
                <>
                  <Button className="ml-auto" variant={"outline"}>
                    {" "}
                    <Link href={"/sign-in"}>Sign In</Link>
                  </Button>
                  <Button className="ml-2 text-white" variant="link">
                    <Link href={"/sign-up"}>Sign Up</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button className="ml-auto" variant="outline">
                    {" "}
                    <Link href={"/dashboard"}>Dashboard</Link>
                  </Button>
                  <Button
                    className="ml-2 text-white"
                    variant="link"
                    onClick={() => {
                      supabase.auth.signOut();
                      setUserState(null);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </section>
        </div>
        <div className="">
          <div className="flex px-32 -mt-10">
            <div className="container flex flex-col gap-4 my-auto ">
              <h1 className="font-heading text-white text-left font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground ">
                Find the right service.
                <br /> Support a cause.
              </h1>
              <div className="flex mt-7">
                <Input
                  className="my-auto min-w-40 w-8/12 rounded-tr-none rounded-br-none"
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
                  className="my-auto bg-black hover:bg-gray-800 rounded-tl-none rounded-bl-none"
                  onClick={onSearch}
                >
                  <Search height={18} />
                </Button>
              </div>
            </div>
            <div className="">
              <Image
                src={Image123}
                alt="1"
                className="hidden md:inline"
                height={900}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
