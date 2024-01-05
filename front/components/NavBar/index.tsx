"use client";

import {
  Check,
  ChevronsUpDown,
  LogIn,
  LogOut,
  User,
  Wallet,
} from "lucide-react";
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
import { useAccount } from "@/contexts/AccountContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

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
  const { address, logout, connectMetaMask } = useAccount();

  const walletMini = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

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
          {address && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <User className="mr-1"></User>
                  {walletMini}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Profile</DialogTitle>
                  <DialogDescription>
                    Infos about your wallet in LottoCrypto.
                  </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="flex items-center justify-end p-2">
                  <Button variant="secondary" onClick={() => logout()}>
                    Disconnect
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Separator orientation="vertical" className="h-6" />
          {address ? (
            <Button size="icon" variant="ghost">
              <LogOut
                className="h-4 w-4"
                onClick={() => {
                  logout();
                }}
              ></LogOut>
            </Button>
          ) : (
            <Button size="icon" variant="ghost">
              <LogIn
                className="h-4 w-4"
                onClick={() => {
                  connectMetaMask();
                }}
              ></LogIn>
            </Button>
          )}
        </div>
      </nav>
      <Separator />
    </>
  );
};
