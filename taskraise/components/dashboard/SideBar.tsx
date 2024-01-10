import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

import Link from "next/link";
import { DollarSign, Gauge, Home, Settings, User } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  userName: string;
}

export function Sidebar({ className, userName }: SidebarProps) {
  return (
    <div className={cn("pb-12 h-full border-r ", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {userName}
            </h2>
            <div className="ml-auto mr-2"></div>
          </div>
          <div className="space-y-1">
            <Link href="/dashboard" className="w-full justify-start">
              <Button variant="ghost" className="w-full justify-start">
                <Home size={15} className="mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Organization
          </h2>
          <div className="space-y-1">
            <Link href={"/dashboard/members"}>
              <Button variant="ghost" className="w-full justify-start">
                <User size={15} className="mr-2" />
                Members
              </Button>
            </Link>
            <Link href={"/dashboard/fundraising"}>
              <Button variant="ghost" className="w-full justify-start">
                <DollarSign size={15} className="mr-2" />
                Fundraising
              </Button>
            </Link>
            <Link href={"/dashboard/services"}>
              <Button variant="ghost" className="w-full justify-start">
                <Gauge size={15} className="mr-2" />
                Services
              </Button>
            </Link>
            <Link href={"/dashboard/settings"}>
              <Button variant="ghost" className="w-full justify-start">
                <Settings size={15} className="mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
