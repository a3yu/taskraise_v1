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
import {
  getServicesSearchNearby,
  getServicesSearchNormal,
  getServicesSearchRemote,
} from "@/lib/server/serviceQuery";
import { searchQuery } from "@/lib/queryTypes";

import NavigationBarSearch from "@/components/navigation/NavigationBarSearch";

function Marketplace({
  initialTickets,
  filterParamsLocation,
  filterParamsRadius,
  searchParams,
}: {
  initialTickets: searchQuery[];
  filterParamsLocation: string | null;
  filterParamsRadius: string | null;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const router = useRouter();
  const [tickets, setTickets] = useState<searchQuery[]>(initialTickets);
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

  const fetchTickets = async (offset: number): Promise<searchQuery[]> => {
    const from = offset * 30;
    const to = from + 30 - 1;
    if (searchParams.radius == "remote") {
      const tickets = await getServicesSearchRemote(
        from,
        to,
        searchParams.search as string
      );
      console.log("remote");
      return tickets ? tickets : [];
    } else if (searchParams.radius) {
      const tickets = await getServicesSearchNearby(
        from,
        to,
        searchParams.string as string,
        searchParams.radius as string,
        searchParams.lat as string,
        searchParams.long as string
      );
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
      <NavigationBarSearch />
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
