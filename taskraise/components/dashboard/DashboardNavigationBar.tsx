import React, { useEffect } from "react";
import { Icons } from "../icon";
import Link from "next/link";

function DashboardNavigationBar() {
  return (
    <div className="p-5 px-10 border-b">
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
      </section>
    </div>
  );
}

export default DashboardNavigationBar;
