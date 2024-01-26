import React, { useEffect } from "react";
import { Icons } from "../icon";
import Link from "next/link";
import { Button } from "../ui/button";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

async function NavigationBar() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  return (
    <div className="p-5 px-10 ">
      <section className="flex">
        <div className="flex space-x-3 items-center">
          <Icons.logo className="text-black" />
          <h1 className="hidden font-bold sm:inline-block">TaskRaise</h1>
        </div>
        <div className="flex space-x-5 ml-5">
          <Link
            href="hello"
            className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
          >
            Hello
          </Link>
          <Link
            href="hello"
            className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
          >
            Hello
          </Link>
          <Link
            href="hello"
            className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
          >
            Hello
          </Link>
        </div>
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
      </section>
    </div>
  );
}

export default NavigationBar;
