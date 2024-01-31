import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

function ServiceType() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Popover open={open}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="font-semibold"
            onClick={() => {
              setOpen(true);
            }}
          >
            Service Type {<ChevronDown className="pl-2" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent>Hello</PopoverContent>
      </Popover>
    </div>
  );
}

export default ServiceType;
