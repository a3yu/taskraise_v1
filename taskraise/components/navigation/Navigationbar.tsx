import React, { useEffect } from "react";
import Logo from "@/public/black.svg";
import Link from "next/link";
import { Button } from "../ui/button";
import { User } from "@supabase/auth-helpers-nextjs";

import Image from "next/image";

function NavigationBar({ user }: { user: User | null }) {
  return (
    <div className="p-5 px-10 -mt-2 ">
      <section className="flex">
        <div className="flex items-center">
          <Image
            src={Logo}
            alt="Logo"
            height={80}
            className="hover:cursor-pointer"
          />
          <h1 className="font-bold text-xl my-auto -ml-2 hover:cursor-pointer">
            TaskRaise
          </h1>
        </div>
        <div className="flex space-x-8 ml-10">
          <Link
            href="about"
            className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm underline-offset-2 hover:underline"
          >
            About
          </Link>
          <Link
            href="marketplace"
            className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm underline-offset-2 hover:underline"
          >
            Marketplace
          </Link>
          {/* <Link
            href=""
            className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm underline-offset-2 hover:underline"
          >
            For Businesses
          </Link> */}
        </div>
        <div className="my-auto ml-auto">
          {!user ? (
            <>
              <Button className="ml-auto">
                {" "}
                <Link href={"/sign-in"}>Sign In</Link>
              </Button>
              <Button className="ml-2 text-black" variant="link">
                <Link href={"/sign-up"}>Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button className="ml-auto">
                {" "}
                <Link href={"/dashboard"}>Dashboard</Link>
              </Button>
              <Button className="ml-2 text-black" variant="link">
                <Link href={"/api/signout"}>Sign Out</Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default NavigationBar;
