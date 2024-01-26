"use client";
import React from "react";
import Logo from "@/public/black.svg";
import Image from "next/image";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="mx-10 ">
      <div className="flex my-auto">
        <Image
          src={Logo}
          alt="Logo"
          height={80}
          className="hover:cursor-pointer"
        />
        <h1 className="font-bold text-xl my-auto -ml-2">TaskRaise</h1>
        <Input className="my-auto ml-6" placeholder="Search..." />
        <Button className="my-auto">
          <Search />
        </Button>
        <div className="mx-10 flex space-x-5">
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

export default SearchBar;
