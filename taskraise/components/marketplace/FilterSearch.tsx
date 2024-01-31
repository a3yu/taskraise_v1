"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, X } from "lucide-react";
import ServiceType from "./filters/ServiceType";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { PlacesAutocomplete } from "../dashboard/PlacesAutocomplete";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { set } from "lodash";

function FilterSearch() {
  const router = useRouter();
  const [select, setSelect] = useState(false);
  const [locationChoice, setLocationChoice] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [long, setLong] = useState<number | null>(null);
  const [radius, setRadius] = useState<number | null>(null);
  console.log(radius);
  return (
    <div className="px-10 py-2 ">
      <div className="flex  space-x-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="font-medium">
              Location/Delivery Type {<ChevronDown className="pl-2" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="px-8 py-6 max-w-72">
            <RadioGroup className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="remote"
                  onClick={() => setLocationChoice("remote")}
                  checked={locationChoice === "remote"}
                  id="remote"
                />
                <Label htmlFor="remote">Remote</Label>
              </div>
              <div className="">
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem
                    value="custom"
                    id="custom"
                    onClick={() => setLocationChoice("custom")}
                    checked={locationChoice === "custom"}
                  />
                  <Label htmlFor="custom">Custom</Label>
                </div>
                <div className="mt-2 flex ">
                  <div>
                    <PlacesAutocomplete
                      disabled={!(locationChoice === "custom" || select)}
                      selectState={select}
                      setSelectState={setSelect}
                      onAddressSelect={(address) => {
                        getGeocode({ address: address }).then((results) => {
                          const { lat, lng } = getLatLng(results[0]);
                          setLat(lat);
                          setLong(lng);
                          setSelect(true);
                        });
                      }}
                    />
                  </div>
                  {select && (
                    <X
                      className="m-2 hover:cursor-pointer"
                      onClick={() => {
                        setSelect(false);
                        setLat(null);
                        setLong(null);
                      }}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <Select
                    disabled={!(locationChoice === "custom")}
                    onValueChange={(value) => {
                      setRadius(parseInt(value));
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Mile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Miles</SelectLabel>
                        <SelectItem
                          onClick={() => {
                            setRadius(50);
                          }}
                          value="25"
                        >
                          25 mi
                        </SelectItem>
                        <SelectItem
                          onClick={() => {
                            setRadius(50);
                          }}
                          value="50"
                        >
                          50 mi
                        </SelectItem>
                        <SelectItem
                          onClick={() => {
                            setRadius(100);
                          }}
                          value="100"
                        >
                          100 mi
                        </SelectItem>
                        <SelectItem
                          onSelect={() => {
                            setRadius(250);
                          }}
                          value="250"
                        >
                          250 mi
                        </SelectItem>
                        <SelectItem
                          onClick={() => {
                            setRadius(null);
                          }}
                          value="null"
                        >
                          Any
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </RadioGroup>
            <Button
              className="bg-black mt-2"
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.set("lat", lat?.toString() ?? "");
                params.set("long", long?.toString() ?? "");
                params.set("radius", radius?.toString() ?? "any");
                router.push("/marketplace?" + params.toString());
                setRadius(null);
                setLocationChoice("");
                setLat(null);
                setLong(null);
                setSelect(false);
              }}
            >
              Apply
            </Button>
          </PopoverContent>
        </Popover>
        <Button variant={"outline"} className="font-medium">
          Budget {<ChevronDown className="pl-2" />}
        </Button>
      </div>
    </div>
  );
}

export default FilterSearch;
