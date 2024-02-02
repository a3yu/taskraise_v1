"use client";
import React, { useEffect, useRef, useState } from "react";
import Logo from "@/public/black.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Filter, Search, SlidersHorizontalIcon } from "lucide-react";
import Service from "@/components/marketplace/service/ServiceCard";
import { Tables } from "@/types/supabase";
import { supabase } from "../../../app/config/supabaseClient";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import { motion } from "framer-motion";
import FilterSearch from "../FilterSearch";
import { getServicesSearchNormal } from "@/lib/server/serviceActionQuery";

function Marketplace({
  initialTickets,
  filterParamsLocation,
  filterParamsRadius,
  searchParams,
}: {
  initialTickets: Tables<"services">[];
  filterParamsLocation: string | null;
  filterParamsRadius: string | null;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const router = useRouter();
  const [tickets, setTickets] = useState<Tables<"services">[]>(initialTickets);
  const [search, setSearch] = useState<string | null>();
  const [loadedTickets, setLoadedTickets] = useState(tickets);
  const onSearch = () => {
    if (search) {
      router.push("/marketplace?search=" + search);
    }
  };
  const PAGE_COUNT = 30;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [offset, setOffset] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLast, setIsLast] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setTickets(initialTickets);
      setLoadedTickets(initialTickets);
      setOffset(1);
      setIsLast(false);
    };
    fetchData();
  }, [searchParams, filterParamsLocation, filterParamsRadius]);

  const handleScroll = () => {
    if (containerRef.current && typeof window !== "undefined") {
      const container = containerRef.current;
      const { bottom } = container.getBoundingClientRect();
      const { innerHeight } = window;
      setIsInView((prev) => bottom <= innerHeight);
    }
  };

  useEffect(() => {
    const handleDebouncedScroll = debounce(
      () => !isLast && handleScroll(),
      200
    );
    window.addEventListener("scroll", handleDebouncedScroll);
    return () => {
      window.removeEventListener("scroll", handleDebouncedScroll);
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      loadMoreTickets(offset);
    }
  }, [isInView]);

  const fetchTickets = async (
    offset: number
  ): Promise<Tables<"services">[]> => {
    const from = offset * 30;
    const to = from + 30 - 1;
    if (searchParams.radius == "remote") {
      const from = offset * 30;
      const to = from + 30 - 1;

      const { data: tickets } = await supabase
        .rpc("search_services_remote", {
          product_title: searchParams.search as string,
        })
        .select("*")
        .range(from, to);
      console.log("remote");
      return tickets ? tickets : [];
    } else if (searchParams.radius) {
      const from = offset * 30;
      const to = from + 30 - 1;

      const { data: tickets } = await supabase
        .rpc("search_services_nearby", {
          product_title: searchParams.search as string,
          dist_meters: parseFloat(searchParams.radius as string) * 1600,
          lat: parseFloat(searchParams.lat as string),
          long: parseFloat(searchParams.long as string),
        })
        .select("*")
        .range(from, to);
      console.log("nearby");
      return tickets ? tickets : [];
    }
    const tickets = await getServicesSearchNormal(
      from,
      to,
      searchParams.search as string
    );

    return tickets ? tickets : [];
  };

  const loadMoreTickets = async (offset: number) => {
    setIsLoading(true);
    setOffset((prev) => prev + 1);

    if (!isLast) {
      const newTickets = await fetchTickets(offset);

      setLoadedTickets((prevTickets) => [...prevTickets, ...newTickets]);

      if (newTickets.length < PAGE_COUNT) {
        setIsLast(true);
      }
    }

    setIsLoading(false);
  };

  return (
    <div ref={containerRef}>
      <div className="px-10 border-b">
        <div className="flex my-auto">
          <Image
            src={Logo}
            alt="Logo"
            height={80}
            className="hover:cursor-pointer"
          />
          <h1 className="font-bold text-xl my-auto -ml-2">TaskRaise</h1>
          <Input
            className="my-auto ml-6"
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
            className="my-auto bg-black hover:bg-gray-800 mx-2"
            onClick={onSearch}
          >
            <Search />
          </Button>

          <div className="mx-10 flex space-x-8">
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
      <div className="px-10 my-1">
        <div className="flex my-auto">
          <FilterSearch
            locationNameParam={filterParamsLocation}
            radiusParam={filterParamsRadius}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-evenly mx-8 my-4 ">
        {tickets.length == 0 && <h1>No search results.</h1>}
        {loadedTickets.map((ticket, index) => {
          return (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Service service={ticket} />
            </motion.div>
          );
        })}
      </div>
      <div className="w-full">
        {isLoading && <h3 className="mx-auto text-center p-5">Loading...</h3>}
      </div>
    </div>
  );
}

export default Marketplace;
