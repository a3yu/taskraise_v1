import React, { useState } from "react";
import Logo from "@/public/black.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function NavigationBarSearch() {
  const [search, setSearch] = useState<string | null>();
  const onSearch = () => {
    if (search) {
      router.push("/marketplace?search=" + search);
    }
  };
  const router = useRouter();
  return (
    <div className="px-0 sm:px-10 border-b">
      <div className="w-full flex justify-between sm:hidden">
        <div className="flex">
          <Image
            src={Logo}
            alt="Logo"
            height={80}
            className="hover:cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          />
          <h1
            className="font-bold text-xl my-auto -ml-2 hover:cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            TaskRaise
          </h1>
        </div>
        <div className="flex space-x-7 mr-3">
          <h2 className="font-semibold my-auto text-gray-600">Orders</h2>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Example 1</DropdownMenuItem>
              <DropdownMenuItem>Example 2</DropdownMenuItem>
              <DropdownMenuItem>Example 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex my-auto pb-5 pt-0 sm:py-0">
        <Image
          src={Logo}
          alt="Logo"
          height={80}
          className="hover:cursor-pointer hidden sm:inline "
          onClick={() => {
            router.push("/");
          }}
        />
        <h1
          className="font-bold text-xl my-auto -ml-2 hover:cursor-pointer hidden sm:inline"
          onClick={() => {
            router.push("/");
          }}
        >
          TaskRaise
        </h1>
        <Input
          className="my-auto ml-6 min-w-40 rounded-br-none rounded-tr-none"
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
          className="my-auto bg-black hover:bg-gray-800 rounded-bl-none rounded-tl-none"
          onClick={onSearch}
        >
          <Search height={18} />
        </Button>

        <div className="mx-10 space-x-7 hidden sm:flex">
          <h2 className="font-semibold my-auto text-gray-600">Orders</h2>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Example 1</DropdownMenuItem>
              <DropdownMenuItem>Example 2</DropdownMenuItem>
              <DropdownMenuItem>Example 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default NavigationBarSearch;
