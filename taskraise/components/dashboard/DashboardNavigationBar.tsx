import React, { useEffect } from "react";
import { Icons } from "../icon";
import Link from "next/link";
import { ChevronDown, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function DashboardNavigationBar() {
  return (
    <div className="p-5 px-10 border-b">
      <section className="flex">
        <div className="flex space-x-3 items-center">
          <LayoutDashboard />
          <h1 className="hidden font-bold sm:inline-block">Dashboard</h1>
        </div>
        <div className="flex space-x-7 ml-10">
          <Link
            href="/dashboard"
            className="flex items-center text-lg font-semibold transition-colors hover:text-foreground/80 sm:text-sm"
          >
            Overview
          </Link>

          <Link
            href="/dashboard/services"
            className="flex items-center text-lg font-semibold transition-colors hover:text-foreground/80 sm:text-sm"
          >
            Services
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <h2 className=" text-lg font-semibold transition-colors hover:text-foreground/80 sm:text-sm">
                Organization
              </h2>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={"/dashboard/members"}>Members</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/dashboard/settings"}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/dashboard/billing"}>Billing</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/account"
            className="flex items-center text-lg font-semibold transition-colors hover:text-foreground/80 sm:text-sm"
          >
            My Account
          </Link>
        </div>
      </section>
    </div>
  );
}

export default DashboardNavigationBar;
