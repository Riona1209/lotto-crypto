"use client";

import { Check, ChevronsUpDown, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";

import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";

const versions = [
  {
    value: "1.0",
    label: "1.0",
  },
  {
    value: "2.0",
    label: "2.0",
  },
];

export const Navbar = () => {
  const wallet = "0x56DFC05c1ec7759f065b10815949ee464D0f73B7";

  const walletMini = `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(versions[0]?.value);

  return (
    <>
      <nav className="flex items-center justify-between p-4 px-6">
        <div className="flex gap-4">
          <h1 className="font-bold text-xl">LottoCrypto</h1>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? versions.find((framework) => framework.value === value)
                      ?.label
                  : "Select version."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search a version." />
                <CommandEmpty>No version found.</CommandEmpty>
                <CommandGroup>
                  {versions.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === framework.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-neutral-400">{walletMini}</span>
          <Button size="icon" variant="ghost">
            <LogOut></LogOut>
          </Button>
        </div>
      </nav>
      <Separator />
    </>
  );
};
